import React, { useMemo } from 'react';
import { SystemMessageProps } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { TextS } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import { ChatMessage } from 'pages/Chat/types';
import GStyles from 'assets/theme/GStyles';
import { ParsedPinSys } from '@portkey-wallet/im';
import { formatPinSysMessageToStr } from '@portkey-wallet/utils/chat';
import { isSystemTypeMessage } from 'pages/Chat/utils';

function SystemInfo(props: SystemMessageProps<ChatMessage> & { previousMessage?: ChatMessage }) {
  const { previousMessage, currentMessage } = props;

  const isMarginTop4 = useMemo(() => {
    if (isSystemTypeMessage(previousMessage?.messageType) === isSystemTypeMessage(currentMessage?.messageType))
      return true;

    return false;
  }, [currentMessage, previousMessage]);

  const pinInfo = useMemo<ParsedPinSys>(
    () => currentMessage?.parsedContent as ParsedPinSys,
    [currentMessage?.parsedContent],
  );

  const pinMessageContent = useMemo(() => formatPinSysMessageToStr(pinInfo), [pinInfo]);

  if (currentMessage?.messageType === 'PIN-SYS')
    return <TextS style={[styles.textStyles, isMarginTop4 && GStyles.marginTop(pTd(4))]}>{pinMessageContent}</TextS>;

  return (
    <TextS style={[styles.textStyles, isMarginTop4 && GStyles.marginTop(pTd(4))]}>{currentMessage?.content}</TextS>
  );
}

export default SystemInfo;

const styles = StyleSheet.create({
  textStyles: {
    textAlign: 'center',
    color: defaultColors.font7,
    marginTop: pTd(12),
    marginBottom: 0,
    paddingHorizontal: pTd(12),
    lineHeight: pTd(16),
    overflow: 'hidden',
  },
});
