import { useLatestRef } from '@portkey-wallet/hooks';
import { windowHeight } from '@portkey-wallet/utils/mobile/device';
import { isIOS } from '@rneui/base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutAnimation, KeyboardEvent } from 'react-native';
import { Keyboard } from 'react-native';
import { nextAnimation } from 'utils/animation';
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

export function useKeyboard(topSpacing = 0, isAnimation = false) {
  const [keyboardHeight, setKeyboardHeight] = useAsyncStorageState<number>('KeyboardHeight', DefaultKeyboardHeight);
  const [isKeyboardOpened, setIsKeyboardOpened] = useState<boolean>();
  const show: KeyboardEventListener = useCallback(
    event => {
      if (isAnimation)
        nextAnimation({
          duration: event.duration,
          create: {
            duration: event.duration,
            type: LayoutAnimation.Types[event.easing],
            property: LayoutAnimation.Properties.opacity,
          },
        });

      setKeyboardHeight(isIOS ? event.endCoordinates.height : windowHeight - event.endCoordinates.screenY);
      setIsKeyboardOpened(true);
    },
    [isAnimation, setKeyboardHeight],
  );

  const hide: KeyboardEventListener = useCallback(
    event => {
      if (isAnimation)
        nextAnimation({
          duration: event.duration,
          create: {
            duration: event.duration,
            type: LayoutAnimation.Types[event.easing],
            property: LayoutAnimation.Properties.opacity,
          },
        });

      setIsKeyboardOpened(false);
    },
    [isAnimation],
  );
  useKeyboardListener({ show, hide });
  return useMemo(
    () => ({ keyboardHeight: (keyboardHeight || DefaultKeyboardHeight) - topSpacing, isKeyboardOpened }),
    [isKeyboardOpened, keyboardHeight, topSpacing],
  );
}
