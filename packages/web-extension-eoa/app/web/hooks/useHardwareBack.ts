import { useCallback, useEffect, useRef } from 'react';
import { useEffectOnce } from 'react-use';
import { useLocationState } from './router';

export function useHardwareBack(callback?: () => void) {
  const savedCallback = useRef<any>();

  const { state } = useLocationState();

  useEffectOnce(() => {
    savedCallback.current = { state, callback };
  });

  const popstateHandler = useCallback(() => {
    return savedCallback.current.callback?.();
  }, []);

  useEffect(() => {
    savedCallback.current.state = state;
    window.history.pushState(null, '', document.URL);
    window.addEventListener('popstate', popstateHandler, false);
    return () => {
      if (savedCallback.current.state) window.history.pushState(savedCallback.current.state, '', document.URL);
      window.removeEventListener('popstate', popstateHandler, false);
    };
  }, [callback, popstateHandler, state]);
}

export function usePreventHardwareBack(callback?: () => void) {
  const savedCallback = useRef<() => void>();
  useEffect(() => {
    savedCallback.current = callback;
  });
  useHardwareBack(() => {
    savedCallback.current?.();
    return true;
  });
}
