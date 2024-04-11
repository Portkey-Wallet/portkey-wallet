import { EffectCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { COMMON_RESULT_DATA, RouterContext } from './context';
import router, { EventName } from '.';
import { EmitterSubscription } from 'react-native';
import { EntryResult, PortkeyDeviceEventEmitter, PortkeyEntries } from './types';
import { reverseMapRoute } from './map';

export function useNavigation() {
  const { from } = useContext(RouterContext) as { from: PortkeyEntries };
  const params = useRoute();
  return useMemo(() => {
    return {
      navigate: (target: string, params?: any) => {
        router.navigate(target, { ...params, from });
      },
      navigateByResult: (target: string, callback: (res: EntryResult<any>) => void, params?: any) => {
        router.navigateByResult(target, { ...params, from }, callback);
      },
      goBack: (result?: EntryResult<any>) => {
        router.back(result ?? COMMON_RESULT_DATA, { from });
      },
      reset: (name: any | { name: any; params?: any }[], params?: any) => {
        router.reset(name, params, from);
      },
      canGoBack: () => {
        return router.canGoBack();
      },
      isFocused: () => {
        return router.peek()?.name === from;
      },
      addListener: (type: EventName, callback: () => void) => {
        return router.addListener(from, type, callback);
      },
      getState: () => {
        return {
          routes: router.allItem().map(item => {
            return {
              name: reverseMapRoute(item.name),
              params: item.params,
            };
          }),
        };
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

export function useFocusEffect(effect: EffectCallback) {
  const navigation = useNavigation();
  if (arguments[1] !== undefined) {
    const message =
      "You passed a second argument to 'useFocusEffect', but it only accepts one argument. " +
      "If you want to pass a dependency array, you can use 'React.useCallback':\n\n" +
      'useFocusEffect(\n' +
      '  React.useCallback(() => {\n' +
      '    // Your code here\n' +
      '  }, [depA, depB])\n' +
      ');\n\n' +
      'See usage guide: https://reactnavigation.org/docs/use-focus-effect';

    console.error(message);
  }
  useEffect(() => {
    let isFocused = false;
    let cleanup: undefined | void | (() => void);

    const callback = () => {
      const destroy = effect();

      if (destroy === undefined || typeof destroy === 'function') {
        return destroy;
      }
      if (process.env.NODE_ENV !== 'production') {
        let message = 'An effect function must not return anything besides a function, which is used for clean-up.';

        if (destroy === null) {
          message += " You returned 'null'. If your effect does not require clean-up, return 'undefined' (or nothing).";
        } else if (typeof (destroy as any).then === 'function') {
          message +=
            "\n\nIt looks like you wrote 'useFocusEffect(async () => ...)' or returned a Promise. " +
            'Instead, write the async function inside your effect ' +
            'and call it immediately:\n\n' +
            'useFocusEffect(\n' +
            '  React.useCallback(() => {\n' +
            '    async function fetchData() {\n' +
            '      // You can await here\n' +
            '      const response = await MyAPI.getData(someId);\n' +
            '      // ...\n' +
            '    }\n\n' +
            '    fetchData();\n' +
            '  }, [someId])\n' +
            ');\n\n';
        } else {
          message += ` You returned '${JSON.stringify(destroy)}'.`;
        }

        console.error(message);
      }
    };
    if (navigation.isFocused()) {
      cleanup = callback();
      isFocused = true;
    }

    const unsubscribeFocus = navigation.addListener('focus', () => {
      // If callback was already called for focus, avoid calling it again
      // The focus event may also fire on intial render, so we guard against runing the effect twice
      if (isFocused) {
        return;
      }

      if (cleanup !== undefined) {
        cleanup();
      }

      cleanup = callback();
      isFocused = true;
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      if (cleanup !== undefined) {
        cleanup();
      }

      cleanup = undefined;
      isFocused = false;
    });

    return () => {
      if (cleanup !== undefined) {
        cleanup();
      }

      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [effect, navigation]);
}
export const useRoute = useRouterParams;
