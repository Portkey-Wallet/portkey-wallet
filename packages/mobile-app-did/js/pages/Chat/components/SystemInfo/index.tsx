import React from 'react';
import { SystemMessageProps } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { TextS } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import { ChatMessage } from 'pages/Chat/types';

function SystemInfo(props: SystemMessageProps<ChatMessage>) {
  const { currentMessage } = props;

  return (
    <TextS numberOfLines={1} style={styles.textStyles}>
      {currentMessage?.text}
    </TextS>
  );
}

export default SystemInfo;

const styles = StyleSheet.create({
  textStyles: {
    textAlign: 'center',
    color: defaultColors.font7,
    marginVertical: pTd(4),
    lineHeight: pTd(16),
    overflow: 'hidden',
  },
});
