import Svg from 'components/Svg';
import React, { ReactNode, memo, useCallback, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Actions } from 'react-native-gifted-chat';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { Animated } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import useEffectOnce from 'hooks/useEffectOnce';
import { useKeyboardAnim } from '../../hooks';
import { useBottomBarStatus, useChatText, useChatsDispatch } from '../../context/hooks';
import { ChatBottomBarStatus } from 'store/chat/slice';
import { setBottomBarStatus } from '../../context/chatsContext';
import { BGStyles } from 'assets/theme/styles';
import { SendMessageButton } from '../SendMessageButton';
import { ChatInput, ChatInputBar } from '../ChatInput';
import { isIOS } from '@portkey-wallet/utils/mobile/device';

export const ActionsIcon = memo(function ActionsIcon({ onPress }: { onPress?: () => void }) {
  return (
    <Actions
      containerStyle={styles.fileSvg}
      onPressActionButton={onPress}
      icon={() => <Svg size={pTd(24)} icon="chat-file" />}
      optionTintColor="#222B45"
    />
  );
});

export function BottomBarContainer({ children }: { children?: ReactNode; showKeyboard?: () => void }) {
  const bottomBarStatus = useBottomBarStatus();
  const dispatch = useChatsDispatch();
  const text = useChatText();
  const textInputRef = useRef<ChatInput>(null);
  const keyboardAnim = useKeyboardAnim({ textInputRef });
  const timer = useRef<NodeJS.Timeout>();

  const inputFocus = useCallback(
    (autoHide?: boolean) => {
      textInputRef.current?.focus(autoHide);
      timer.current && clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        dispatch(setBottomBarStatus(ChatBottomBarStatus.input));
      }, 300);
    },
    [dispatch],
  );

  const onPressActionButton = useCallback(
    (status: ChatBottomBarStatus) => {
      if (bottomBarStatus === status) {
        inputFocus(bottomBarStatus === ChatBottomBarStatus.tools);
      } else {
        dispatch(setBottomBarStatus(status));
        textInputRef.current?.blur();
      }
    },
    [bottomBarStatus, dispatch, inputFocus],
  );

  useEffectOnce(() => {
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  });

  return (
    <>
      <Touchable style={[BGStyles.bg6, GStyles.flexRow, GStyles.itemEnd, styles.wrap]}>
        <ActionsIcon onPress={() => onPressActionButton(ChatBottomBarStatus.tools)} />
        <ChatInputBar ref={textInputRef} onPressActionButton={onPressActionButton} />
        <SendMessageButton text={text} containerStyle={styles.sendStyle} />
      </Touchable>
      <Animated.View style={{ height: keyboardAnim }}>{children}</Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    paddingHorizontal: pTd(16),
    paddingVertical: pTd(10),
    marginBottom: isIOS ? 0 : 5,
  },
  fileSvg: {
    marginLeft: 0,
    marginBottom: pTd(8),
    marginRight: pTd(8),
  },
  input: {
    width: '100%',
    paddingLeft: pTd(16),
  },
  sendStyle: {
    marginBottom: pTd(8),
    marginLeft: pTd(8),
    width: pTd(24),
    height: pTd(24),
  },
  toolsItem: {
    width: '25%',
    margin: pTd(2),
    backgroundColor: 'skyblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hideInput: {
    position: 'absolute',
    top: -1000,
    opacity: 0,
    ...GStyles.flex1,
  },
  inputContainerStyle: {
    height: 80,
    ...GStyles.flex1,
  },
  hide: {
    width: 0,
    height: 0,
  },
  absolute: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    zIndex: 999,
  },
});
