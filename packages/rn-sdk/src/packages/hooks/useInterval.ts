import { DependencyList, EffectCallback, useRef, useCallback, useMemo } from 'react';
import { useLatestRef } from './';
import useCustomCompareEffect from './useCustomCompareEffect';
import isDeepEqual from 'fast-deep-equal/react';

const isPrimitive = (val: any) => val !== Object(val);

const useDeepCompareEffect = (effect: EffectCallback, deps: DependencyList) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!(deps instanceof Array) || !deps.length) {
      console.warn('`useDeepCompareEffect` should not be used with no dependencies. Use React.useEffect instead.');
    }

    if (deps.every(isPrimitive)) {
      console.warn(
        '`useDeepCompareEffect` should not be used with dependencies that are all primitive values. Use React.useEffect instead.',
      );
    }
  }

  useCustomCompareEffect(effect, deps, isDeepEqual);
};

const useInterval = (callback: () => void, delay?: number | null, deps?: DependencyList) => {
  const intervalRef = useRef<NodeJS.Timer | number>();
  const savedCallback = useLatestRef(callback);
  const startInterval = useCallback(() => {
    if (!delay) return;
    intervalRef.current && clearInterval(intervalRef.current as unknown as number);
    savedCallback.current?.();
    intervalRef.current = setInterval(() => savedCallback.current?.(), delay || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...(deps || [])]);

  useDeepCompareEffect(() => {
    if (delay !== null) startInterval();
    return () => {
      intervalRef.current && clearInterval(intervalRef.current as unknown as number);
    };
  }, [delay, deps, startInterval]);

  return useMemo(
    () => ({
      start: startInterval,
      remove: () => {
        intervalRef.current && clearInterval(intervalRef.current as unknown as number);
      },
    }),
    [startInterval],
  );
};

export default useInterval;
