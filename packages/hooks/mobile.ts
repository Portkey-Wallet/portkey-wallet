import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';
export function useHardwareBackPress(callback?: () => boolean) {
  const savedCallback = useRef<() => boolean>();
  useEffect(() => {
    savedCallback.current = callback;
  });
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return savedCallback.current?.();
    });
    return () => {
      backHandler.remove();
    };
  }, []);
}

export function usePreventHardwareBack(callback?: () => void) {
  const savedCallback = useRef<() => void>();
  useEffect(() => {
    savedCallback.current = callback;
  });
  useHardwareBackPress(() => {
    savedCallback.current?.();
    return true;
  });
}
