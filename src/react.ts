import { useEffect, useMemo, useState } from 'react';
import { create, observe } from './create'

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
  watch: any[] = [],
) => {
  const [, forceUpdate] = useState(false);
  const vm = useMemo(() => {
    if (isConstructor(ctor)) {
      return create(new (ctor as any)(...(args || [])))
    } else {
      return create((ctor as any)())
    }
  // eslint-disable-next-line
  }, [])
  useEffect(() => observe(vm, () => forceUpdate(s => !s), watch))
  return vm
}

export default useViewModel