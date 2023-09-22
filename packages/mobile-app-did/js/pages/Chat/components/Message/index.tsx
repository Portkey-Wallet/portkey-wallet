import React, { memo } from 'react';
import Touchable from 'components/Touchable';
import { StyleSheet } from 'react-native';
import { Message, MessageProps } from 'react-native-gifted-chat';
import { pTd } from 'utils/unit';
import { ChatMessage } from 'pages/Chat/types';
import isEqual from 'lodash/isEqual';

function ChatMessageContainer(
  props: MessageProps<ChatMessage> & {
    onDismiss: () => void;
  },
) {
  return (
    <Touchable activeOpacity={1} onPress={props.onDismiss}>
      <Message
        containerStyle={{
          left: styles.leftMessageContainer,
          right: styles.rightMessageContainer,
        }}
        {...props}
      />
    </Touchable>
  );
}

export default memo(ChatMessageContainer, (prevProps, nextProps) => {
  return isEqual(prevProps.currentMessage, nextProps.currentMessage);
});

const styles = StyleSheet.create({
  leftMessageContainer: {
    marginLeft: pTd(16),
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  rightMessageContainer: {
    marginLeft: 0,
    marginRight: pTd(16),
    marginTop: 0,
    marginBottom: 0,
  },
});
