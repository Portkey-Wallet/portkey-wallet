import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, GiftedChatProps, IMessage, MessageImageProps, MessageTextProps } from 'react-native-gifted-chat';
import initialMessages from '../messages';
import { AccessoryBar, BottomBarContainer } from '../InputToolbar';
import { renderSystemMessage, renderMessage } from '../MessageContainer';
import { randomId } from '@portkey-wallet/utils';
import { Keyboard } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';
import { useChatsDispatch } from '../context/hooks';
import CustomBubble from '../CustomBubble';
import { setBottomBarStatus, setChatText } from '../context/chatsContext';
import useEffectOnce from 'hooks/useEffectOnce';
import MessageText from '../Message/MessageText';
import MessageImage from '../Message/MessageImage';

import { BGStyles } from 'assets/theme/styles';

const user = {
  _id: 1,
  name: 'Aaron',
  avatar: 'https://lmg.jj20.com/up/allimg/1111/05161Q64001/1P516164001-3-1200.jpg',
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
    return () => {
      dispatch(setChatText(''));
    };
  });

  const onDismiss = useCallback(() => {
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

  return (
    <>
      <Touchable activeOpacity={1} onPress={onDismiss} style={[GStyles.flex1, BGStyles.bg1]}>
        <GiftedChat
          alignTop
          user={user}
          alwaysShowSend
          isCustomViewBottom
          onSend={onSend}
          messages={messages}
          minInputToolbarHeight={0}
          renderAvatar={() => null}
          renderInputToolbar={() => null}
          renderTime={() => null}
          messageIdGenerator={randomId}
          showAvatarForEveryMessage={false}
          isKeyboardInternallyHandled={false}
          renderBubble={renderBubble}
          renderMessage={renderMessage}
          renderMessageText={renderMessageText}
          renderMessageImage={renderMessageImage}
          renderSystemMessage={renderSystemMessage}
        />
      </Touchable>
      <BottomBarContainer>
        <AccessoryBar />
      </BottomBarContainer>
    </>
  );
};

export default function Chats() {
  return <ChatsUI />;
}
