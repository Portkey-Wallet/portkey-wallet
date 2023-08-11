import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BubbleProps, IMessage } from 'react-native-gifted-chat';
import { Bubble } from 'react-native-gifted-chat';
import ChatOverlay from '../ChatOverlay';
import Touchable from 'components/Touchable';

export default function CustomBubble(props: BubbleProps<IMessage>) {
  // return (
  //   <View>
  //     <TextM>BookMark</TextM>
  //   </View>
  // );

  return (
    <Touchable
      onLongPress={event => {
        const { pageX, pageY } = event.nativeEvent;
        ChatOverlay.showChatPopover({
          list: [{ title: '1111111' }, { title: '22222222' }],
          px: pageX,
          py: pageY,
          position: props.position || 'left',
        });
      }}>
      <Bubble touchableProps={{ disabled: true }} {...props} />
    </Touchable>
  );
}

const styles = StyleSheet.create({
  bubbleWrap: {},
  bubbleToolWrap: {
    zIndex: 1000,
    position: 'absolute',
    bottom: -30,
    left: 100,
  },
  bubbleToolItem: {
    width: 60,
    height: 60,
    // backgroundColor: 'green',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
