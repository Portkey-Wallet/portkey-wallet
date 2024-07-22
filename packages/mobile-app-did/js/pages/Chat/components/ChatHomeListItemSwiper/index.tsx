import GStyles from 'assets/theme/GStyles';
import { TextL, TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, GestureResponderEvent } from 'react-native';
import SwipeableItem, { OpenDirection, SwipeableItemImperativeRef } from 'react-native-swipeable-item';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { isIOS, screenWidth } from '@portkey-wallet/utils/mobile/device';
import { formatChatListTime, formatMessageCountToStr, formatPinSysMessageToStr } from '@portkey-wallet/utils/chat';
import { ChannelItem, ChannelTypeEnum, ParsedPinSys, ParsedRedPackage, ParsedTransfer } from '@portkey-wallet/im/types';
import CommonAvatar from 'components/CommonAvatar';
import { useDeviceEvent } from 'hooks/useDeviceEvent';
import myEvents from 'utils/deviceEvent';
import { getChatListSvgName } from 'pages/Chat/utils';
import { UN_SUPPORTED_FORMAT } from '@portkey-wallet/constants/constants-ca/chat';
import GroupAvatarShow from 'pages/Chat/components/GroupAvatarShow';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import AIChatMark from '../AIChatMark';
import { ContactType } from '@portkey-wallet/types/types-ca/contact';
import { KEY_GENIE_GREETINGS } from '@portkey-wallet/constants/constants-ca/guide';

type ChatHomeListItemSwipedType<T> = {
  item: T;
  onPress: (item: T) => void;
  onLongPress: (event: GestureResponderEvent, item: T) => void;
  onDelete: (item: T) => void;
};

const DELETE_BUTTON_WIDTH = pTd(64);
const DELETE_TO_END = screenWidth;

export default memo(function ChatHomeListItemSwiped(props: ChatHomeListItemSwipedType<ChannelItem>) {
  const { item, onPress, onLongPress, onDelete } = props;
  const userInfo = useCurrentUserInfo();
  const [isEdit, setIsEdit] = useState(false);
  const swipeableRef = useRef<SwipeableItemImperativeRef>(null);
  const listenerCallBack = useCallback(
    (id: string) => {
      if (id !== item.channelUuid) swipeableRef.current?.close();
    },
    [item.channelUuid],
  );

  const eventEmit = useDeviceEvent(myEvents.chatHomeListCloseSwiped.name, listenerCallBack);
  const renderLastMessage = useMemo(() => {
    // red packet
    if (item.lastMessageType === 'REDPACKAGE-CARD') {
      const redPacketIsHighLight: boolean =
        item.unreadMessageCount > 0 &&
        !item.mute &&
        (item.lastMessageContent as ParsedRedPackage)?.data?.senderId !== userInfo?.userId;

      return (
        <View style={[GStyles.flexRow, styles.message]}>
          <TextS numberOfLines={1} style={[FontStyles.font7, redPacketIsHighLight && FontStyles.font6]}>
            {`[Crypto Box] `}
          </TextS>
          <TextS numberOfLines={1} style={[FontStyles.font7, styles.redPacketLastMessageContent]}>
            {(item.lastMessageContent as ParsedRedPackage)?.data?.memo}
          </TextS>
        </View>
      );
    }
    if (item.lastMessageType === 'TRANSFER-CARD') {
      const isHighLight: boolean =
        item.unreadMessageCount > 0 &&
        !item.mute &&
        (item.lastMessageContent as ParsedTransfer)?.data?.toUserId === userInfo?.userId;

      const transferInfo = item?.lastMessageContent as ParsedTransfer;

      const infoShow = transferInfo?.transferExtraData?.tokenInfo
        ? `${formatTokenAmountShowWithDecimals(
            transferInfo?.transferExtraData?.tokenInfo?.amount,
            transferInfo?.transferExtraData?.tokenInfo?.decimal,
          )} ${transferInfo?.transferExtraData?.tokenInfo?.symbol}`
        : `${transferInfo?.transferExtraData?.nftInfo?.alias} #${transferInfo?.transferExtraData?.nftInfo?.nftId}`;

      return (
        <TextS numberOfLines={1} style={[GStyles.flexRow, styles.message]}>
          <TextS style={[FontStyles.font7, isHighLight && FontStyles.font6]}>{`[Transfer] `}</TextS>
          <TextS style={FontStyles.font7}>{infoShow}</TextS>
        </TextS>
      );
    }

    // general message
    let message = '';
    if (item.lastMessageType === 'TEXT' || item.lastMessageType === 'SYS') {
      message = item.lastMessageContent as string;
    } else if (item.lastMessageType === 'PIN-SYS') {
      message = formatPinSysMessageToStr(item.lastMessageContent as ParsedPinSys);
    } else if (item.lastMessageType === 'IMAGE') {
      message = '[Image]';
    } else {
      message = UN_SUPPORTED_FORMAT;
    }
    // if this is bot init channel,show greeting message
    if (item.botChannel && item.isInit) {
      message = KEY_GENIE_GREETINGS;
    }
    return (
      <TextS numberOfLines={1} style={[FontStyles.font7, styles.message]}>
        {message}
      </TextS>
    );
  }, [item, userInfo?.userId]);

  const deleteItem = useCallback(() => {
    swipeableRef.current?.close();
    onDelete(item);
  }, [item, onDelete]);

  const renderUnderlayLeft = useCallback(
    () => (
      <Touchable style={styles.underlayLeftBox} onPress={deleteItem}>
        <TextM style={[styles.deleteButton, FontStyles.font2]}>Delete</TextM>
      </Touchable>
    ),
    [deleteItem],
  );

  const onPressItem = useCallback(() => {
    if (isEdit) return;
    onPress(item);
  }, [isEdit, item, onPress]);

  const onLongPressItem = useCallback(
    (e: GestureResponderEvent) => {
      if (isEdit) return;
      onLongPress(e, item);
    },
    [isEdit, item, onLongPress],
  );

  const onDrag = useCallback(
    (params: { openDirection: OpenDirection; snapPoint: number }) => {
      setIsEdit(params.snapPoint !== 0);
      if (params.snapPoint === DELETE_TO_END) {
        swipeableRef.current?.close();
        onDelete(item);
      }
    },
    [item, onDelete],
  );

  const RightBottomSection = useMemo(() => {
    if (ChannelTypeEnum.GROUP !== item.channelType && ChannelTypeEnum.P2P !== item.channelType) return null;
    if (item.pin && item.unreadMessageCount === 0)
      return <Svg size={pTd(12)} icon="chat-pin" color={defaultColors.font7} />;

    return (
      <TextS style={[styles.messageNum, item.mute && styles.muteMessage, !item.unreadMessageCount && styles.hide]}>
        {formatMessageCountToStr(item.unreadMessageCount)}
      </TextS>
    );
  }, [item.channelType, item.mute, item.pin, item.unreadMessageCount]);

  const Avatar = useMemo(() => {
    if (item.channelType === ChannelTypeEnum.P2P) {
      return (
        <CommonAvatar
          hasBorder
          avatarSize={pTd(48)}
          resizeMode="cover"
          style={styles.avatar}
          imageUrl={item.channelIcon || ''}
          title={item.displayName}
          svgName={getChatListSvgName(item.channelType)}
        />
      );
    }

    return (
      <GroupAvatarShow
        logoSize={pTd(14)}
        avatarSize={pTd(48)}
        wrapStyle={styles.avatar}
        imageUrl={item.channelIcon || ''}
        svgName={item.channelIcon ? undefined : 'chat-group-avatar'}
      />
    );
  }, [item.channelIcon, item.channelType, item.displayName]);

  return (
    <SwipeableItem
      swipeEnabled
      key={item.channelUuid}
      item={props}
      ref={swipeableRef}
      onChange={onDrag}
      snapPointsLeft={[DELETE_BUTTON_WIDTH, DELETE_TO_END]}
      renderUnderlayLeft={renderUnderlayLeft}>
      <Touchable
        highlight
        underlayColor={item.pin ? defaultColors.bg18 : defaultColors.bg4}
        style={[BGStyles.bg1, item.pin && BGStyles.bg4, GStyles.flexRow, GStyles.itemCenter, styles.container]}
        onPress={onPressItem}
        onLongPress={onLongPressItem}
        onPressIn={eventEmit}>
        <>
          {Avatar}
          <View style={[styles.rightDom, GStyles.flex1, GStyles.flexCenter]}>
            <View style={[GStyles.flexRow, GStyles.spaceBetween, GStyles.itemCenter]}>
              <View style={[GStyles.flex1, GStyles.flexRow, GStyles.itemCenter, GStyles.paddingRight(30)]}>
                <TextL style={[FontStyles.font5, GStyles.marginRight(4)]} numberOfLines={1}>
                  {item.displayName}
                </TextL>
                {!!item.botChannel && <AIChatMark containerStyle={styles.aiMarkContainer} />}
                {item.mute && <Svg size={pTd(12)} icon="chat-mute" color={defaultColors.font7} />}
              </View>
              <TextS style={FontStyles.font7}>{formatChatListTime(item.lastPostAt)}</TextS>
            </View>
            <View style={styles.blank} />
            <View style={[GStyles.flexRow, GStyles.itemCenter, GStyles.spaceBetween]}>
              {renderLastMessage}
              {RightBottomSection}
            </View>
          </View>
        </>
      </Touchable>
    </SwipeableItem>
  );
});

const styles = StyleSheet.create({
  container: {
    height: pTd(72),
  },
  underlayLeftBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: defaultColors.bg17,
    color: defaultColors.font1,
  },
  deleteButton: {
    width: DELETE_BUTTON_WIDTH,
    textAlign: 'center',
  },
  avatar: {
    ...GStyles.marginArg(12, 16, 12, 20),
  },
  rightDom: {
    flex: 1,
    paddingRight: pTd(20),
    height: pTd(72) - StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: StyleSheet.hairlineWidth,
  },
  deleteIconWrap: {
    marginRight: pTd(16),
  },
  websiteIconStyle: {
    marginRight: pTd(16),
  },
  infoWrap: {
    flex: 1,
  },
  blank: {
    width: '100%',
    height: pTd(2),
  },
  message: {
    maxWidth: pTd(240),
  },
  redPacketLastMessageContent: {
    width: pTd(150),
  },
  messageNum: {
    backgroundColor: defaultColors.bg17,
    marginRight: pTd(0),
    paddingHorizontal: pTd(4),
    textAlign: 'center',
    color: defaultColors.font2,
    zIndex: 1000,
    height: pTd(17),
    minWidth: pTd(17),
    borderColor: defaultColors.bg17,
    borderWidth: pTd(1),
    borderRadius: pTd(9),
    overflow: 'hidden',
    lineHeight: pTd(isIOS ? 15 : 17),
  },
  hide: {
    borderWidth: 0,
    width: 0,
    height: 0,
  },
  muteMessage: {
    borderColor: defaultColors.bg7,
    backgroundColor: defaultColors.bg7,
  },
  aiMarkContainer: {
    marginLeft: 0,
    marginRight: pTd(4),
  },
});
