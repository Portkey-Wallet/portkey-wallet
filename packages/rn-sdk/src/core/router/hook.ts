import { useContext, useEffect, useMemo, useRef } from 'react';
import { COMMON_RESULT_DATA, RouterContext } from './context';
import router from '.';
import { EntryResult, PortkeyDeviceEventEmitter } from 'service/native-modules';
import { EmitterSubscription } from 'react-native';

export default function useNavigation() {
  const { from } = useContext(RouterContext);
  return useMemo(() => {
    return {
      navigation: (target: string, params?: any) => {
        router.navigate(target, { ...params, from });
      },
      navigateByResult: (target: string, callback: (res: EntryResult<any>) => void, params?: any) => {
        router.navigateByResult(target, { ...params, from }, callback);
      },
      goBack: (result?: EntryResult<any>) => {
        router.back(result ?? COMMON_RESULT_DATA, { from });
      },
    };
  }, [from]);
}
export function useNewIntent<T>(onNewIntent: (params: T) => void) {
  const onNewIntentListener = useRef<EmitterSubscription | null>(null);
  useEffect(() => {
    if (onNewIntent) {
      onNewIntentListener.current?.remove();
      onNewIntentListener.current = PortkeyDeviceEventEmitter.addListener('onNewIntent', params => {
        onNewIntent?.(params);
      });
    }
    return () => {
      onNewIntentListener.current?.remove();
    };
  }, [onNewIntent]);
}
