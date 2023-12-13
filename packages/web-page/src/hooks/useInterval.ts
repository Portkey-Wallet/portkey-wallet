import { DependencyList, useEffect, useRef } from 'react';
import { useDeepCompareEffect } from 'react-use';

const useInterval = (callback: () => void, deps?: DependencyList, delay?: number | null): void => {
  const savedCallback = useRef<() => void>();
  useEffect(() => {
    savedCallback.current = callback;
  });
  useDeepCompareEffect(() => {
    savedCallback.current?.();
    if (delay !== null) {
      const interval = setInterval(() => savedCallback.current?.(), delay || 0);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [delay, ...(deps || [])]);
};

export default useInterval;
