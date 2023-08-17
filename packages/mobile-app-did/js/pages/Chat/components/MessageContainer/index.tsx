import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { GiftedChatProps } from 'react-native-gifted-chat';
import { SystemMessage, Message, MessageText } from 'react-native-gifted-chat';
import { pTd } from 'utils/unit';

export const renderSystemMessage: GiftedChatProps['renderSystemMessage'] = props => <SystemMessage {...props} />;

export const renderMessage: GiftedChatProps['renderMessage'] = props => (
  <TouchableOpacity activeOpacity={1}>
    <Message
      containerStyle={{
        left: styles.leftMessageContainer,
        right: styles.rightMessageContainer,
      }}
      {...props}
    />
  </TouchableOpacity>
);

export const renderMessageText: GiftedChatProps['renderMessageText'] = props => {
  return <MessageText {...props} />;
};

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
