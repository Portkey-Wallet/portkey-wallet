import React, { useCallback, useMemo } from 'react';
import {
  GiftedChat,
  GiftedChatProps,
  IMessage,
  Message,
  MessageImageProps,
  MessageProps,
  MessageTextProps,
} from 'react-native-gifted-chat';
import { AccessoryBar, BottomBarContainer } from '../InputToolbar';
import { randomId } from '@portkey-wallet/utils';
import { Keyboard, View } from 'react-native';
import { useChatsDispatch, useCurrentChannelId } from '../../context/hooks';
import CustomBubble from '../CustomBubble';
import { setBottomBarStatus, setChatText, setShowSoftInputOnFocus } from '../../context/chatsContext';
import useEffectOnce from 'hooks/useEffectOnce';
import MessageText from '../Message/MessageText';
import { destroyChatInputRecorder, initChatInputRecorder } from 'pages/Chat/utils';
import MessageImage from '../Message/MessageImage';
import { Message as IMMessage } from '@portkey-wallet/im/types';

import { useThrottleCallback } from '@portkey-wallet/hooks';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { useChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import im from '@portkey-wallet/im';
import GStyles from 'assets/theme/GStyles';

const Empty = () => null;

const ListViewProps = {
  // windowSize: 50,
  // maxToRenderPerBatch: 5,
  // removeClippedSubviews: false,
  // legacyImplementation: true,
  initialNumToRender: 20,
};

const format = (message: IMMessage[]): IMessage[] => {
  return message
    .map(ele => {
      const msg = {
        _id: ele.sendUuid,
        text: ele.content,
        createdAt: Number(ele.createAt),
        user: {
          _id: ele.from,
        },
      } as any;
      if (ele.type === 'IMAGE' && typeof ele.parsedContent !== 'string') {
        delete msg.text;
        msg.image = ele.parsedContent?.thumbImgUrl || ele.parsedContent?.imgUrl;
        msg.imageInfo = {
          width: ele.parsedContent?.width,
          height: ele.parsedContent?.height,
          imgUri: ele.parsedContent?.imgUrl,
          thumbUri: ele.parsedContent?.thumbImgUrl,
        };
      }
      return msg;
    })
    .reverse();
};

const ChatsUI = () => {
  const currentChannelId = useCurrentChannelId();
  const { list, init } = useChannel(currentChannelId || '');
  console.log(list, '====ChatsUI-list');

  const formattedList = useMemo(() => format(list), [list]);

  const dispatch = useChatsDispatch();

  useEffectOnce(() => {
    init();
    initChatInputRecorder();
    return () => {
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
      <View style={GStyles.flex1}>
        <GiftedChat
          alignTop
          alwaysShowSend
          scrollToBottom
          user={{ _id: im.userInfo?.relationId || '' }}
          renderTime={Empty}
          isCustomViewBottom
          messages={formattedList}
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
      </View>
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
