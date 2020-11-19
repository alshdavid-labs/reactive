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
    patchArray(source, subject, subjects)
  } else if (typeof source === 'object') {
    patchObject(source, subject, subjects)
  }

  ;(source as any)[KEY] = merge(...subjects)

  return source 
}

const patchObject = (
  source: any, 
  subject: Subject<void>, 
  subjects: Array<Subscriber<void>>,
) => {
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
}
 
const patchArray = (
  source: Array<any>, 
  subject: Subject<void>, 
  subjects: Array<Subscriber<void>>,
) => {
  for (let i = 0; i < source.length; i++) {
    if (typeof source[i] === 'object') {
      source[i] = create(source[i])
      subjects.push(observe(source[i]))
    } else {
      source[i] = source[i]
    }
  }
  for (const method of arrayMethodsToPatch) {
    patchMethod(source, method, () => {
      patchArray(source, subject, subjects)
      subject.next()
    })
  }
}
 
export const patchMethod = (target: any, methodKey: string, patch: () => void) => {
  const original = target[methodKey]
  
  target[methodKey] = function () {
    original.apply(target, arguments)
    patch()
  }
}

const arrayMethodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]