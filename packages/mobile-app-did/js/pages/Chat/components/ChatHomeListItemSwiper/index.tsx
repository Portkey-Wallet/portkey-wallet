import GStyles from 'assets/theme/GStyles';
import { TextL, TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo, useCallback, useRef, useState } from 'react';
import { StyleSheet, View, Image, GestureResponderEvent } from 'react-native';
import SwipeableItem, { OpenDirection, SwipeableItemImperativeRef } from 'react-native-swipeable-item';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { formatChatListTime, formatMessageCountToStr } from '@portkey-wallet/utils/chat';
import { ChannelItem } from '@portkey-wallet/im/types';
import CommonAvatar from 'components/CommonAvatar';

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
  const [isEdit, setIsEdit] = useState(false);
  const swipeableRef = useRef<SwipeableItemImperativeRef>(null);

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
        style={[BGStyles.bg4, item.mute && BGStyles.bg6, GStyles.flexRow, GStyles.itemCenter, styles.container]}
        onPress={onPressItem}
        onLongPress={onLongPressItem}>
        <CommonAvatar hasBorder title={item.displayName} avatarSize={48} style={styles.avatar} />
        <View style={[styles.rightDom, GStyles.flex1, GStyles.flexCenter]}>
          <View style={[GStyles.flexRow, GStyles.spaceBetween, GStyles.itemCenter]}>
            <View style={[GStyles.flex1, GStyles.flexRow, GStyles.itemCenter, GStyles.paddingRight(30)]}>
              <TextL style={FontStyles.font5} numberOfLines={1}>
                {item.displayName + 'xasdsdasdsdasdsadsadasdasdsadasdas'}
              </TextL>
              <Svg icon="more" color={defaultColors.font7} />
            </View>
            <TextS style={FontStyles.font7}>{formatChatListTime(item.lastPostAt || '19933300020')}</TextS>
          </View>
          <View style={[GStyles.flexRow, GStyles.spaceBetween, GStyles.itemCenter]}>
            <TextS style={FontStyles.font7}>{item.lastMessageContent || ' haha'}</TextS>
            {/* <Svg icon="desk-mac" /> */}
            <TextS style={[styles.messageNum, !item.unreadMessageCount && styles.hide]}>
              {formatMessageCountToStr(item.unreadMessageCount)}
            </TextS>
          </View>
        </View>
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
    borderBottomColor: defaultColors.border1,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  messageNum: {
    borderRadius: pTd(8),
    backgroundColor: 'red',
    minWidth: pTd(16),
    paddingHorizontal: pTd(4),
    textAlign: 'center',
    overflow: 'hidden',
    color: defaultColors.font2,
  },
  hide: {
    display: 'none',
  },
});
