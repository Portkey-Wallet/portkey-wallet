import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useLatestRef } from './index';
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
  const savedCallback = useLatestRef(callback);
  useHardwareBackPress(() => {
    savedCallback.current?.();
    return true;
  });
}
