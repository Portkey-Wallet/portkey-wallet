import { useCallback, useRef, useState } from 'react';
import isDeepEqual from 'lodash/isEqual';

export const useSetState = <T extends object>(
  initialState: T = {} as T,
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void] => {
  const [state, set] = useState<T>(initialState);
  const setState = useCallback((patch: any) => {
    set(prevState => Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch));
  }, []);

  return [state, setState];
};

export function useDeepEQMemo<T>(factory: () => T, deps: any[]) {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  });
  // Trigger the factory for the first time or when the object that depends on the change changes
  if (current.initialized === false || !isDeepEqual(current.deps, deps)) {
    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
  }
  return current.obj as T;
}
