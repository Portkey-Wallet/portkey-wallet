import React, { useCallback, useMemo, useState } from 'react';
import {
  GiftedChat,
  GiftedChatProps,
  MessageImageProps,
  MessageProps,
  MessageTextProps,
} from 'react-native-gifted-chat';
import { AccessoryBar, BottomBarContainer } from '../InputToolbar';
import { randomId } from '@portkey-wallet/utils';
import { ActivityIndicator, Keyboard } from 'react-native';
import { useChatsDispatch, useCurrentChannelId } from '../../context/hooks';
import CustomBubble from '../CustomBubble';
import { setBottomBarStatus, setChatText, setShowSoftInputOnFocus } from '../../context/chatsContext';
import useEffectOnce from 'hooks/useEffectOnce';
import MessageText from '../Message/MessageText';
import { destroyChatInputRecorder, initChatInputRecorder } from 'pages/Chat/utils';
import MessageImage from '../Message/MessageImage';

import { useThrottleCallback } from '@portkey-wallet/hooks';

import Touchable from 'components/Touchable';
import { useChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import im from '@portkey-wallet/im';
import GStyles from 'assets/theme/GStyles';
import { ChatMessage } from 'pages/Chat/types';
import { FontStyles } from 'assets/theme/styles';
import ChatMessageContainer from '../Message';
import { formatMessageList } from 'pages/Chat/utils/format';

const Empty = () => null;

const ListViewProps = {
  // windowSize: 50,
  // maxToRenderPerBatch: 5,
  // removeClippedSubviews: false,
  // legacyImplementation: true,
  initialNumToRender: 20,
};

const ChatsUI = () => {
  const currentChannelId = useCurrentChannelId();
  const { list, init } = useChannel(currentChannelId || '');

  const [loading, setLoading] = useState(true);

  const formattedList = useMemo(() => formatMessageList(list), [list]);
  console.log(formattedList, '====formattedList');

  const dispatch = useChatsDispatch();

  useEffectOnce(() => {
    init();
    initChatInputRecorder();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);
    return () => {
      clearTimeout(timer);
      dispatch(setChatText(''));
      dispatch(setBottomBarStatus(undefined));
      dispatch(setShowSoftInputOnFocus(true));
      // dispatch(setCurrentChannelId());
      destroyChatInputRecorder();
    };
  });

  const onDismiss = useThrottleCallback(() => {
    Keyboard.dismiss();
    dispatch(setBottomBarStatus(undefined));
  }, [dispatch]);

  const renderMessageText: GiftedChatProps['renderMessageText'] = useCallback(
    (props: MessageTextProps<ChatMessage>) => <MessageText {...props} />,
    [],
  );

  const renderMessageImage: GiftedChatProps['renderMessageImage'] = useCallback(
    (props: MessageImageProps<ChatMessage>) => <MessageImage {...(props as MessageProps<ChatMessage>)} />,
    [],
  );

  const renderBubble = useCallback((data: any) => {
    return <CustomBubble {...data} />;
  }, []);
  const listViewProps: GiftedChatProps['listViewProps'] = useMemo(() => {
    return {
      ...ListViewProps,
      onScrollBeginDrag: onDismiss,
    };
  }, [onDismiss]);

  const renderMessage = useCallback(
    (props: MessageProps<ChatMessage>) => {
      return <ChatMessageContainer onDismiss={onDismiss} {...props} />;
    },
    [onDismiss],
  );
  const disabledTouchable = useMemo(() => formattedList.length > 10, [formattedList.length]);

  const bottomBar = useMemo(
    () => (
      <BottomBarContainer>
        <AccessoryBar />
      </BottomBarContainer>
    ),
    [],
  );

  const user = useMemo(() => ({ _id: im.userInfo?.relationId || '' }), []);

  return (
    <>
      <Touchable disabled={disabledTouchable} activeOpacity={1} onPress={onDismiss} style={GStyles.flex1}>
        {loading ? (
          <ActivityIndicator size={'small'} color={FontStyles.font4.color} />
        ) : (
          <GiftedChat
            alignTop
            user={user}
            alwaysShowSend
            scrollToBottom
            renderTime={Empty}
            isCustomViewBottom
            renderAvatar={Empty}
            showUserAvatar={false}
            messages={formattedList}
            minInputToolbarHeight={0}
            renderInputToolbar={Empty}
            renderBubble={renderBubble}
            renderMessage={renderMessage}
            listViewProps={listViewProps}
            messageIdGenerator={randomId}
            showAvatarForEveryMessage={false}
            isKeyboardInternallyHandled={false}
            renderMessageText={renderMessageText}
            renderMessageImage={renderMessageImage}
          />
        )}
      </Touchable>
      {bottomBar}
    </>
  );
};

export default function Chats() {
  return <ChatsUI />;
}
