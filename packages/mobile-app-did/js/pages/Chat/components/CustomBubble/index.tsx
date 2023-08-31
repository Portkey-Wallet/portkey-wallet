import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { BubbleProps } from 'react-native-gifted-chat';
import { Bubble } from 'react-native-gifted-chat';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { ChatMessage } from 'pages/Chat/types';

export default function CustomBubble(props: BubbleProps<ChatMessage>) {
  const { messageType } = props?.currentMessage || {};

  // return (
  //   <View>
  //     <TextM>名字</TextM>
  //     <Bubble
  //       touchableProps={{ disabled: true }}
  //       wrapperStyle={useMemo(
  //         () => ({
  //           left: [styles.wrapperStyle, styles.wrapLeft, messageType === 'NOT_SUPPORTED' && styles.notSupportStyle],
  //           right: [styles.wrapperStyle, styles.wrapRight, messageType === 'NOT_SUPPORTED' && styles.notSupportStyle],
  //         }),
  //         [messageType],
  //       )}
  //       containerToNextStyle={{
  //         left: styles.containerToNextLeftStyle,
  //         right: styles.containerToNextRightStyle,
  //       }}
  //       containerStyle={{
  //         left: styles.containerStyle,
  //         right: styles.containerStyle,
  //       }}
  //       {...props}
  //     />
  //   </View>
  // );

  return (
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
  },
  wrapRight: {
    backgroundColor: defaultColors.bg9,
    borderTopRightRadius: pTd(2),
    marginRight: 0,
  },
  containerToNextRightStyle: {
    borderBottomRightRadius: pTd(20),
  },
  containerToNextLeftStyle: {
    borderTopLeftRadius: pTd(2),
    borderBottomLeftRadius: pTd(20),
  },
  containerStyle: {
    margin: pTd(4),
  },
  notSupportStyle: {
    backgroundColor: defaultColors.bg18,
  },
});
