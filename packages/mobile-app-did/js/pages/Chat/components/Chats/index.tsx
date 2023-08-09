import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, GiftedChatProps, IMessage, MessageTextProps, Time } from 'react-native-gifted-chat';
import initialMessages from '../messages';
import { AccessoryBar, BottomBarContainer } from '../InputToolbar';
import { renderSystemMessage, renderMessage, renderBubble } from '../MessageContainer';
import { randomId } from '@portkey-wallet/utils';
import { Keyboard } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { useParsePatterns } from 'pages/Chat/hooks';
import Touchable from 'components/Touchable';
import { useChatsDispatch } from '../context/hooks';
import { setBottomBarStatus, setChatText } from '../context/chatsContext';
import useEffectOnce from 'hooks/useEffectOnce';
import MessageText from '../Message/MessageText';

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
    console.log('=======newMessages=============================', newMessages);
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
  const renderTime: GiftedChatProps['renderTime'] = useCallback((props: MessageTextProps<IMessage>) => {
    if (props.currentMessage?.text) return null;
    return <Time {...props} />;
  }, []);
  return (
    <>
      <Touchable activeOpacity={1} onPress={onDismiss} style={GStyles.flex1}>
        <GiftedChat
          alignTop
          user={user}
          alwaysShowSend
          scrollToBottom
          isCustomViewBottom
          onSend={onSend}
          messages={messages}
          showUserAvatar={false}
          renderAvatar={() => null}
          renderInputToolbar={() => null}
          renderBubble={renderBubble}
          messageIdGenerator={randomId}
          renderMessage={renderMessage}
          showAvatarForEveryMessage={false}
          isKeyboardInternallyHandled={false}
          renderMessageText={renderMessageText}
          renderSystemMessage={renderSystemMessage}
          renderTime={renderTime}
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
