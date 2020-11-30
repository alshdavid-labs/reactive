import { proxyObjectInstance } from "./observe-object"
import { ChangeEventType, KEY, state } from "./state"

export const ProxyHandler = (nodes?: Array<number>): ProxyHandler<any> => {
  return {
    set(target, key, value) {
      if (target[key] === value) {
        return true
      }
      if (typeof target[KEY] === 'undefined') {
        target[key] = value
        return true
      }

      if (typeof value === 'object') {
        target[key] = proxyObjectInstance(value)
        ;(nodes || target[KEY]).push(...target[key][KEY])

        state.pushEvent({ 
          type: ChangeEventType.Add,
          node: (nodes || target[KEY])[0],
          childNode: target[key][KEY][0]
        })
        return true
      }

      target[key] = value

      // Avoid emitting on .splice
      if (key === 'length') {
        return true  
      }


      state.pushEvent({ 
        type: ChangeEventType.Update,
        node: (nodes || target[KEY])[0],
      })

      return true
    },
    deleteProperty(target, key) {
      if (target[KEY]) {
        state.pushEvent({
          type: ChangeEventType.Remove,
          node: (nodes || target[KEY]),
          childNode: target[key][KEY]
        })
      }
      delete target[key]
      return true
    }
  }
}