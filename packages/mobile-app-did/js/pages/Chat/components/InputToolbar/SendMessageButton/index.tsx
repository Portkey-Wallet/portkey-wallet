import Svg from 'components/Svg';
import React from 'react';
import { Send, GiftedChatProps } from 'react-native-gifted-chat';

export const SendMessageButton: GiftedChatProps['renderSend'] = props => (
  <Send {...props} disabled={!!props}>
    <Svg icon="send" color="red" />
  </Send>
);
