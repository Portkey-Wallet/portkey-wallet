import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BubbleProps, GiftedChatProps, IMessage } from 'react-native-gifted-chat';
import { Avatar, Bubble, SystemMessage, Message, MessageText } from 'react-native-gifted-chat';
import ChatOverlay from '../ChatOverlay';
import Touchable from 'components/Touchable';
export const renderAvatar: GiftedChatProps['renderAvatar'] = props => (
  <Avatar
    {...props}
    containerStyle={{ left: { borderWidth: 3, borderColor: 'red' }, right: {} }}
    imageStyle={{ left: { borderWidth: 3, borderColor: 'blue' }, right: {} }}
  />
);

export const renderBubble = (props: BubbleProps<IMessage>) => {
  return (
    <Touchable
      onLongPress={event => {
        const { pageX, pageY } = event.nativeEvent;
        ChatOverlay.showChatPopover(
          [{ title: '1111111' }, { title: '22222222' }],
          pageX,
          pageY,
          props.position || 'left',
        );
      }}>
      <Bubble touchableProps={{ disabled: true }} {...props} />
    </Touchable>
  );
};

export const renderSystemMessage: GiftedChatProps['renderSystemMessage'] = props => <SystemMessage {...props} />;

export const renderMessage: GiftedChatProps['renderMessage'] = props => <Message {...props} />;

export const renderMessageText: GiftedChatProps['renderMessageText'] = props => {
  return <MessageText {...props} />;
};

export const renderCustomView: GiftedChatProps['renderCustomView'] = ({ user }) => (
  <View style={{ minHeight: 20, alignItems: 'center' }}>
    <Text>
      Current user:
      {user?.name}
    </Text>
    <Text>From CustomView</Text>
  </View>
);

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
