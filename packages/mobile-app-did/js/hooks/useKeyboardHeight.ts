import { useLatestRef } from '@portkey-wallet/hooks';
import { isIOS } from '@rneui/base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardEvent } from 'react-native';
import { Keyboard } from 'react-native';
import useEffectOnce from './useEffectOnce';
import useAsyncStorageState from './useAsyncStorageState';

type KeyboardEventListener = (event: KeyboardEvent) => void;

const DefaultKeyboardHeight = 336;

// Note that only keyboardDidShow and keyboardDidHide events are available on Android
const showEventName = isIOS ? 'keyboardWillShow' : 'keyboardDidShow';
const hideEventName = isIOS ? 'keyboardWillHide' : 'keyboardDidHide';

export function useKeyboardListener({ show, hide }: { show?: KeyboardEventListener; hide?: KeyboardEventListener }) {
  const latestShow = useLatestRef(show);
  const latestHide = useLatestRef(hide);
  useEffectOnce(() => {
    const showListener = latestShow.current ? Keyboard.addListener(showEventName, latestShow.current) : undefined;
    const hideListener = latestHide.current ? Keyboard.addListener(hideEventName, latestHide.current) : undefined;
    return () => {
      showListener?.remove();
      hideListener?.remove();
    };
  });
}

export default function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  useEffect(() => {
    const showListener = Keyboard.addListener(showEventName, event => setKeyboardHeight(event.endCoordinates.height));
    const hideListener = Keyboard.addListener(hideEventName, () => setKeyboardHeight(0));
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);
  return keyboardHeight;
}

export function useKeyboard(topSpacing = 0) {
  const [keyboardHeight, setKeyboardHeight] = useAsyncStorageState<number>('KeyboardHeight', DefaultKeyboardHeight);
  const [isKeyboardOpened, setIsKeyboardOpened] = useState<boolean>();
  const KeyboardOpenedRef = useLatestRef(isKeyboardOpened);
  const show: KeyboardEventListener = useCallback(
    event => {
      if (!KeyboardOpenedRef.current || isIOS) {
        setKeyboardHeight(event.endCoordinates.height);
      }
      setIsKeyboardOpened(true);
    },
    [KeyboardOpenedRef, setKeyboardHeight],
  );

  const hide: KeyboardEventListener = useCallback(() => {
    setIsKeyboardOpened(false);
  }, []);
  useKeyboardListener({ show, hide });
  return useMemo(
    () => ({ keyboardHeight: (keyboardHeight || DefaultKeyboardHeight) - topSpacing, isKeyboardOpened }),
    [isKeyboardOpened, keyboardHeight, topSpacing],
  );
}
