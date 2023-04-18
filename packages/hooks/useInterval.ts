import { DependencyList, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDeepCompareEffect } from 'react-use';

const useInterval = (callback: () => void, delay?: number | null, deps?: DependencyList) => {
  const intervalRef = useRef<NodeJS.Timer>();
  const savedCallback = useRef<() => void>();
  useEffect(() => {
    savedCallback.current = callback;
  });

  const startInterval = useCallback(() => {
    if (!delay) return;
    intervalRef.current && clearInterval(intervalRef.current);
    savedCallback.current?.();
    intervalRef.current = setInterval(() => savedCallback.current?.(), delay || 0);
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
