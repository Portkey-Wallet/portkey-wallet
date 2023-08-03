/* eslint-disable react/jsx-props-no-spreading */
import { TextM } from 'components/CommonText';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Bubble, SystemMessage, Message, MessageText } from 'react-native-gifted-chat';
import { pTd } from 'utils/unit';

export const renderAvatar = props => (
  <Avatar
    {...props}
    containerStyle={{ left: { borderWidth: 3, borderColor: 'red' }, right: {} }}
    imageStyle={{ left: { borderWidth: 3, borderColor: 'blue' }, right: {} }}
  />
);

export const RenderBubble = props => {
  const [showAction, setShowAction] = useState(false);

  return (
    <View style={styles.bubbleWrap}>
      <Bubble
        {...props}
        // renderTime={() => <Text>Time</Text>}
        // renderTicks={() => <Text>Ticks</Text>}
        containerStyle={{
          left: { borderColor: 'teal', borderWidth: 8 },
          right: {},
        }}
        wrapperStyle={{
          left: { borderColor: 'tomato', borderWidth: 4 },
          right: {},
        }}
        bottomContainerStyle={{
          left: { borderColor: 'purple', borderWidth: 4 },
          right: {},
        }}
        tickStyle={{}}
        usernameStyle={{ color: 'tomato', fontWeight: '100' }}
        containerToNextStyle={{
          left: { borderColor: 'navy', borderWidth: 4 },
          right: {},
        }}
        containerToPreviousStyle={{
          left: { borderColor: 'mediumorchid', borderWidth: 4 },
          right: {},
        }}
        onLongPress={() => setShowAction(true)}
      />
      {showAction && (
        <View style={styles.bubbleToolWrap}>
          <TouchableOpacity>
            <TextM style={styles.bubbleToolItem}>Copy!</TextM>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export const renderSystemMessage = props => (
  <SystemMessage
    {...props}
    containerStyle={{ backgroundColor: 'pink' }}
    wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
    textStyle={{ color: 'crimson', fontWeight: '900' }}
  />
);

export const renderMessage = props => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={{
      left: { backgroundColor: 'lime' },
      right: { backgroundColor: 'gold' },
    }}
  />
);

export const renderMessageText = props => (
  <MessageText
    {...props}
    containerStyle={{
      left: { backgroundColor: 'yellow' },
      right: { backgroundColor: 'purple' },
    }}
    textStyle={{
      left: { color: 'red' },
      right: { color: 'green' },
    }}
    linkStyle={{
      left: { color: 'black' },
      right: { color: 'black' },
    }}
    customTextStyle={{ fontSize: 24, lineHeight: 24 }}
  />
);

export const renderCustomView = ({ user }) => (
  <View style={{ minHeight: 20, alignItems: 'center' }}>
    <Text>
      Current user:
      {user.name}
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
    backgroundColor: 'green',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
