import { bottomBarHeight, isIOS } from '@portkey-wallet/utils/mobile/device';
import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import { ChatBottomBarStatus, setBottomBarStatus } from '../context/chatsContext';
import { useKeyboard } from 'hooks/useKeyboardHeight';
import usePrevious from 'hooks/usePrevious';
import { TextInput } from 'react-native';
import { useBottomBarStatus, useChatsDispatch } from '../context/hooks';

const TopSpacing = isIOS ? bottomBarHeight : -(bottomBarHeight + 10);

export function useKeyboardAnim({ textInputRef }: { textInputRef: React.RefObject<TextInput> }) {
  const keyboardAnim = useRef(new Animated.Value(0)).current;
  const bottomBarStatus = useBottomBarStatus();
  const dispatch = useChatsDispatch();
  const showTools = useMemo(
    () => bottomBarStatus === ChatBottomBarStatus.tools || bottomBarStatus === ChatBottomBarStatus.emoji,
    [bottomBarStatus],
  );
  const { keyboardHeight, isKeyboardOpened } = useKeyboard(TopSpacing);
  const toValue = useMemo(
    () => (showTools || isKeyboardOpened ? keyboardHeight : 0),
    [isKeyboardOpened, keyboardHeight, showTools],
  );
  const preToValue = usePrevious(toValue);
  useEffect(() => {
    if (preToValue !== toValue) {
      Animated.timing(keyboardAnim, {
        toValue,
        duration: toValue > 0 ? 150 : 200,
        useNativeDriver: false,
      }).start();
    }
  }, [keyboardAnim, preToValue, toValue]);

  useEffect(() => {
    if (isKeyboardOpened) dispatch(setBottomBarStatus(ChatBottomBarStatus.input));
    else textInputRef.current?.blur();
  }, [dispatch, isKeyboardOpened, textInputRef]);

  return keyboardAnim;
}
