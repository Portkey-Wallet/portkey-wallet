import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BubbleProps } from 'react-native-gifted-chat';
import { Bubble } from 'react-native-gifted-chat';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { ChatMessage } from 'pages/Chat/types';
import { TextS } from 'components/CommonText';

export default function CustomBubble(props: BubbleProps<ChatMessage> & { isGroupChat?: boolean }) {
  const { isGroupChat, currentMessage, previousMessage, user } = props || {};
  const { messageType } = currentMessage || {};

  const isHideName = useMemo(
    () => currentMessage?.user?._id === previousMessage?.user?._id || user?._id === currentMessage?.user?._id,
    [currentMessage?.user?._id, previousMessage?.user?._id, user?._id],
  );

  return (
    <View>
      {isGroupChat && !isHideName && (
        <TextS numberOfLines={1} style={styles.memberName}>
          {currentMessage?.fromName}
        </TextS>
      )}
      <Bubble
        touchableProps={{ disabled: true }}
        wrapperStyle={useMemo(
          () => ({
            left: [styles.wrapperStyle, styles.wrapLeft, messageType === 'NOT_SUPPORTED' && styles.notSupportStyle],
            right: [styles.wrapperStyle, styles.wrapRight, messageType === 'NOT_SUPPORTED' && styles.notSupportStyle],
          }),
          [messageType],
        )}
        containerToNextStyle={{
          left: styles.containerToNextLeftStyle,
          right: styles.containerToNextRightStyle,
        }}
        containerStyle={{
          left: styles.containerStyle,
          right: styles.containerStyle,
        }}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperStyle: {
    borderRadius: pTd(20),
    color: defaultColors.font5,
  },
  wrapLeft: {
    backgroundColor: defaultColors.bg18,
    borderTopLeftRadius: pTd(2),
    marginLeft: -pTd(8),
    overflow: 'hidden',
  },
  wrapRight: {
    backgroundColor: defaultColors.bg9,
    borderTopRightRadius: pTd(2),
    marginRight: 0,
    overflow: 'hidden',
  },
  containerToNextRightStyle: {
    borderBottomRightRadius: pTd(20),
  },
  containerToNextLeftStyle: {
    borderTopLeftRadius: pTd(2),
    borderBottomLeftRadius: pTd(20),
  },
  containerStyle: {
    marginHorizontal: pTd(4),
  },
  notSupportStyle: {
    backgroundColor: defaultColors.bg18,
  },
  memberName: {
    color: defaultColors.font7,
    marginBottom: pTd(4),
    marginLeft: -pTd(4),
  },
});
