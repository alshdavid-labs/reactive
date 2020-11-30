import { useEffect, useMemo, useState } from 'preact/hooks';
import { create, observe } from '../reactive'

const isConstructor = (f: any): boolean => {
  try {
    Reflect.construct(String, [], f);
  } catch (e) {
    return false;
  }
  return true;
}

export type ViewModelHook = {
  <T>(ctor: () => T, watch?: Array<(instance: T) => any>): T
  <T, U extends Array<any>>(ctor: new (...args: U) => T, args?: U, watch?: Array<(instance: T) => any>): T
}

export const useViewModel: ViewModelHook = (
  ctor: any,
  args: any[] = [], 
) => {
  const [, forceUpdate] = useState(false);
  const vm = useMemo(() => {
    if (isConstructor(ctor)) {
      const $Ctor: any = create(ctor)
      return new $Ctor(...args)
    } else {
      return create((ctor as any)())
    }
  }, [window])
  
  useEffect(() => {
    if (vm.onInit) {
      vm.onInit()
    }
    const sub = observe(vm).subscribe(() => forceUpdate(s => !s))
    return () => {
      sub.unsubscribe()
      if (vm.onDestroy) {
        vm.onDestroy()
      }
    }
  }, [window])
  return vm
}

export default useViewModel