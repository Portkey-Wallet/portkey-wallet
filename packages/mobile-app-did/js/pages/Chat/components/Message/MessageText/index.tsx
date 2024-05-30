import React, { memo, useCallback, useMemo } from 'react';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { MessageTextProps, Time } from 'react-native-gifted-chat';
import ParsedText from 'react-native-parsed-text';
import { StyleSheet, Text, TextStyle, View, Image } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import ChatOverlay from '../../../../../components/FloatOverlay';
import { useChatsDispatch, useCurrentChannelId } from 'pages/Chat/context/hooks';
import { useDeleteMessage } from '@portkey-wallet/hooks/hooks-ca/im';
import { ChatMessage } from 'pages/Chat/types';
import { ShowChatPopoverParams } from '../../../../../components/FloatOverlay/Popover';
import isEqual from 'lodash/isEqual';
import { copyText } from 'utils';
import { TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { GestureResponderEvent } from 'react-native';
import CommonToast from 'components/CommonToast';
import { useOnUrlPress } from 'hooks/chat';
import Svg from 'components/Svg';
import { setReplyMessageInfo } from 'pages/Chat/context/chatsContext';
import { websiteRE } from '@portkey-wallet/utils/reg';
import { UN_SUPPORTED_FORMAT } from '@portkey-wallet/constants/constants-ca/chat';
import { useIMPin } from '@portkey-wallet/hooks/hooks-ca/im/pin';
import ActionSheet from 'components/ActionSheet';
import OverlayModal from 'components/OverlayModal';
import { showReportOverlay } from '../../ReportOverlay';

const PIN_UNICODE_SPACE = '\u00A0\u00A0\u00A0\u00A0';
const TIME_UNICODE_SPACE = isIOS
  ? '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'
  : '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';

function ReplyMessageText(props: MessageTextProps<ChatMessage>) {
  const { position, currentMessage } = props;

  const isDeleted = useMemo(() => !currentMessage?.quote?.channelUuid, [currentMessage?.quote?.channelUuid]);

  if (!currentMessage?.quote) return null;
  if (!(typeof currentMessage?.quote.parsedContent === 'string')) return null;

  return (
    <View style={[replyMessageTextStyles.wrap, position === 'right' && replyMessageImageStyles.rightWrap]}>
      <View style={replyMessageTextStyles.blueBlank} />
      {currentMessage?.quote?.fromName && (
        <TextM style={replyMessageTextStyles.name}>{currentMessage?.quote?.fromName}</TextM>
      )}
      <TextM style={[replyMessageTextStyles.content, isDeleted && FontStyles.font7]} numberOfLines={2}>
        {currentMessage?.quote?.messageType === 'NOT_SUPPORTED' ? UN_SUPPORTED_FORMAT : currentMessage?.quote?.content}
      </TextM>
    </View>
  );
}

function ReplyMessageImage(props: MessageTextProps<ChatMessage>) {
  const { position, currentMessage } = props;

  const isDeleted = useMemo(() => !currentMessage?.quote?.channelUuid, [currentMessage?.quote?.channelUuid]);

  if (!currentMessage?.quote) return null;
  if (!currentMessage?.quote.imageInfo) return null;

  return (
    <View style={[replyMessageImageStyles.wrap, position === 'right' && replyMessageImageStyles.rightWrap]}>
      <View style={replyMessageImageStyles.blueBlank} />
      <Image style={replyMessageImageStyles.img} source={{ uri: currentMessage?.quote?.imageInfo?.imgUri }} />
      <View>
        <TextM style={replyMessageImageStyles.name}>{currentMessage?.quote?.fromName}</TextM>
        <TextM style={[replyMessageImageStyles.content, isDeleted && FontStyles.font7]} numberOfLines={1}>
          {currentMessage?.quote?.messageType === 'NOT_SUPPORTED' ? UN_SUPPORTED_FORMAT : 'Photo'}
        </TextM>
      </View>
    </View>
  );
}

function MessageText(
  props: MessageTextProps<ChatMessage> & {
    isHideReply?: boolean;
    isGroupChat?: boolean;
    isAdmin?: boolean;
    isHidePinStyle?: boolean;
  },
) {
  const {
    currentMessage,
    textProps,
    position = 'right',
    customTextStyle,
    textStyle,
    isGroupChat = false,
    isAdmin = false,
    isHidePinStyle = false,
    isHideReply = false,
  } = props;
  const currentChannelId = useCurrentChannelId();
  const dispatch = useChatsDispatch();
  const deleteMessage = useDeleteMessage(currentChannelId || '');
  const { pin, unPin, list: pinList } = useIMPin(currentChannelId || '');

  const { messageType } = currentMessage || {};
  const isNotSupported = useMemo(() => messageType === 'NOT_SUPPORTED', [messageType]);
  const isPinned = useMemo(() => !isHidePinStyle && currentMessage?.pinInfo, [currentMessage?.pinInfo, isHidePinStyle]);

  const onUrlPress = useOnUrlPress();
  const onLongPress = useCallback(
    (event: GestureResponderEvent) => {
      const { pageX, pageY } = event.nativeEvent;

      let list: ShowChatPopoverParams['list'] = [
        {
          title: 'Copy',
          iconName: 'copy3',
          onPress: async () => {
            await copyText(currentMessage?.content || '');
          },
        },
      ];

      if (isGroupChat && !isHideReply) {
        list.push({
          title: 'Reply',
          iconName: 'chat-reply',
          onPress: async () => {
            dispatch(
              setReplyMessageInfo({
                message: currentMessage,
                messageType: 'text',
              }),
            );
          },
        });
      }

      if (isGroupChat && isAdmin) {
        list.push({
          title: currentMessage?.pinInfo ? 'Unpin' : 'Pin',
          iconName: currentMessage?.pinInfo ? 'chat-unpin' : 'chat-pin',
          onPress: async () => {
            if (!currentMessage || !currentMessage.rawMessage) return;

            // unPin in messageList page
            if (currentMessage?.pinInfo && !isHidePinStyle)
              return ActionSheet.alert({
                title: 'Would you like to unpin this message?',
                buttons: [
                  {
                    title: 'Cancel',
                    type: 'outline',
                  },
                  {
                    title: 'Unpin',
                    type: 'primary',
                    onPress: async () => {
                      try {
                        if (!currentMessage.rawMessage) return;
                        await unPin(currentMessage.rawMessage);
                      } catch (error) {
                        CommonToast.failError(error);
                      }
                    },
                  },
                ],
              });

            // unPin & pin
            try {
              if (currentMessage?.pinInfo) {
                // in overlay and just 1 pin message
                if (pinList?.length === 1 && isHidePinStyle) OverlayModal.hide();
                await unPin(currentMessage.rawMessage);
              } else {
                await pin(currentMessage.rawMessage);
              }
            } catch (err) {
              CommonToast.failError(err);
            }
          },
        });
      }

      // delete other's message
      if (isGroupChat && isAdmin && position === 'left') {
        list.push({
          title: 'Delete',
          iconName: 'chat-delete',
          onPress: async () => {
            try {
              if (!currentMessage) return;
              await deleteMessage(currentMessage, true);
            } catch (error) {
              CommonToast.fail('Failed to delete message');
            }
          },
        });
      }

      // delete my message
      if (currentMessage)
        if (position === 'right')
          list.push({
            title: 'Delete',
            iconName: 'chat-delete',
            onPress: async () => {
              try {
                if (!currentMessage) return;
                await deleteMessage(currentMessage);
              } catch (error) {
                CommonToast.fail('Failed to delete message');
              }
            },
          });

      // report
      if (position === 'left')
        list.push({
          title: 'Report',
          iconName: 'chat-report',
          onPress: async () => {
            showReportOverlay({
              messageId: currentMessage?.id || '',
              message: currentMessage?.text || '',
              reportedRelationId: currentMessage?.from || '',
            });
          },
        });

      list = isNotSupported ? [] : list;

      list.length &&
        ChatOverlay.showChatPopover({
          list,
          px: pageX,
          py: pageY,
          formatType: 'dynamicWidth',
        });
    },
    [
      currentMessage,
      deleteMessage,
      dispatch,
      isAdmin,
      isGroupChat,
      isHidePinStyle,
      isHideReply,
      isNotSupported,
      pin,
      pinList?.length,
      position,
      unPin,
    ],
  );

  const onPress = useCallback(() => {
    if (currentMessage?.messageType === 'NOT_SUPPORTED') {
      CommonToast.warn('Downloading the latest Portkey for you. To proceed, please close and restart the App.');
    }
  }, [currentMessage?.messageType]);

  return (
    <Touchable onPress={onPress} onLongPress={onLongPress} style={styles.textRow}>
      <ReplyMessageImage {...props} />
      <ReplyMessageText {...props} />
      <Text style={[messageStyles[position].text, textStyle && textStyle[position], customTextStyle]}>
        {isNotSupported ? (
          <TextM style={FontStyles.font4}>{currentMessage?.text}</TextM>
        ) : (
          <ParsedText
            style={[messageStyles[position].text, textStyle && textStyle[position], customTextStyle]}
            parse={[
              { type: 'url', style: styles.linkStyle as TextStyle, onPress: onUrlPress },
              { pattern: websiteRE, style: styles.linkStyle as TextStyle, onPress: onUrlPress },
            ]}
            childrenProps={{ ...textProps }}>
            {currentMessage?.text}
          </ParsedText>
        )}
        {isPinned && PIN_UNICODE_SPACE}
        {TIME_UNICODE_SPACE}
      </Text>
      <View style={styles.timeBoxStyle}>
        {isPinned && <Svg icon="pin-message" size={pTd(12)} iconStyle={styles.iconStyle} color={defaultColors.font7} />}
        <Time timeFormat="HH:mm" timeTextStyle={timeTextStyle} containerStyle={timeInnerWrapStyle} {...props} />
      </View>
    </Touchable>
  );
}

function Message(
  props: MessageTextProps<ChatMessage> & {
    isGroupChat?: boolean;
    isAdmin?: boolean;
    isHidePinStyle?: boolean;
    isHideReply?: boolean;
  },
) {
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
    lineHeight: pTd(22),
    marginVertical: pTd(5),
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

const replyMessageTextStyles = StyleSheet.create({
  wrap: {
    position: 'relative',
    backgroundColor: defaultColors.bg26,
    borderRadius: pTd(8),
    paddingVertical: pTd(4),
    paddingLeft: pTd(11),
    paddingRight: pTd(8),
    margin: pTd(8),
    marginBottom: 0,
    overflow: 'hidden',
  },
  rightWrap: {
    backgroundColor: defaultColors.bg25,
  },
  blueBlank: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: pTd(3),
    height: pTd(300),
    backgroundColor: defaultColors.primaryColor,
  },
  img: {
    width: pTd(32),
    height: pTd(32),
    borderRadius: pTd(3),
  },
  name: {
    color: defaultColors.font5,
  },
  content: {
    color: defaultColors.font3,
  },
});

const replyMessageImageStyles = StyleSheet.create({
  wrap: {
    position: 'relative',
    backgroundColor: defaultColors.bg26,
    borderRadius: pTd(8),
    paddingVertical: pTd(4),
    paddingLeft: pTd(11),
    paddingRight: pTd(8),
    margin: pTd(8),
    marginBottom: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightWrap: {
    backgroundColor: defaultColors.bg40,
  },
  blueBlank: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: pTd(3),
    height: pTd(300),
    backgroundColor: defaultColors.primaryColor,
  },
  img: {
    width: pTd(32),
    height: pTd(32),
    marginRight: pTd(8),
    borderRadius: pTd(3),
  },
  name: {
    color: defaultColors.font5,
  },
  content: {
    color: defaultColors.font3,
  },
});
