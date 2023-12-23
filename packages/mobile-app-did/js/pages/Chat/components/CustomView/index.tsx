import React, { memo } from 'react';
import { MessageProps } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { ChatMessage } from 'pages/Chat/types';
import isEqual from 'lodash/isEqual';
import RedPacket from './RedPacket';
import TransferCard from './TransferCard';

function CustomView(props: MessageProps<ChatMessage> & { onDismiss: () => void }) {
  const { currentMessage } = props;

  // TODO: type change
  if (currentMessage?.messageType === 'TRANSFER-CARD') return <TransferCard {...props} />;

  if (currentMessage?.messageType === 'REDPACKAGE-CARD') return <RedPacket {...props} />;

  return null;
}

export default memo(CustomView, (prevProps, nextProps) => {
  return isEqual(prevProps.currentMessage, nextProps.currentMessage);
});

const styles = StyleSheet.create({
  wrap: {
    width: pTd(260),
    height: pTd(72),
    backgroundColor: defaultColors.bg22,
    borderRadius: pTd(12),
    overflow: 'hidden',
  },
  memo: {
    color: defaultColors.font1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  countContainer: {
    alignItems: 'center',
    padding: 10,
  },
});
