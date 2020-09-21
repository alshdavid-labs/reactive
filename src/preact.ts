import { useEffect, useMemo, useState } from 'preact/hooks';
import { create, observe } from './create'

export function useViewModel<T,>(
  ctor: () => T,
  watch: Array<() => any> = [], 
): T {
  const [, forceUpdate] = useState(false);
  const vm = useMemo(() => create(ctor()), [])
  useEffect(() => observe(vm, () => forceUpdate(s => !s), watch))
  return vm
}