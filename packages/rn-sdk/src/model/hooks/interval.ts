import { useRef, useEffect, useCallback, useMemo } from 'react';

export const useIntervalPolling = <T>({
  updater,
  fetcher,
  intervalFetchGap = DEFAULT_INTERVAL_FETCH_GAP,
}: IIntervalPollingParams<T>): Stopper => {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const isPolling = useRef<boolean>(false);

  const polling = useCallback(async () => {
    if (isPolling.current) {
      return;
    }
    isPolling.current = true;
    try {
      const data = await fetcher();
      await updater(data);
    } catch (e) {
      console.error(e);
    }
    isPolling.current = false;
  }, [isPolling, fetcher, updater]);

  const stopper = useMemo(() => {
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [timer]);

  useEffect(() => {
    timer.current = setInterval(polling, intervalFetchGap);
    return stopper;
  }, [intervalFetchGap, fetcher, updater, polling, stopper]);

  return stopper;
};

export interface IIntervalPollingParams<T> {
  updater: (data: T) => void | Promise<void>;
  fetcher: () => T | Promise<T>;
  intervalFetchGap?: number;
}

export type Stopper = () => void | Promise<void>;

const DEFAULT_INTERVAL_FETCH_GAP = 1000 * 5;
