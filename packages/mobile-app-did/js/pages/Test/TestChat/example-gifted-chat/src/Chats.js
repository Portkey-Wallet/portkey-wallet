import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import initialMessages from './messages';
import { renderInputToolbar, renderActions, renderComposer, renderSend, renderAccessory } from './InputToolbar';
import {
  renderAvatar,
  RenderBubble,
  renderSystemMessage,
  renderMessage,
  renderMessageText,
  renderCustomView,
} from './MessageContainer';
import { randomId } from '@portkey-wallet/utils';
import { Keyboard } from 'react-native';

const user = {
  _id: 1,
  name: 'Aaron',
  avatar: 'https://lmg.jj20.com/up/allimg/1111/05161Q64001/1P516164001-3-1200.jpg',
};

const Chats = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isShowTools, setIsShowTools] = useState(false);

  useEffect(() => {
    setMessages(initialMessages.reverse());
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
      setIsShowTools(false);
    });

    return () => {
      showSubscription.remove();
    };
  }, []);

  const onSend = (newMessages = []) => {
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));
  };

  return (
    <>
      <GiftedChat
        showUserAvatar
        showAvatarForEveryMessage
        alignTop
        alwaysShowSend
        scrollToBottom
        renderAvatarOnTop
        renderUsernameOnMessage
        isCustomViewBottom
        user={user}
        messages={messages}
        messageIdGenerator={randomId}
        onInputTextChanged={setText}
        onSend={onSend}
        onPressAvatar={console.log}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderActions}
        onPressActionButton={() => setIsShowTools(!isShowTools)}
        renderAccessory={renderAccessory}
        // renderComposer={renderComposer}
        renderSend={renderSend}
        renderAvatar={renderAvatar}
        renderBubble={props => <RenderBubble {...props} />}
        renderSystemMessage={renderSystemMessage}
        renderMessage={renderMessage}
        renderMessageText={renderMessageText}
        // renderMessageImage
        renderCustomView={renderCustomView}
        messagesContainerStyle={{ backgroundColor: 'indigo' }}
        parsePatterns={linkStyle => [
          {
            pattern: /#(\w+)/,
            style: linkStyle,
            onPress: tag => console.log(`Pressed on hashtag: ${tag}`),
          },
        ]}
      />
    </>
  );
};

export default Chats;
