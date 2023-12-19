import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  AvatarProps,
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
import { Text } from 'react-native';
import { randomId } from '@portkey-wallet/utils';
import { ActivityIndicator, FlatList, Keyboard, StyleSheet, View } from 'react-native';
import { useChatsDispatch, useCurrentChannelId } from '../../context/hooks';
import CustomBubble from '../CustomBubble';
import { setBottomBarStatus, setChatText, setShowSoftInputOnFocus } from '../../context/chatsContext';
import useEffectOnce from 'hooks/useEffectOnce';
import MessageText from '../Message/MessageText';
import { destroyChatInputRecorder, initChatInputRecorder } from 'pages/Chat/utils';
import MessageImage from '../Message/MessageImage';

import { useThrottleCallback } from '@portkey-wallet/hooks';

import Touchable from 'components/Touchable';
import { useGroupChannel, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
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
import OverlayModal from 'components/OverlayModal';
import { useGStyles } from 'assets/theme/useGStyles';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import CustomChatAvatar from '../CustomChatAvatar';
import { TextL } from 'components/CommonText';

const ListViewProps = {
  // windowSize: 50,
  // maxToRenderPerBatch: 5,
  // removeClippedSubviews: false,
  // legacyImplementation: true,
  initialNumToRender: 20,
  alwaysBounceVertical: false,
};
const Empty = () => null;

function PinnedListOverlay() {
  const currentChannelId = useCurrentChannelId();
  const dispatch = useChatsDispatch();
  const messageContainerRef = useRef<FlatList>();
  const gStyles = useGStyles();

  const { list, init, hasNext, next } = useGroupChannel(currentChannelId || '');
  const [initializing, setInitializing] = useState(true);
  const formattedList = useMemo(() => formatMessageList(list), [list]);
  const { relationId } = useRelationId();
  const user = useMemo(() => ({ _id: relationId || '' }), [relationId]);

  const onLoadEarlier = useLockCallback(async () => {
    if (initializing) return;
    try {
      if (hasNext) await next();
    } catch (error) {
      console.log('error', error);
    }
  }, [hasNext, initializing, next]);

  useEffectOnce(() => {
    initChatInputRecorder();
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 200);
    return () => {
      clearTimeout(timer);
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
    (props: MessageTextProps<ChatMessage>) => <MessageText {...props} />,
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
    return <CustomBubble isGroupChat {...data} />;
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

  const renderAvatar = useCallback((props: AvatarProps<ChatMessage>) => {
    return <CustomChatAvatar {...props} />;
  }, []);

  const disabledTouchable = useMemo(() => formattedList.length > 10, [formattedList.length]);

  useEffectOnce(() => {
    init();
  });

  const unPinAll = useCallback(() => {
    // TODO
    console.log('unPinAll');
    OverlayModal.hide();
  }, []);

  return (
    <View style={[gStyles.overlayStyle, styles.wrap]}>
      <View style={[GStyles.flexCenter, styles.header]}>
        <Text style={styles.headerTitle}>5 pinned messages</Text>
        <Touchable style={styles.closeWrap} onPress={() => OverlayModal.hide()}>
          <Svg icon="close1" size={pTd(12.5)} />
        </Touchable>
      </View>
      <Touchable disabled={disabledTouchable} activeOpacity={1} onPress={onDismiss} style={GStyles.flex1}>
        {initializing ? (
          <ActivityIndicator size={'small'} color={FontStyles.font4.color} />
        ) : (
          <GiftedChat
            alignTop
            user={user}
            messageContainerRef={messageContainerRef as any}
            messageIdGenerator={randomId}
            alwaysShowSend
            renderUsername={Empty}
            renderTime={Empty}
            isCustomViewBottom
            renderAvatarOnTop
            renderAvatar={renderAvatar as GiftedChatProps['renderAvatar']}
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
            messagesContainerStyle={styles.messagesContainerStyle}
            renderMessageText={renderMessageText}
            renderMessageImage={renderMessageImage}
            onLoadEarlier={onLoadEarlier}
          />
        )}
      </Touchable>
      <Touchable style={styles.bottomButtonWrap} onPress={unPinAll}>
        <TextL style={FontStyles.font4}>{`Unpin All 5 Messages`}</TextL>
      </Touchable>
    </View>
  );
}

export const showPinnedListOverlay = (params: any) => {
  console.log(params);
  Keyboard.dismiss();
  OverlayModal.show(<PinnedListOverlay {...params} />, {
    position: 'bottom',
    enabledNestScrollView: true,
    containerStyle: { backgroundColor: defaultColors.bg6 },
  });
};

export default {
  showPinnedListOverlay,
};

const styles = StyleSheet.create({
  wrap: {
    width: screenWidth,
  },
  header: {
    ...GStyles.paddingArg(16, 20),
    position: 'relative',
    backgroundColor: defaultColors.primaryColor,
  },
  headerTitle: {
    fontSize: pTd(18),
    color: defaultColors.font11,
    textAlign: 'center',
  },
  closeWrap: {
    position: 'absolute',
    paddingVertical: pTd(21),
    paddingHorizontal: pTd(24),
    right: 0,
    zIndex: 1,
  },
  messagesContainerStyle: {
    backgroundColor: defaultColors.bg1,
    flex: 1,
  },
  contentStyle: {
    paddingTop: pTd(24),
  },
  bottomButtonWrap: {
    width: screenWidth,
    height: pTd(60),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultColors.bg6,
    borderTopWidth: pTd(0.5),
    borderTopColor: defaultColors.border6,
  },
});
