import { DependencyList, useRef, useCallback, useMemo } from 'react';
import { useDeepCompareEffect } from 'react-use';
import { useLatestRef } from './index';

const useInterval = (callback: () => void, deps?: DependencyList, delay?: number | null) => {
  const intervalRef = useRef<NodeJS.Timer | number>();
  const savedCallback = useLatestRef(callback);
  const startInterval = useCallback(() => {
    if (!delay) return;
    intervalRef.current && clearInterval(intervalRef.current);
    savedCallback.current?.();
    intervalRef.current = setInterval(() => savedCallback.current?.(), delay || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...(deps || [])]);

  useDeepCompareEffect(() => {
    if (delay !== null) startInterval();
    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [delay, deps, startInterval]);

  return useMemo(
    () => ({
      start: startInterval,
      remove: () => {
        intervalRef.current && clearInterval(intervalRef.current);
      },
    }),
    [startInterval],
  );
};

export default useInterval;
