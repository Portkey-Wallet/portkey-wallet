import React, { memo, useCallback, useMemo } from 'react';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { MessageTextProps, Time } from 'react-native-gifted-chat';
import ParsedText from 'react-native-parsed-text';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
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
import { useOnUrlPress } from 'hooks/chat';
import Svg from 'components/Svg';

const PIN_UNICODE_SPACE = '\u00A0\u00A0\u00A0\u00A0';
const TIME_UNICODE_SPACE = isIOS
  ? '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'
  : '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';

function MessageText(props: MessageTextProps<ChatMessage>) {
  const { currentMessage, textProps, position = 'right', customTextStyle, textStyle } = props;
  const currentChannelId = useCurrentChannelId();
  const deleteMessage = useDeleteMessage(currentChannelId || '');
  const { messageType } = currentMessage || {};
  const isNotSupported = useMemo(() => messageType === 'NOT_SUPPORTED', [messageType]);
  const onUrlPress = useOnUrlPress();
  const onLongPress = useCallback(
    (event: GestureResponderEvent) => {
      const { pageX, pageY } = event.nativeEvent;

      const list: ShowChatPopoverParams['list'] = isNotSupported
        ? []
        : [
            {
              title: 'Copy',
              iconName: 'copy3',
              onPress: async () => {
                await copyText(currentMessage?.content || '');
              },
            },
            {
              // TODO: if not pinned message, show pin
              title: 'Pin',
              iconName: 'chat-pin',
              onPress: async () => {
                try {
                  // todo: pin message
                  await copyText(currentMessage?.content || '');
                } catch (error) {
                  // TODO: change to failError
                  CommonToast.failError(error);
                }
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
      list.length &&
        ChatOverlay.showChatPopover({
          list,
          px: pageX,
          py: pageY,
          formatType: 'dynamicWidth',
        });
    },
    [currentMessage?.content, currentMessage?.id, deleteMessage, isNotSupported, position],
  );

  const onPress = useCallback(() => {
    if (currentMessage?.messageType === 'NOT_SUPPORTED') {
      CommonToast.warn('Downloading the latest Portkey for you. To proceed, please close and restart the App.');
    }
  }, [currentMessage?.messageType]);

  return (
    <Touchable onPress={onPress} onLongPress={onLongPress} style={styles.textRow}>
      <Text style={[messageStyles[position].text, textStyle && textStyle[position], customTextStyle]}>
        {isNotSupported ? (
          <TextM style={FontStyles.font4}>{currentMessage?.text}</TextM>
        ) : (
          <ParsedText
            style={[messageStyles[position].text, textStyle && textStyle[position], customTextStyle]}
            parse={[{ type: 'url', style: styles.linkStyle as TextStyle, onPress: onUrlPress }]}
            childrenProps={{ ...textProps }}>
            {currentMessage?.text}
          </ParsedText>
        )}
        {/* todo: when pinned show this */}
        {PIN_UNICODE_SPACE}
        {TIME_UNICODE_SPACE}
      </Text>
      <View style={styles.timeBoxStyle}>
        {/* todo: if pinned show this */}
        <Svg icon="pin-message" size={pTd(12)} iconStyle={styles.iconStyle} color={defaultColors.font7} />
        <Time timeFormat="HH:mm" timeTextStyle={timeTextStyle} containerStyle={timeInnerWrapStyle} {...props} />
      </View>
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
  textRow: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textStyles: {
    fontSize: pTd(16),
    lineHeight: pTd(24),
    marginVertical: pTd(8),
    marginHorizontal: pTd(12),
  },
  linkStyle: {
    color: defaultColors.font4,
  },
  iconStyle: {
    marginRight: pTd(4),
  },
  timeBoxStyle: {
    position: 'absolute',
    paddingHorizontal: pTd(8),
    bottom: pTd(4),
    right: pTd(8),
    height: pTd(16),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeInnerWrapStyle: {
    marginRight: 0,
    marginLeft: 0,
    marginBottom: 0,
    marginTop: 0,
  },
  timeTextStyle: {
    color: defaultColors.font7,
  },
});

const timeInnerWrapStyle = {
  left: styles.timeInnerWrapStyle,
  right: styles.timeInnerWrapStyle,
};

const timeTextStyle = {
  left: styles.timeTextStyle,
  right: styles.timeTextStyle,
};

const messageStyles = {
  left: StyleSheet.create({
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
