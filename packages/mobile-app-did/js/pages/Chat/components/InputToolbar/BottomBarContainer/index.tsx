import Svg from 'components/Svg';
import React, { ReactNode, useCallback, useContext, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-gifted-chat';
import { pTd } from 'utils/unit';
import { Animated } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import useEffectOnce from 'hooks/useEffectOnce';
import { useKeyboardAnim, useSendCurrentChannelMessage, useHideCurrentChannel } from '../../hooks';
import {
  useBottomBarStatus,
  useChatReplyMessageInfo,
  useChatText,
  useChatsDispatch,
  useCurrentChannel,
} from '../../../context/hooks';
import { ChatBottomBarStatus } from 'store/chat/slice';
import { setBottomBarStatus, setChatText, setReplyMessageInfo } from '../../../context/chatsContext';
import { BGStyles } from 'assets/theme/styles';
import { SendMessageButton } from '../SendMessageButton';
import { ChatInput, ChatInputBar } from '../ChatInput';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { chatInputRecorder } from 'pages/Chat/utils';
import CommonToast from 'components/CommonToast';
import { defaultColors } from 'assets/theme';
import ActionSheet from 'components/ActionSheet';
import navigationService from 'utils/navigationService';
import { NO_LONGER_IN_GROUP } from '@portkey-wallet/constants/constants-ca/chat';
import ReplyContent from '../ReplyContent';
import ChatDetailsContext from 'pages/Chat/ChatDetailsPage/ChatDetailContext';
import useBotSendingStatus from '@portkey-wallet/hooks/hooks-ca/im/useBotSendingStatus';

export const ActionsIcon = function ActionsIcon({ onPress, canSend }: { onPress?: () => void; canSend: boolean }) {
  if (canSend) {
    return (
      <Actions
        containerStyle={styles.fileSvg}
        onPressActionButton={onPress}
        icon={() => <Svg size={pTd(24)} icon="chat-file" color={defaultColors.icon1} />}
        optionTintColor="#222B45"
      />
    );
  } else {
    return (
      <View style={styles.fileSvg}>
        <Svg size={pTd(24)} icon="chat-file" color={defaultColors.neutralTertiaryText} />
      </View>
    );
  }
};

export function BottomBarContainer({
  children,
  scrollToBottom,
}: {
  children?: ReactNode;
  scrollToBottom: () => void;
  showKeyboard?: () => void;
}) {
  const bottomBarStatus = useBottomBarStatus();
  const dispatch = useChatsDispatch();
  const text = useChatText();
  const replyMessageInfo = useChatReplyMessageInfo();
  const textInputRef = useRef<ChatInput>(null);
  const { toRelationId, displayName, isBot } = useContext(ChatDetailsContext);
  const keyboardAnim = useKeyboardAnim({ textInputRef, isBot });
  const timer = useRef<NodeJS.Timeout>();
  const { sendChannelMessage, sendMessageToPeople } = useSendCurrentChannelMessage();
  const hideChannel = useHideCurrentChannel();
  const { currentChannelType } = useCurrentChannel() || {};

  const { canSend, changeToRepliedStatus } = useBotSendingStatus(toRelationId);
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
      if (status === ChatBottomBarStatus.tools && isBot && !canSend) {
        CommonToast.message(displayName ? `${displayName} is replying...` : 'replying...', 2000, 'center');
        return;
      }
      if (bottomBarStatus === status) {
        inputFocus(bottomBarStatus === ChatBottomBarStatus.tools);
      } else {
        dispatch(setBottomBarStatus(status));
        textInputRef.current?.blur();
      }
    },
    [bottomBarStatus, canSend, dispatch, displayName, inputFocus, isBot],
  );

  useEffectOnce(() => {
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  });

  useEffect(() => {
    if (replyMessageInfo?.message) {
      inputFocus(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyMessageInfo?.message]);

  const onSend = useCallback(async () => {
    if (isBot && !canSend) {
      CommonToast.message(displayName ? `${displayName} is replying...` : 'replying...', 2000, 'center');
      return;
    }
    dispatch(setChatText(''));
    dispatch(setReplyMessageInfo(undefined));
    chatInputRecorder?.reset();

    try {
      scrollToBottom?.();
      if (typeof text === 'string') {
        currentChannelType === 'Group'
          ? await sendChannelMessage({
              content: text.trim(),
              quoteMessage: replyMessageInfo?.message?.rawMessage,
            })
          : await sendMessageToPeople({
              content: text.trim(),
            });
      }
    } catch (error: any) {
      if (isBot) {
        changeToRepliedStatus();
      }
      if (error?.code === NO_LONGER_IN_GROUP) {
        hideChannel();
        return ActionSheet.alert({
          title: `You can't send messages to this group because you are no longer in it.`,
          buttons: [
            {
              title: 'OK',
              type: 'primary',
              onPress: () => navigationService.navigate('Tab'),
            },
          ],
        });
      }

      CommonToast.fail('Failed to send message');
    }
  }, [
    canSend,
    changeToRepliedStatus,
    currentChannelType,
    dispatch,
    displayName,
    hideChannel,
    isBot,
    replyMessageInfo?.message?.rawMessage,
    scrollToBottom,
    sendChannelMessage,
    sendMessageToPeople,
    text,
  ]);

  return (
    <View style={styles.wrap}>
      <ReplyContent />
      <View style={[BGStyles.bg6, GStyles.flexRow, GStyles.itemEnd, styles.barWrap]}>
        <ActionsIcon onPress={() => onPressActionButton(ChatBottomBarStatus.tools)} canSend={canSend} />
        <ChatInputBar ref={textInputRef} onPressActionButton={onPressActionButton} />
        <SendMessageButton
          text={text}
          containerStyle={styles.sendStyle}
          onSend={onSend}
          canSend={isBot ? canSend : true}
        />
      </View>
      <Animated.View style={{ height: keyboardAnim }}>{children}</Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
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
