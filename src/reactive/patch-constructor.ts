import { patchInstance } from "./observe-object"
import { ProxyHandler } from "./proxy-handler"
import { createNodeId } from "./state"

export function patchConstructor<T>(Super: T): T {
  function Trapped(this: any, ...args: any[]) {
    const instance = Reflect.construct(Super as any, args, Trapped)
    patchInstance(instance, [createNodeId()])
    return instance
  }

  Trapped.prototype = new Proxy(
    Object.create((Super as any).prototype), 
    ProxyHandler(),
  )

  return Trapped as any
}
