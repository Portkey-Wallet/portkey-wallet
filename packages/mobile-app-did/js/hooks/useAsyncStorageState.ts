import { Dispatch, SetStateAction, useCallback, useState, useRef, useLayoutEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const deserializer = JSON.parse;

const useAsyncStorageState = <T>(
  key: string,
  initialValue?: T,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] => {
  if (!key) {
    throw new Error('useAsyncStorage key may not be falsy');
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-shadow
  const initializer = useRef(async (key: string) => {
    try {
      const serializer = JSON.stringify;

      const AsyncStorageValue = await AsyncStorage.getItem(key);
      if (AsyncStorageValue !== null) {
        return deserializer(AsyncStorageValue);
      } else {
        initialValue && AsyncStorage.setItem(key, serializer(initialValue));
        return initialValue;
      }
    } catch {
      // If user is in private mode or has storage restriction
      // AsyncStorage can throw. JSON.parse and JSON.stringify
      // can throw, too.
      return initialValue;
    }
  });

  const [state, setState] = useState<T | undefined>();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    (async () => {
      const init = await initializer.current(key);
      setState(init);
    })();
  }, [key]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const set: Dispatch<SetStateAction<T | undefined>> = useCallback(
    valOrFunc => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const newState = typeof valOrFunc === 'function' ? (valOrFunc as Function)(state) : valOrFunc;
        if (typeof newState === 'undefined') return;
        const value = JSON.stringify(newState);

        AsyncStorage.setItem(key, value);
        setState(deserializer(value));
      } catch {
        // If user is in private mode or has storage restriction
        // AsyncStorage can throw. Also JSON.stringify can throw.
      }
    },
    [key, state],
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const remove = useCallback(() => {
    try {
      AsyncStorage.removeItem(key);
      setState(undefined);
    } catch {
      // If user is in private mode or has storage restriction
      // AsyncStorage can throw.
    }
  }, [key, setState]);

  return [state, set, remove];
};

export default useAsyncStorageState;
