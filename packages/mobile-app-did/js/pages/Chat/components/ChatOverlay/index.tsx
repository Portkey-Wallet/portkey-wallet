import React from 'react';
import { screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import OverlayModal, { CustomBounds } from 'components/OverlayModal';
import Touchable from 'components/Touchable';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const vertical = 20;
const horizontal = 20;
const itemHeight = 40;
const BoxWidth = 100;
const horizontalSpacing = 120;
const verticalSpacing = 300;

export type ListItemType = { onPress?: () => void; title: string };

type ShowChatPopoverParams = {
  list: ListItemType[];
  px?: number;
  py?: number;
  position?: 'left' | 'right';
  customPosition?: { left?: number; right?: number; top?: number; bottom?: number };
  customBounds?: CustomBounds;
  formatType?: 'fixedWidth' | 'dynamicWidth';
};

function formatPositionTop(px: number, py: number, length: number) {
  let top = py + horizontal;
  if (py > verticalSpacing) {
    top = py - length * itemHeight - horizontal;
  }
  return top;
}

function formatPosition(px: number, py: number, length: number, position: 'left' | 'right') {
  let left = px + vertical;
  const top = formatPositionTop(px, py, length);
  if (
    (position === 'right' && px > horizontalSpacing) ||
    (position === 'left' && px > screenWidth - horizontalSpacing)
  ) {
    left = px - BoxWidth - vertical;
  }
  return { top, left };
}

function formatPositionByDynamicWidth(px: number, py: number, length: number) {
  let left = px + vertical;
  const top = formatPositionTop(px, py, length);
  if (px > screenWidth / 2) {
    left = px - screenWidth / 2;
  }
  return { top, left };
}

function ChatPopover({
  list,
  customPosition,
  formatType,
}: {
  formatType: ShowChatPopoverParams['formatType'];
  list: ListItemType[];
  customPosition: ShowChatPopoverParams['customPosition'];
}) {
  return (
    <TouchableOpacity activeOpacity={1} onPress={OverlayModal.hide} style={styles.backgroundBox}>
      <View style={[styles.container, { ...customPosition }]}>
        {list.map((item, index) => {
          return (
            <Touchable
              key={index}
              onPress={() => {
                item.onPress?.();
                OverlayModal.hide();
              }}
              style={formatType === 'fixedWidth' ? styles.itemStyles : styles.dynamicWidthItemStyles}>
              <Text style={styles.textStyles}>{item.title}</Text>
            </Touchable>
          );
        })}
      </View>
    </TouchableOpacity>
  );
}

function showChatPopover({
  list,
  px,
  py,
  position = 'left',
  customPosition,
  customBounds,
  formatType = 'fixedWidth',
}: ShowChatPopoverParams) {
  if (!customPosition) {
    customPosition =
      formatType === 'fixedWidth'
        ? formatPosition(px || 0, py || 0, list.length, position)
        : formatPositionByDynamicWidth(px || 0, py || 0, list.length);
  }
  OverlayModal.show(<ChatPopover list={list} customPosition={customPosition} formatType={formatType} />, {
    customBounds: customBounds || {
      x: px || customPosition.left || 0,
      y: py || customPosition.top || 0,
      width: 0,
      height: 0,
    },
    overlayOpacity: 0,
    containerStyle: {},
    style: { backgroundColor: 'transparent' },
    animated: true,
  });
}
export default {
  showChatPopover,
};

const itemStyle = StyleSheet.create({
  item: {
    height: itemHeight,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
});

const styles = StyleSheet.create({
  dynamicWidthItemStyles: {
    minWidth: 100,
    ...itemStyle.item,
  },
  itemStyles: {
    width: BoxWidth,
    ...itemStyle.item,
  },
  container: {
    paddingTop: 5,
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    zIndex: 100,
  },
  textStyles: {
    marginLeft: 10,
  },
  backgroundBox: { height: screenHeight, width: screenWidth, backgroundColor: 'transparent' },
});
