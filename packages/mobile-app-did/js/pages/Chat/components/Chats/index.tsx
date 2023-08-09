import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import initialMessages from '../messages';
import { AccessoryBar, BottomBarContainer } from '../InputToolbar';
import { renderSystemMessage, renderMessage, renderMessageText } from '../MessageContainer';
import { randomId } from '@portkey-wallet/utils';
import { Keyboard } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { ChatsProvider, setBottomBarStatus } from '../context/chatsContext';
import { useParsePatterns } from 'pages/Chat/hooks';
import Touchable from 'components/Touchable';
import { useChatsDispatch } from '../context/hooks';
import CustomBubble from '../CustomBubble';

const user = {
  _id: 1,
  name: 'Aaron',
  avatar: 'https://lmg.jj20.com/up/allimg/1111/05161Q64001/1P516164001-3-1200.jpg',
};

const ChatsUI = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const parsePatterns = useParsePatterns();
  const dispatch = useChatsDispatch();

  useEffect(() => {
    setMessages(initialMessages as IMessage[]);
  }, []);

  const onSend = (newMessages: IMessage[]) => {
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));
  };

  const renderBubble = useCallback((data: any) => {
    return <CustomBubble {...data} />;
  }, []);

  return (
    <>
      <Touchable
        activeOpacity={1}
        onPress={() => {
          Keyboard.dismiss();
          dispatch(setBottomBarStatus(undefined));
        }}
        style={GStyles.flex1}>
        <GiftedChat
          alignTop
          user={user}
          alwaysShowSend
          scrollToBottom
          isCustomViewBottom
          onSend={onSend}
          messages={messages}
          showUserAvatar={false}
          renderInputToolbar={() => null}
          renderBubble={renderBubble}
          parsePatterns={parsePatterns}
          messageIdGenerator={randomId}
          renderMessage={renderMessage}
          showAvatarForEveryMessage={false}
          isKeyboardInternallyHandled={false}
          renderMessageText={renderMessageText}
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
  return (
    <ChatsProvider>
      <ChatsUI />
    </ChatsProvider>
  );
}
