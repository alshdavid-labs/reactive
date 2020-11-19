import { Subscriber } from '../rxjs'
import { pipe, filter, map } from '../rxjs/operators'
import { ChangeEventType, KEY, state } from './state'

export const observe = (target: any): Subscriber<void> => {
  if (!target[KEY]) {
    throw new Error('NothingToObserve')
  }
  const nodes: Record<number, boolean> = {}
  for (const node of target[KEY]) nodes[node] = true

  return pipe(state.onEvent)(
    filter(e => {
      if (e.type === ChangeEventType.Add) nodes[e.childNode!] = true
      if (e.type === ChangeEventType.Remove) delete nodes[e.childNode!]
      return nodes[e.node]
    }),
    map(e => undefined),
  )
}