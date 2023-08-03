import React, { useState, useEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import initialMessages from './messages';
import { CustomInputToolbar, renderActions, renderSend, renderAccessory } from '../components/InputToolbar';
import { RenderBubble, renderSystemMessage, renderMessage, renderMessageText } from '../components/MessageContainer';
import { randomId } from '@portkey-wallet/utils';
import { Keyboard, StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';

const user = {
  _id: 1,
  name: 'Aaron',
  avatar: 'https://lmg.jj20.com/up/allimg/1111/05161Q64001/1P516164001-3-1200.jpg',
};

const Chats = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isShowTools, setIsShowTools] = useState(false);

  const jump = useDiscoverJumpWithNetWork();

  useEffect(() => {
    setMessages(initialMessages as IMessage[]);
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsShowTools(false);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsShowTools(true);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onSend = (newMessages: IMessage[]) => {
    console.log('=======newMessages=============================', newMessages);
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));
  };

  return (
    <GiftedChat
      showUserAvatar={false}
      showAvatarForEveryMessage={false}
      renderAvatar={() => null}
      alignTop
      alwaysShowSend
      scrollToBottom
      isCustomViewBottom
      user={user}
      messages={messages}
      messageIdGenerator={randomId}
      onInputTextChanged={setText}
      onSend={onSend}
      renderInputToolbar={props => <CustomInputToolbar isShowTools={isShowTools} {...props} />}
      renderActions={renderActions}
      onPressActionButton={() => {
        setIsShowTools(!isShowTools);
        Keyboard.dismiss();
      }}
      renderAccessory={() => (isShowTools ? renderAccessory(isShowTools) : null)}
      // renderComposer={renderComposer}
      renderSend={renderSend}
      renderBubble={props => <RenderBubble {...props} />}
      renderSystemMessage={renderSystemMessage}
      renderMessage={renderMessage}
      renderMessageText={renderMessageText}
      // renderMessageImage
      // renderCustomView={renderCustomView}
    />
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  svgWrap: {
    padding: pTd(16),
  },
});
