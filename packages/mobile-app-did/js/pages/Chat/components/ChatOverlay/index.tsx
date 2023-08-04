import React from 'react';
import { screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import OverlayModal from 'components/OverlayModal';
import Touchable from 'components/Touchable';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const vertical = 20;
const horizontal = 20;
const itemHeight = 40;
const BoxWidth = 100;
const horizontalSpacing = 120;
const verticalSpacing = 300;

export type ListItemType = { onPress?: () => void; title: string };

function formaPosition(px: number, py: number, length: number, position: 'left' | 'right') {
  let left = px + vertical;
  let top = py + horizontal;
  if (py > verticalSpacing) {
    top = py - length * itemHeight - horizontal;
  }
  if (
    (position === 'right' && px > horizontalSpacing) ||
    (position === 'left' && px > screenWidth - horizontalSpacing)
  ) {
    left = px - BoxWidth - vertical;
  }
  return { top, left };
}

function ChatPopover({ list, left, top }: { list: ListItemType[]; left: number; top: number }) {
  return (
    <TouchableOpacity activeOpacity={1} onPress={OverlayModal.hide} style={styles.backgroundBox}>
      <View
        style={[
          styles.container,
          {
            left: left,
            top: top,
          },
        ]}>
        {list.map((item, index) => {
          return (
            <Touchable
              key={index}
              onPress={() => {
                item.onPress?.();
                OverlayModal.hide();
              }}
              style={styles.itemStyles}>
              <Text style={styles.textStyles}>{item.title}</Text>
            </Touchable>
          );
        })}
      </View>
    </TouchableOpacity>
  );
}
function showChatPopover(list: ListItemType[], px: number, py: number, position: 'left' | 'right') {
  const { left, top } = formaPosition(px, py, list.length, position);
  OverlayModal.show(<ChatPopover list={list} top={top} left={left} />, {
    customBounds: { x: px, y: py, width: 0, height: 0 },
    overlayOpacity: 0,
    containerStyle: {},
    style: { backgroundColor: 'transparent' },
    animated: true,
  });
}
export default {
  showChatPopover,
};
const styles = StyleSheet.create({
  itemStyles: {
    width: BoxWidth,
    height: itemHeight,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
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
