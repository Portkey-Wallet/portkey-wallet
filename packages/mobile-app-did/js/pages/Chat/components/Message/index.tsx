import React, { memo, useMemo } from 'react';
import Touchable from 'components/Touchable';
import { StyleSheet } from 'react-native';
import { Message, MessageProps } from 'react-native-gifted-chat';
import { pTd } from 'utils/unit';
import { ChatMessage } from 'pages/Chat/types';
import isEqual from 'lodash/isEqual';
import GStyles from 'assets/theme/GStyles';
import { isSystemTypeMessage } from 'pages/Chat/utils';

function ChatMessageContainer(
  props: MessageProps<ChatMessage> & {
    onDismiss: () => void;
  },
) {
  const { previousMessage, currentMessage } = props;

  const isMarginTop4 = useMemo(
    () =>
      previousMessage?.user &&
      previousMessage?.user._id === currentMessage?.user._id &&
      !isSystemTypeMessage(currentMessage?.messageType) === !isSystemTypeMessage(previousMessage?.messageType),
    [currentMessage?.messageType, currentMessage?.user._id, previousMessage?.messageType, previousMessage?.user],
  );

  return (
    <Touchable activeOpacity={1} onPress={props.onDismiss}>
      <Message
        containerStyle={{
          left: [styles.leftMessageContainer, isMarginTop4 && GStyles.marginTop(pTd(4))],
          right: [styles.rightMessageContainer, isMarginTop4 && GStyles.marginTop(pTd(4))],
        }}
        {...props}
      />
    </Touchable>
  );
}

export default memo(ChatMessageContainer, (prevProps, nextProps) => {
  return (
    isEqual(prevProps.currentMessage, nextProps.currentMessage) &&
    isEqual(prevProps.previousMessage?._id, nextProps.previousMessage?._id)
  );
});

const styles = StyleSheet.create({
  leftMessageContainer: {
    marginLeft: pTd(12),
    marginRight: 0,
    marginTop: pTd(12),
    marginBottom: 0,
    paddingRight: pTd(12),
  },
  rightMessageContainer: {
    marginLeft: 0,
    marginRight: pTd(12),
    marginTop: pTd(12),
    marginBottom: 0,
    paddingLeft: pTd(12),
  },
});
