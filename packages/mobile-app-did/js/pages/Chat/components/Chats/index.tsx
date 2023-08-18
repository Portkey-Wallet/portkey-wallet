import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  GiftedChat,
  GiftedChatProps,
  IMessage,
  Message,
  MessageImageProps,
  MessageProps,
  MessageTextProps,
} from 'react-native-gifted-chat';
import initialMessages from '../messages';
import { AccessoryBar, BottomBarContainer } from '../InputToolbar';
import { randomId } from '@portkey-wallet/utils';
import { Keyboard } from 'react-native';
import { useChatsDispatch } from '../context/hooks';
import CustomBubble from '../CustomBubble';
import { setBottomBarStatus, setChatText, setShowSoftInputOnFocus } from '../context/chatsContext';
import useEffectOnce from 'hooks/useEffectOnce';
import MessageText from '../Message/MessageText';
import { destroyChatInputRecorder, initChatInputRecorder } from 'pages/Chat/utils';
import MessageImage from '../Message/MessageImage';

import { useThrottleCallback } from '@portkey-wallet/hooks';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';

const user = {
  _id: 1,
  name: 'Aaron',
  avatar: 'https://lmg.jj20.com/up/allimg/1111/05161Q64001/1P516164001-3-1200.jpg',
};

const Empty = () => null;

const ListViewProps = {
  windowSize: 1,
  maxToRenderPerBatch: 5,
  removeClippedSubviews: false,
  legacyImplementation: true,
};

const ChatsUI = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const dispatch = useChatsDispatch();
  useEffect(() => {
    setMessages(initialMessages as IMessage[]);
  }, []);

  const onSend = (newMessages: IMessage[]) => {
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));
  };

  useEffectOnce(() => {
    initChatInputRecorder();
    return () => {
      dispatch(setChatText(''));
      dispatch(setBottomBarStatus(undefined));
      dispatch(setShowSoftInputOnFocus(true));
      destroyChatInputRecorder();
    };
  });

  const onDismiss = useThrottleCallback(() => {
    Keyboard.dismiss();
    dispatch(setBottomBarStatus(undefined));
  }, [dispatch]);

  const renderMessageText: GiftedChatProps['renderMessageText'] = useCallback(
    (props: MessageTextProps<IMessage>) => <MessageText {...props} />,
    [],
  );

  const renderMessageImage: GiftedChatProps['renderMessageImage'] = useCallback(
    (props: MessageImageProps<IMessage>) => <MessageImage {...props} />,
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
    (props: MessageProps<IMessage>) => {
      return (
        <Touchable activeOpacity={1} onPress={onDismiss}>
          <Message
            containerStyle={{
              left: styles.leftMessageContainer,
              right: styles.rightMessageContainer,
            }}
            {...props}
          />
        </Touchable>
      );
    },
    [onDismiss],
  );
  return (
    <>
      <GiftedChat
        alignTop
        user={user}
        alwaysShowSend
        scrollToBottom
        onSend={onSend}
        renderTime={Empty}
        isCustomViewBottom
        messages={messages}
        renderAvatar={Empty}
        showUserAvatar={false}
        minInputToolbarHeight={0}
        renderInputToolbar={Empty}
        renderBubble={renderBubble}
        messageIdGenerator={randomId}
        renderMessage={renderMessage}
        listViewProps={listViewProps}
        showAvatarForEveryMessage={false}
        isKeyboardInternallyHandled={false}
        renderMessageText={renderMessageText}
        renderMessageImage={renderMessageImage}
      />
      <BottomBarContainer>
        <AccessoryBar />
      </BottomBarContainer>
    </>
  );
};

export default function Chats() {
  return <ChatsUI />;
}

const styles = StyleSheet.create({
  leftMessageContainer: {
    marginLeft: pTd(16),
    marginRight: 0,
  },
  rightMessageContainer: {
    marginLeft: 0,
    marginRight: pTd(16),
  },
});
