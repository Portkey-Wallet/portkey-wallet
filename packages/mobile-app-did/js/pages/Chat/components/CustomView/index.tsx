import React, { memo } from 'react';
import { MessageProps } from 'react-native-gifted-chat';
import { ChatMessage } from 'pages/Chat/types';
import isEqual from 'lodash/isEqual';
import RedPacket from './RedPacket';
import TransferCard from './TransferCard';

function CustomView(props: MessageProps<ChatMessage> & { onDismiss: () => void }) {
  const { currentMessage } = props;

  if (currentMessage?.messageType === 'TRANSFER-CARD') return <TransferCard {...props} />;

  if (currentMessage?.messageType === 'REDPACKAGE-CARD') return <RedPacket {...props} />;

  return null;
}

export default memo(CustomView, (prevProps, nextProps) => {
  return isEqual(prevProps.currentMessage, nextProps.currentMessage);
});
