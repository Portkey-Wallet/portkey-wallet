import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { COMMON_RESULT_DATA, RouterContext } from './context';
import router from '.';
import { EmitterSubscription } from 'react-native';
import { EntryResult, PortkeyDeviceEventEmitter, PortkeyEntries } from './types';

export default function useNavigation() {
  const { from } = useContext(RouterContext) as { from: PortkeyEntries };
  return useMemo(() => {
    return {
      navigate: (target: string, params?: any) => {
        router.listenersFunc()[from]['blur'].forEach(item => item());
        router.navigate(target, { ...params, from });
      },
      navigateByResult: (target: string, callback: (res: EntryResult<any>) => void, params?: any) => {
        router.listenersFunc()[from]['blur'].forEach(item => item());
        router.navigateByResult(target, { ...params, from }, callback);
      },
      goBack: (result?: EntryResult<any>) => {
        router.listenersFunc()[from]['blur'].forEach(item => item());
        router.back(result ?? COMMON_RESULT_DATA, { from });
      },
      canGoBack: () => {
        return router.canGoBack();
      },
      isFocused: () => {
        return router.peek() === from;
      },
      addListener: (type: string, callback: () => void) => {
        return router.addListener(from, type, callback);
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
export function useRouterParams<T extends object>() {
  const { params } = useContext(RouterContext);
  const [stateParams] = useState(params);
  return stateParams || ({} as T);
}

export function useIsFocused(): boolean {
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(navigation.isFocused);

  const valueToReturn = navigation.isFocused();

  if (isFocused !== valueToReturn) {
    // If the value has changed since the last render, we need to update it.
    // This could happen if we missed an update from the event listeners during re-render.
    // React will process this update immediately, so the old subscription value won't be committed.
    // It is still nice to avoid returning a mismatched value though, so let's override the return value.
    // This is the same logic as in https://github.com/facebook/react/tree/master/packages/use-subscription
    setIsFocused(valueToReturn);
  }

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => setIsFocused(true));

    const unsubscribeBlur = navigation.addListener('blur', () => setIsFocused(false));

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  // React.useDebugValue(valueToReturn);

  return valueToReturn;
}
export const useRoute = useRouterParams;
