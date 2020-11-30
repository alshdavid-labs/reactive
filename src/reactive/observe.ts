import { Subscriber } from '@alshdavid/rxjs'
import { pipe, filter, map } from '@alshdavid/rxjs/operators'
import { ChangeEventType, KEY, getState } from './state'

export const observe = (target: any): Subscriber<void> => {
  if (!target[KEY]) {
    throw new Error('NothingToObserve')
  }
  
  const nodes: Record<number, boolean> = {}
  for (const node of target[KEY]) {
    nodes[node] = true
  }

  return pipe(getState().onEvent)(
    filter(e => {
      if (e.type === ChangeEventType.Add) {
        nodes[e.childNode!] = true
        return true
      }
      if (e.type === ChangeEventType.Remove) {
        e.childNode && delete nodes[e.childNode]
        return true
      }
      if (typeof nodes[e.node] === 'undefined') {
        return false
      }
      return nodes[e.node]
    }),
    map(() => undefined),
  )
}