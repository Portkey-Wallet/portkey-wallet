import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';
export function useHardwareBackPress(callback?: () => boolean) {
  useEffect(() => {
    if (!callback) return;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return callback();
    });
    return () => {
      backHandler.remove();
    };
  }, [callback]);
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
