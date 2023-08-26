import React, { memo, useCallback, useMemo } from 'react';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { MessageTextProps, Time } from 'react-native-gifted-chat';
import ParsedText from 'react-native-parsed-text';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import ChatOverlay from '../../ChatOverlay';
import { useCurrentChannelId } from 'pages/Chat/context/hooks';
import { useDeleteMessage } from '@portkey-wallet/hooks/hooks-ca/im';
import { ChatMessage } from 'pages/Chat/types';
import { ShowChatPopoverParams } from '../../ChatOverlay/chatPopover';
import isEqual from 'lodash/isEqual';
import { copyText } from 'utils';
import { TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { GestureResponderEvent } from 'react-native';
import CommonToast from 'components/CommonToast';

const UNICODE_SPACE = isIOS
  ? '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'
  : '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';
const WWW_URL_PATTERN = /^www\./i;

function MessageText(props: MessageTextProps<ChatMessage>) {
  const { currentMessage, textProps, position = 'right', customTextStyle, textStyle } = props;
  const jump = useDiscoverJumpWithNetWork();
  const currentChannelId = useCurrentChannelId();
  const deleteMessage = useDeleteMessage(currentChannelId || '');
  const { messageType } = currentMessage || {};
  const isNotSupported = useMemo(() => messageType === 'NOT_SUPPORTED', [messageType]);
  const onUrlPress = useThrottleCallback(
    (url: string) => {
      if (WWW_URL_PATTERN.test(url)) {
        onUrlPress(`https://${url}`);
      } else {
        jump({ item: { url: url, name: url } });
      }
    },
    [jump],
  );
  const onLongPress = useCallback(
    (event: GestureResponderEvent) => {
      const { pageX, pageY } = event.nativeEvent;
      const list: ShowChatPopoverParams['list'] = isNotSupported
        ? []
        : [
            {
              title: 'Copy',
              iconName: 'copy',
              onPress: async () => {
                await copyText(currentMessage?.content || '');
              },
            },
          ];
      if (position === 'right')
        list.push({
          title: 'Delete',
          iconName: 'chat-delete',
          onPress: async () => {
            try {
              await deleteMessage(currentMessage?.id);
            } catch (error) {
              CommonToast.fail('Failed to delete message');
            }
          },
        });
      ChatOverlay.showChatPopover({
        list,
        px: pageX,
        py: pageY,
        formatType: 'dynamicWidth',
      });
    },
    [currentMessage?.content, currentMessage?.id, deleteMessage, isNotSupported, position],
  );
  return (
    <Touchable onLongPress={onLongPress}>
      <Text style={[messageStyles[position].text, textStyle && textStyle[position], customTextStyle]}>
        {isNotSupported ? (
          <TextM style={FontStyles.font7}>{currentMessage?.text}</TextM>
        ) : (
          <ParsedText
            style={[messageStyles[position].text, textStyle && textStyle[position], customTextStyle]}
            parse={[{ type: 'url', style: styles.linkStyle as TextStyle, onPress: onUrlPress }]}
            childrenProps={{ ...textProps }}>
            {currentMessage?.text}
          </ParsedText>
        )}

        {UNICODE_SPACE}
      </Text>
      <Time timeFormat="HH:mm" timeTextStyle={timeTextStyle} containerStyle={timeContainerStyle} {...props} />
    </Touchable>
  );
}

function Message(props: MessageTextProps<ChatMessage>) {
  // const { messageType, text } = props?.currentMessage || {};
  return <MessageText {...props} />;
}

export default memo(Message, (prevProps, nextProps) => {
  return isEqual(prevProps.currentMessage, nextProps.currentMessage);
});

const styles = StyleSheet.create({
  textStyles: {
    fontSize: pTd(16),
    lineHeight: pTd(24),
    marginVertical: pTd(8),
    marginHorizontal: pTd(12),
  },
  linkStyle: {
    color: defaultColors.font4,
  },
  timeBoxStyle: {
    position: 'absolute',
    right: pTd(8),
    bottom: pTd(0),
  },
  timeTextStyle: {
    color: defaultColors.font7,
  },
});

const timeContainerStyle = {
  left: styles.timeBoxStyle,
  right: styles.timeBoxStyle,
};

const timeTextStyle = {
  left: styles.timeTextStyle,
  right: styles.timeTextStyle,
};

const messageStyles = {
  left: StyleSheet.create({
    container: {},
    text: {
      color: defaultColors.font5,
      ...styles.textStyles,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {},
    text: {
      color: defaultColors.font5,
      ...styles.textStyles,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
};
