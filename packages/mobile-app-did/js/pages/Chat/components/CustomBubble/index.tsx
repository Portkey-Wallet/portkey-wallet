import React from 'react';
import { StyleSheet } from 'react-native';
import { BubbleProps, IMessage } from 'react-native-gifted-chat';
import { Bubble } from 'react-native-gifted-chat';
import Touchable from 'components/Touchable';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';

export default function CustomBubble(props: BubbleProps<IMessage>) {
  return (
    <Touchable>
      <Bubble
        touchableProps={{ disabled: true }}
        wrapperStyle={{ left: [styles.wrapperStyle, styles.wrapLeft], right: [styles.wrapperStyle, styles.wrapRight] }}
        {...props}
      />
    </Touchable>
  );
}

const styles = StyleSheet.create({
  wrapperStyle: {
    borderRadius: pTd(20),
    color: defaultColors.font5,
    padding: pTd(4),
  },
  wrapLeft: {
    backgroundColor: defaultColors.bg18,
    borderTopLeftRadius: pTd(2),
    marginLeft: -pTd(8),
  },
  wrapRight: {
    backgroundColor: defaultColors.bg9,
    borderTopRightRadius: pTd(2),
  },
});
