import { proxyObjectInstance } from './observe-object'
import { patchConstructor } from './patch-constructor'
import { KEY, state } from './state'

export const  create = <T>(source: T): T => {
  if (state.ignoreList.includes(source)) {
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
