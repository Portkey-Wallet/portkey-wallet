import Svg from 'components/Svg';
import React, { ReactNode, memo, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-gifted-chat';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { Animated } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import useEffectOnce from 'hooks/useEffectOnce';
import { useKeyboardAnim, useSendCurrentChannelMessage } from '../../hooks';
import { useBottomBarStatus, useChatText, useChatsDispatch } from '../../../context/hooks';
import { ChatBottomBarStatus } from 'store/chat/slice';
import { setBottomBarStatus, setChatText } from '../../../context/chatsContext';
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
  const { sendChannelMessage } = useSendCurrentChannelMessage();
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
  const onSend = useCallback(() => {
    dispatch(setChatText(''));
    sendChannelMessage(text);
  }, [dispatch, sendChannelMessage, text]);
  return (
    <View style={styles.wrap}>
      <Touchable style={[BGStyles.bg6, GStyles.flexRow, GStyles.itemEnd, styles.barWrap]}>
        <ActionsIcon onPress={() => onPressActionButton(ChatBottomBarStatus.tools)} />
        <ChatInputBar ref={textInputRef} onPressActionButton={onPressActionButton} />
        <SendMessageButton text={text} containerStyle={styles.sendStyle} onSend={onSend} />
      </Touchable>
      <Animated.View style={{ height: keyboardAnim }}>{children}</Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
  },
  barWrap: {
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
  sendStyle: {
    marginBottom: pTd(8),
    marginLeft: pTd(8),
    width: pTd(24),
    height: pTd(24),
  },
});
