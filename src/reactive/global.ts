declare const WorkerGlobalScope: any
declare const global: any

let globalObject: Record<string, any> = null!

if (typeof window !== "undefined") {
  globalObject = window
}

if (typeof WorkerGlobalScope !== "undefined") {
  globalObject = self
}

if (typeof global !== "undefined") {
  globalObject = global
}

export { globalObject }