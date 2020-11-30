import { proxyObjectInstance } from './observe-object'
import { patchConstructor } from './patch-constructor'
import { KEY, getState } from './state'

export const create = <T>(source: T): T => {
  if (getState().isIgnored(source)) {
    throw new Error('CannotObserveIgnored')
  } else if (typeof (source as any)[KEY] !== 'undefined') {
    return source
  } else if (typeof source === 'object') {
    return proxyObjectInstance(source)
  } else if (typeof source === 'function') {
    return patchConstructor(source)
  }
  throw new Error('TypeNotObservable')
}

export const construct = <T, U extends Array<any>>(
  Constructor: new (...args: U) => T, 
  args: U = ([] as any as U),
) => {
  const $Constructor = create(Constructor)
  return new $Constructor(...args)
}
