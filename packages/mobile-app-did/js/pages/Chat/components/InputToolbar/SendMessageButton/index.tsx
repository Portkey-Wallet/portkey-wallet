import Svg from 'components/Svg';
import React from 'react';
import { IMessage, Send, SendProps } from 'react-native-gifted-chat';
import { pTd } from 'utils/unit';

export const SendMessageButton: React.FC<SendProps<IMessage>> = props => (
  <Send {...props}>
    <Svg icon="chat-send" size={pTd(24)} />
  </Send>
);
