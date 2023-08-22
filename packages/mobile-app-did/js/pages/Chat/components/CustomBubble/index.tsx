import React from 'react';
import { StyleSheet } from 'react-native';
import { BubbleProps, IMessage } from 'react-native-gifted-chat';
import { Bubble } from 'react-native-gifted-chat';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';

export default function CustomBubble(props: BubbleProps<IMessage>) {
  return (
    <Bubble
      touchableProps={{ disabled: true }}
      wrapperStyle={{
        left: [styles.wrapperStyle, styles.wrapLeft],
        right: [styles.wrapperStyle, styles.wrapRight],
      }}
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
});
