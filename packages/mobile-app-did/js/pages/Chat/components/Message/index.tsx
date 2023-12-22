import React, { memo, useMemo } from 'react';
import Touchable from 'components/Touchable';
import { StyleSheet } from 'react-native';
import { Message, MessageProps } from 'react-native-gifted-chat';
import { pTd } from 'utils/unit';
import { ChatMessage } from 'pages/Chat/types';
import isEqual from 'lodash/isEqual';
import GStyles from 'assets/theme/GStyles';

function ChatMessageContainer(
  props: MessageProps<ChatMessage> & {
    onDismiss: () => void;
  },
) {
  const { previousMessage, currentMessage } = props;

  const isMarginTop8 = useMemo(
    () => previousMessage?.user && previousMessage?.user._id === currentMessage?.user._id,
    [currentMessage?.user, previousMessage?.user],
  );

  return (
    <Touchable activeOpacity={1} onPress={props.onDismiss}>
      <Message
        containerStyle={{
          left: [styles.leftMessageContainer, isMarginTop8 && GStyles.marginTop(pTd(8))],
          right: [styles.rightMessageContainer, isMarginTop8 && GStyles.marginTop(pTd(8))],
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
    marginTop: pTd(16),
    marginBottom: 0,
  },
  rightMessageContainer: {
    marginLeft: 0,
    marginRight: pTd(16),
    marginTop: pTd(16),
    marginBottom: 0,
  },
});
