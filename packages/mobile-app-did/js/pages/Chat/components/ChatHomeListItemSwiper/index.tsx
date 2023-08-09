import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo, useCallback, useRef, useState } from 'react';
import { StyleSheet, View, Image, GestureResponderEvent } from 'react-native';
import SwipeableItem, { OpenDirection, SwipeableItemImperativeRef } from 'react-native-swipeable-item';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { formatChatListTime } from '@portkey-wallet/utils/chat';

type ChatHomeListItemSwipedType<T> = {
  item: any;
  onPress: (item: T) => void;
  onLongPress: (event: GestureResponderEvent, item: T) => void;
  onDelete: (item: T) => void;
};

const DELETE_BUTTON_WIDTH = pTd(80);
const DELETE_TO_END = screenWidth;

export default memo(function ChatHomeListItemSwiped(props: ChatHomeListItemSwipedType<any>) {
  const { item = {}, onPress, onLongPress, onDelete } = props;
  const [isEdit, setIsEdit] = useState(false);
  const swipeableRef = useRef<SwipeableItemImperativeRef>(null);

  const deleteItem = useCallback(() => {
    swipeableRef.current?.close();
    onDelete(item);
  }, [item, onDelete]);

  const renderUnderlayLeft = useCallback(
    () => (
      <Touchable style={styles.underlayLeftBox} onPress={deleteItem}>
        <TextM style={[FontStyles.font2]}>Delete</TextM>
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
      key={item.id}
      item={props}
      ref={swipeableRef}
      onChange={onDrag}
      snapPointsLeft={[DELETE_BUTTON_WIDTH, DELETE_TO_END]}
      renderUnderlayLeft={renderUnderlayLeft}>
      <Touchable onPress={onPressItem} onLongPress={onLongPressItem}>
        <View style={[GStyles.flexRow, GStyles.itemCenter, styles.itemRow, BGStyles.bg10, styles.marginContainer]}>
          <Image
            source={{ uri: 'https://lmg.jj20.com/up/allimg/1111/05161Q64001/1P516164001-3-1200.jpg' }}
            style={{ width: 40, height: 40 }}
          />
          <View style={GStyles.flex1}>
            <TextM>Potter</TextM>
            <TextM>hello Portkey</TextM>
          </View>
          <View>
            <View style={GStyles.flexRow}>
              <Svg icon="desk-mac" />
              <TextM>{formatChatListTime(1691408817907)}</TextM>
            </View>
            <TextM style={BGStyles.bg10}>99+</TextM>
          </View>
        </View>
      </Touchable>
    </SwipeableItem>
  );
});

const styles = StyleSheet.create({
  marginContainer: {},
  underlayLeftBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pTd(16),
    justifyContent: 'flex-end',
    backgroundColor: defaultColors.bg17,
    color: defaultColors.font1,
    textAlign: 'center',
  },
  itemRow: {
    padding: pTd(12),
    height: pTd(72),
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
});
