
import { ChangeEventType, createNodeId, KEY, state } from './state'

export const proxyObjectInstance = <T>(source: T): T => {
  if (typeof (source as any)[KEY] !== 'undefined') {
    return source
  }
  const nodeId = createNodeId()
  patchInstance(source, [nodeId])
  return new Proxy<any>(source, ProxyHandler())
}

export const patchInstance = (instance: any, nodes: number[]) => {
  for (const key in instance) {
    if (
      state.isIgnored(instance[key]) ||
      typeof instance[key] !== 'object' ||
      !instance[key] 
    ) {
      continue
    } 
    
    if (instance[key][KEY] === undefined) {
      instance[key] = proxyObjectInstance(instance[key])
    }

    nodes.push(...instance[key][KEY])
  }

  instance[KEY] = nodes
  Object.defineProperty(instance, KEY, {
    enumerable: false,
    value: nodes,
  });

  return instance
}

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
          node: (nodes || target[KEY])[0],
          childNode: target[key][KEY]
        })
      }
      delete target[key]
      return true
    }
  }
}