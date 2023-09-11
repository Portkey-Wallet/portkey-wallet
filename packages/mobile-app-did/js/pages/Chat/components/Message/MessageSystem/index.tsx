import React, { memo } from 'react';
import { MessageTextProps } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native';
import { ChatMessage } from 'pages/Chat/types';
import isEqual from 'lodash/isEqual';
import { TextM } from 'components/CommonText';

function MessageSystem(props: MessageTextProps<ChatMessage>) {
  return <TextM style={styles.system}>hello</TextM>;
}

export default memo(MessageSystem, (prevProps, nextProps) => {
  return isEqual(prevProps.currentMessage, nextProps.currentMessage);
});

const styles = StyleSheet.create({
  system: {
    textAlign: 'center',
    backgroundColor: 'red',
  },
});
