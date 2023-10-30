import { useCallback, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
export function useDeviceEventListener(name: string, callBack: (data: any) => void) {
  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(name, callBack);
    return () => {
      listener.remove();
    };
  }, [callBack, name]);
}

export function useDeviceEvent(name: string, callBack: (data: any) => void) {
  useDeviceEventListener(name, callBack);
  return useCallback((...params: any[]) => DeviceEventEmitter.emit(name, ...params), [name]);
}
