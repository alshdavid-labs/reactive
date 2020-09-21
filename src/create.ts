type Callback<T = any> = (value: T) => void

interface Subscription {
  u: () => void
}

class S<T> {
  private _s: Callback<T>[] = []

  s(cb: Callback<T>): Subscription {
    this._s.push(cb)
    return {
      u: () => this._s = this._s.filter(v => v !== cb)
    }
  }

  n(value: T) {
    for (const cb of this._s) {
      cb(value)
    }
  }
}

const KEY = '[[ReactiveState]]'

export type State = {
  onChange: S<void>
  children: Array<State>
  patched: string[]
}

export const create = <T,>(source: T): T => {
  if ((source as any)[KEY]) {
    return watch(source, source, (source as any)[KEY])
  }
  const state: State = {
    onChange: new S(),
    children: [],
    patched: []
  }

  const _source: any = watch(source, source, state)
  Object.defineProperty(_source, KEY, {
    enumerable: false,
    value: state
  })
  Object.defineProperty(_source, 'toJSON', {
    enumerable: false,
    value: function () {
      var result: any = {};
      for (var x in this) {
        if (x !== KEY) {
          result[x] = this[x];
        }
      }
      return result;
    }
  })
  return _source 
}

const notify = (state: State) => {
  state.onChange.n()
  for (const child of state.children) {
    notify(child)
  }
}

const watch = (
  rootSource: any,
  source: any, 
  node: State,
): any => {
  if (Array.isArray(source)) {
    return watchArray(rootSource, source, node)
  }
  return watchObject(rootSource, source, node)
}

const watchArray = (
  rootSource: any,
  source: any, 
  node: State,
):any => {
  const result = new Proxy<any>(source, {
    get(target, prop) {
      if (Array.isArray(target[prop])) {
        return watchArray(rootSource, target[prop], node)
      } else if (typeof target[prop] === 'object') {
        return watchObject(rootSource, target[prop], node)
      }
      return target[prop]
    },
    set(target, propKey, value) {
      if (target[propKey] === value) {
        return true;
      }
      target[propKey] = value; 
      notify(node)
      return true
    },
  })
  return result
}

const watchObject = (
  rootSource: any,
  source: any, 
  node: State,
): any => {
  const proxy: any = {}
  for (const key in source) {
    if (key === KEY || key === 'toJSON') {
      continue
    }
    if (source[key][KEY]) {
      (source[key][KEY] as State).children.push(node)
    } else if (Array.isArray(source[key])) {
      source[key] = watchArray(rootSource, source[key], node)
    } else if (typeof source[key] === 'object') {
      source[key] = watchObject(rootSource, source[key], node)
    } else if (node.patched.includes(key)) {
      continue
    }
    proxy[key] = source[key]
    Object.defineProperty(source, key, {
      enumerable: true,
      get: () => {
        return proxy[key]
      },
      set: (value) => {
        if (proxy[key] === value) {
          return true
        }
        proxy[key] = value
        notify(node)
        return true
      }
    })
    node.patched.push(key)
  }
  return source
}

export type DisposeFn = () => void

export const observe = <T,>(
  source: T, 
  cb: (value: T) => void,
  watch: Array<() => any> = []
): DisposeFn => {
  const watchCache: any[] = []
  for (const cb of watch) {
    watchCache.push(cb())
  }
  const _source: any = source
  const state: State = _source[KEY]
  const subscription = state.onChange.s(() => {
    if (watch.length === 0) {
      cb(source)
      return
    }
    for (let i = 0; i < watch.length; i++) {
      const update = watch[i]()
      if (watchCache[i] !== update) {
        watchCache[i] = update
        cb(source)
        return
      }
    }
  })
  return () => subscription.u()
}