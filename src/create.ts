import { Subject, Subscriber, merge } from './reactive'

const KEY = '__ReactiveState__'

export const observe = (input: any): Subscriber<void> => {
  if (!input[KEY]) {
    throw new Error('NothingToObserve')
  }
  return input[KEY]
}

export const create = <T>(source: T): T => {
  if ((source as any)[KEY]) {
    return source
  }

  const subject = new Subject<void>()
  const subjects: Subscriber<void>[] = [subject]

  if (Array.isArray(source)) {
    for (let i = 0; i < source.length; i++) {
      if (typeof source[i] === 'object') {
        source[i] = create(source[i])
        subjects.push(observe(source[i]))
      } else {
        source[i] = source[i]
      }
    }
    source = new Proxy<any>(source, {
      get(target, key) {
        if (key === KEY) return  merge(...subjects)
        return target[key]
      },
      set(target, propKey, value) {
        if (target[propKey] === value) {
          return true;
        }
        if (typeof value === 'object') {
          target[propKey] = create(value)
          subjects.push(observe(target[propKey]))
        } else {
          target[propKey] = value
        }
        subject.next()
        return true
      },
    })
  } else if (typeof source === 'object') {
    const proxy: any = {}
    
    for (const key in source) {
      if (key === KEY || key === 'toJSON') {
        continue
      } else if (typeof source[key] === 'object') {
        proxy[key] = create(source[key])
        subjects.push(observe(proxy[key]))
      } else {
        proxy[key] = source[key]
      }

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
          subject.next()
          return true
        }
      })
    }

    Object.defineProperty(source, KEY, {
      enumerable: false,
      value: merge(...subjects)
    })  
  }

  return source 
}
 