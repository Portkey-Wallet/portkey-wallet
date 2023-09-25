import React from 'react';
import { DayProps, IMessage } from 'react-native-gifted-chat';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { TextS } from 'components/CommonText';
import { formatMessageTime } from '@portkey-wallet/utils/chat';
import { isSameDay } from '@portkey-wallet/utils/time';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';

function SystemTime(_props: DayProps<IMessage>) {
  const sameDay = isSameDay(_props.previousMessage?.createdAt, _props.currentMessage?.createdAt);
  if (sameDay && !!_props?.previousMessage?.createdAt) return null;
  return (
    <View style={[GStyles.center, styles.wrap]}>
      <TextS style={styles.textStyles}>{formatMessageTime(_props.currentMessage?.createdAt)}</TextS>
    </View>
  );
}

export default SystemTime;

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginBottom: 0,
    marginTop: pTd(16),
  },
  textStyles: {
    textAlign: 'center',
    color: defaultColors.font3,
    backgroundColor: defaultColors.bg6,
    paddingHorizontal: pTd(8),
    paddingVertical: pTd(2),
    borderRadius: pTd(10),
    overflow: 'hidden',
  },
});
