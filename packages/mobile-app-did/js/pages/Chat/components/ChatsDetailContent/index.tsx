import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  BubbleProps,
  DayProps,
  GiftedChat,
  GiftedChatProps,
  IMessage,
  MessageImageProps,
  MessageProps,
  MessageTextProps,
  SystemMessageProps,
} from 'react-native-gifted-chat';
import { AccessoryBar, BottomBarContainer } from '../InputToolbar';
import { randomId } from '@portkey-wallet/utils';
import { ActivityIndicator, FlatList, Keyboard, StyleSheet, View } from 'react-native';
import { useChatsDispatch, useCurrentChannelId } from '../../context/hooks';
import CustomBubble from '../CustomBubble';
import { setBottomBarStatus, setChatText, setShowSoftInputOnFocus } from '../../context/chatsContext';
import useEffectOnce from 'hooks/useEffectOnce';
import MessageText from '../Message/MessageText';
import { destroyChatInputRecorder, initChatInputRecorder, isCommonView } from 'pages/Chat/utils';
import MessageImage from '../Message/MessageImage';

import { useThrottleCallback } from '@portkey-wallet/hooks';

import Touchable from 'components/Touchable';
import { useBlockAndReport, useChannel, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import GStyles from 'assets/theme/GStyles';
import { ChatMessage } from 'pages/Chat/types';
import { FontStyles } from 'assets/theme/styles';
import ChatMessageContainer from '../Message';
import { formatMessageList } from 'pages/Chat/utils/format';
import SystemTime from '../SystemTime';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import SystemInfo from '../SystemInfo';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import CustomView from '../CustomView';
import UnBlockButton from '../UnBlockButton';
import { ChannelTypeEnum } from '@portkey-wallet/im';
import ChatDetailsContext from 'pages/Chat/ChatDetailsPage/ChatDetailContext';
import useBotSendingStatus from '@portkey-wallet/hooks/hooks-ca/im/useBotSendingStatus';

const ListViewProps = {
  // windowSize: 50,
  // maxToRenderPerBatch: 5,
  // removeClippedSubviews: false,
  // legacyImplementation: true,
  initialNumToRender: 20,
  alwaysBounceVertical: false,
};
const Empty = () => null;

export default function ChatsDetailContent() {
  const currentChannelId = useCurrentChannelId();
  const dispatch = useChatsDispatch();
  const messageContainerRef = useRef<FlatList>();
  const { isBot } = useContext(ChatDetailsContext);

  const { list, init, next, hasNext, loading, info } = useChannel(currentChannelId || '', ChannelTypeEnum.P2P, isBot);
  const [initializing, setInitializing] = useState(true);
  const { changeToRepliedStatus } = useBotSendingStatus(info?.toRelationId || '');

  useEffect(() => {
    if (!initializing && !loading) return;
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [initializing, loading]);
  const formattedList = useMemo(() => formatMessageList(list), [list]);
  const { relationId } = useRelationId();
  const user = useMemo(() => ({ _id: relationId || '' }), [relationId]);
  const { isBlocked } = useBlockAndReport(info?.toRelationId || '');
  const lastMessage = useMemo(() => formattedList[0], [formattedList]);
  useEffect(() => {
    if (!!lastMessage && !lastMessage?.isOwner) {
      changeToRepliedStatus();
    }
  }, [changeToRepliedStatus, info?.toRelationId, lastMessage, lastMessage?.isOwner]);

  const onLoadEarlier = useLockCallback(async () => {
    try {
      if (initializing) return;
      if (hasNext) await next();
    } catch (error) {
      console.log('error', error);
    }
  }, [hasNext, initializing, next]);

  useEffectOnce(() => {
    initChatInputRecorder();
    return () => {
      dispatch(setChatText(''));
      dispatch(setBottomBarStatus(undefined));
      dispatch(setShowSoftInputOnFocus(true));
      destroyChatInputRecorder();
    };
  });

  const scrollToBottom = useCallback(() => {
    if (messageContainerRef?.current?.scrollToOffset)
      messageContainerRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  const onDismiss = useThrottleCallback(() => {
    Keyboard.dismiss();
    dispatch(setBottomBarStatus(undefined));
  }, [dispatch]);

  const renderMessageText: GiftedChatProps['renderMessageText'] = useCallback(
    (props: MessageTextProps<ChatMessage>) => {
      return isCommonView(props.currentMessage?.messageType) ? null : <MessageText {...props} />;
    },
    [],
  );

  const renderMessageImage: GiftedChatProps['renderMessageImage'] = useCallback(
    (props: MessageImageProps<ChatMessage>) => <MessageImage {...(props as MessageProps<ChatMessage>)} />,
    [],
  );

  const renderDay: GiftedChatProps['renderDay'] = useCallback(
    (props: DayProps<IMessage>) => <SystemTime {...props} />,
    [],
  );

  const renderBubble: GiftedChatProps['renderBubble'] = useCallback((data: BubbleProps<ChatMessage>) => {
    return <CustomBubble {...data} />;
  }, []);

  const listViewProps: GiftedChatProps['listViewProps'] = useMemo(() => {
    return {
      ...ListViewProps,
      contentContainerStyle: styles.contentStyle,
      onEndReached: () => onLoadEarlier(),
      onEndReachedThreshold: ON_END_REACHED_THRESHOLD,
      onScrollBeginDrag: onDismiss,
    };
  }, [onDismiss, onLoadEarlier]);

  const renderScrollToBottomComponent = useCallback(() => {
    return <Svg icon="chat-scroll-to-bottom" size={pTd(24)} />;
  }, []);

  const renderMessage = useCallback(
    (props: MessageProps<ChatMessage>) => {
      return <ChatMessageContainer onDismiss={onDismiss} {...props} />;
    },
    [onDismiss],
  );

  const renderSystemMessage: GiftedChatProps['renderSystemMessage'] = useCallback(
    (props: SystemMessageProps<ChatMessage>) => {
      return <SystemInfo {...props} />;
    },
    [],
  );

  const renderCustomView = useCallback(
    (props: MessageProps<ChatMessage>) => {
      return <CustomView onDismiss={onDismiss} {...props} />;
    },
    [onDismiss],
  );

  console.log('info info', info);

  const bottomBar = useMemo(
    () =>
      isBlocked ? (
        <UnBlockButton blockedUserId={info?.toRelationId || ''} />
      ) : (
        <BottomBarContainer scrollToBottom={scrollToBottom}>
          <AccessoryBar />
        </BottomBarContainer>
      ),
    [info?.toRelationId, isBlocked, scrollToBottom],
  );

  const disabledTouchable = useMemo(() => formattedList.length > 10, [formattedList.length]);

  useEffectOnce(() => {
    init();
  });

  return (
    <>
      <Touchable disabled={disabledTouchable} activeOpacity={1} onPress={onDismiss} style={GStyles.flex1}>
        {!!initializing && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size={'small'} color={FontStyles.font4.color} />
          </View>
        )}
        <GiftedChat
          alignTop
          user={user}
          messageContainerRef={messageContainerRef as any}
          messageIdGenerator={randomId}
          alwaysShowSend
          scrollToBottom
          renderUsername={Empty}
          renderTime={Empty}
          isCustomViewBottom
          renderAvatarOnTop
          renderAvatar={Empty}
          showUserAvatar={false}
          messages={formattedList}
          minInputToolbarHeight={0}
          renderUsernameOnMessage={true}
          renderInputToolbar={Empty}
          renderDay={renderDay}
          renderSystemMessage={renderSystemMessage}
          renderBubble={renderBubble}
          renderMessage={renderMessage}
          listViewProps={listViewProps}
          showAvatarForEveryMessage={true}
          isKeyboardInternallyHandled={false}
          scrollToBottomComponent={renderScrollToBottomComponent}
          messagesContainerStyle={styles.messagesContainerStyle}
          renderMessageText={renderMessageText}
          renderMessageImage={renderMessageImage}
          renderCustomView={renderCustomView}
        />
      </Touchable>
      {bottomBar}
    </>
  );
}

const styles = StyleSheet.create({
  messagesContainerStyle: {
    backgroundColor: defaultColors.bg1,
    flex: 1,
  },
  contentStyle: {
    paddingTop: pTd(12),
  },
  loadingBox: { position: 'absolute', top: 5, alignSelf: 'center' },
});
