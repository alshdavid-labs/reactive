import { Subject, Subscriber, merge } from './reactive'

const KEY = '__ReactiveState__'

export const observe = (input: any): Subscriber<void> => {
  if (!input[KEY]) {
    throw new Error('NothingToObserve')
  }
  return input[KEY]
}

export const create = <T>(source: T): T => {
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
        console.log({key, pro: proxy[key], src: source[key]})

        proxy[key] = source[key] //create(source[key])
        // console.log({key, pro: proxy[key], src: source[key]})
        // subjects.push(observe(proxy[key]))
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
          subject.next()
          return true
        }
      })
    }
  }

  Object.defineProperty(source, KEY, {
    enumerable: false,
    value: merge(...subjects)
  })

  Object.defineProperty(source, 'toJSON', {
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

  return source 
}
 