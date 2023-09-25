import React, { useMemo } from 'react';
import { SystemMessageProps } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { TextS } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import { ChatMessage } from 'pages/Chat/types';
import GStyles from 'assets/theme/GStyles';

function SystemInfo(props: SystemMessageProps<ChatMessage> & { previousMessage: any }) {
  const { previousMessage, currentMessage } = props;

  const isMarginTop8 = useMemo(() => {
    if (previousMessage?.messageType === 'SYS') return true;
  }, [previousMessage?.messageType]);

  console.log('previousMessage', previousMessage, currentMessage);

  return (
    <TextS style={[styles.textStyles, isMarginTop8 && GStyles.marginTop(pTd(8))]}>{currentMessage?.content}</TextS>
  );
}

export default SystemInfo;

const styles = StyleSheet.create({
  textStyles: {
    textAlign: 'center',
    color: defaultColors.font7,
    marginTop: pTd(16),
    marginBottom: 0,
    paddingHorizontal: pTd(20),
    lineHeight: pTd(16),
    overflow: 'hidden',
  },
});
