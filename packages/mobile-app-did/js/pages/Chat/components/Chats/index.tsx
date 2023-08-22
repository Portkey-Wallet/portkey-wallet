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
import { Message as IMMessage } from '@portkey-wallet/im/types';

import { useThrottleCallback } from '@portkey-wallet/hooks';

import Touchable from 'components/Touchable';
import { useChannel, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import GStyles from 'assets/theme/GStyles';
import { ChatMessage } from 'pages/Chat/types';
import { FontStyles } from 'assets/theme/styles';
import ChatMessageContainer from '../Message';

const Empty = () => null;

const ListViewProps = {
  // windowSize: 50,
  // maxToRenderPerBatch: 5,
  // removeClippedSubviews: false,
  // legacyImplementation: true,
  initialNumToRender: 20,
};

const format = (message: IMMessage[]): ChatMessage[] => {
  return message
    .map(ele => {
      const msg = {
        _id: ele.sendUuid,
        ...ele,
        text: ele.content,
        createdAt: Number(ele.createAt),
        user: {
          _id: ele.from,
        },
      } as any;
      if (ele.type === 'IMAGE' && typeof ele.parsedContent !== 'string') {
        delete msg.text;
        msg.image = decodeURIComponent(ele.parsedContent?.thumbImgUrl || ele.parsedContent?.imgUrl || '');
        msg.imageInfo = {
          width: ele.parsedContent?.width,
          height: ele.parsedContent?.height,
          imgUri: decodeURIComponent(ele.parsedContent?.imgUrl || ''),
          thumbUri: decodeURIComponent(ele.parsedContent?.thumbImgUrl || ''),
        };
      }
      return msg;
    })
    .reverse();
};

const ChatsUI = () => {
  const currentChannelId = useCurrentChannelId();
  const { list, init } = useChannel(currentChannelId || '');

  const [loading, setLoading] = useState(true);

  const formattedList = useMemo(() => format(list), [list]);
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

  const relationId = useRelationId();
  const user = useMemo(() => ({ _id: relationId || '' }), [relationId]);

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
            renderUsername={Empty}
            renderTime={Empty}
            isCustomViewBottom
            renderAvatar={Empty}
            showUserAvatar={false}
            messages={formattedList}
            minInputToolbarHeight={0}
            renderUsernameOnMessage={false}
            renderInputToolbar={Empty}
            renderBubble={renderBubble}
            renderMessage={renderMessage}
            listViewProps={listViewProps}
            messageIdGenerator={randomId}
            showAvatarForEveryMessage={true}
            isKeyboardInternallyHandled={true}
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
