
import { ProxyHandler } from './proxy-handler'
import { createNodeId, KEY, state } from './state'

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
      typeof instance[key] !== 'object'  
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