import React from 'react';
import { screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import OverlayModal, { CustomBounds } from 'components/OverlayModal';
import Touchable from 'components/Touchable';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { darkColors } from 'assets/theme';
import { TextM } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import { makeStyles } from '@rneui/themed';

const vertical = 20;
const horizontal = 20;
const itemHeight = pTd(48);
const BoxWidth = 200;
const horizontalSpacing = 120;
const verticalSpacing = 300;

export type ListItemType = {
  onPress?: () => void;
  title: string;
  iconName?: IconName;
  iconColor?: string;
  textStyle?: TextStyle;
  active?: boolean;
};

export type ShowChatPopoverParams = {
  list: ListItemType[];
  px?: number;
  py?: number;
  position?: 'left' | 'right';
  customPosition?: { left?: number; right?: number; top?: number; bottom?: number };
  customBounds?: CustomBounds;
  formatType?: 'fixedWidth' | 'dynamicWidth';
  contentStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onMaskClose?: () => void;
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

function FloatPopover({
  list,
  customPosition,
  formatType,
  containerStyle,
  contentStyle,
  onMaskClose,
}: {
  formatType: ShowChatPopoverParams['formatType'];
  list: ListItemType[];
  customPosition: ShowChatPopoverParams['customPosition'];
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<TextStyle>;
  onMaskClose?: () => void;
}) {
  const styles = getStyles();
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        onMaskClose?.();
        return OverlayModal.hide();
      }}
      style={styles.backgroundBox}>
      <View style={[styles.container, { ...customPosition }, containerStyle]}>
        {list.map((item, index) => {
          return (
            <Touchable
              key={index}
              onPress={() => {
                onMaskClose?.();
                item.onPress?.();
                OverlayModal.hide();
              }}
              style={[formatType === 'fixedWidth' ? styles.itemStyles : styles.dynamicWidthItemStyles, contentStyle]}>
              <View style={styles.itemContent}>
                {item.iconName && (
                  <Svg size={pTd(20)} icon={item.iconName} color={item.iconColor || darkColors.textBase1} />
                )}
                <TextM
                  style={[
                    styles.textStyles,
                    contentStyle,
                    item.textStyle,
                    item.iconName ? styles.leftMargin12 : styles.leftMargin0,
                  ]}>
                  {item.title}
                </TextM>
              </View>
              {item.active && (
                <Svg size={pTd(20)} icon="check-circle" color={item.iconColor || darkColors.textBrand2} />
              )}
            </Touchable>
          );
        })}
      </View>
    </TouchableOpacity>
  );
}

export function showFloatPopover({
  list,
  px,
  py,
  position = 'left',
  customPosition,
  customBounds,
  formatType = 'fixedWidth',
  onMaskClose,
  contentStyle,
  containerStyle,
}: ShowChatPopoverParams) {
  if (!customPosition) {
    customPosition =
      formatType === 'fixedWidth'
        ? formatPosition(px || 0, py || 0, list.length, position)
        : formatPositionByDynamicWidth(px || 0, py || 0, list.length);
  }
  OverlayModal.show(
    <FloatPopover
      list={list}
      customPosition={customPosition}
      formatType={formatType}
      containerStyle={containerStyle}
      contentStyle={contentStyle}
      onMaskClose={onMaskClose}
    />,
    {
      customBounds: customBounds || {
        x: px || customPosition.left || 0,
        y: py || customPosition.top || 0,
        width: 0,
        height: 0,
      },
      overlayOpacity: 0,
      style: { backgroundColor: 'transparent' },
      animated: true,
    },
  );
}

const itemStyle = StyleSheet.create({
  item: {
    height: itemHeight,
    paddingHorizontal: pTd(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
});
const getStyles = makeStyles(theme => ({
  dynamicWidthItemStyles: {
    minWidth: 100,
    ...itemStyle.item,
  },
  itemStyles: {
    width: BoxWidth,
    ...itemStyle.item,
  },
  container: {
    paddingVertical: pTd(4),
    position: 'absolute',
    borderRadius: pTd(6),
    zIndex: 100,
    minWidth: pTd(112),
    shadowOffset: { width: 2, height: 5 },
    backgroundColor: theme.colors.bgBase1,
    borderColor: theme.colors.borderBase1,
    shadowColor: theme.colors.shadow1,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 2,
  },
  itemContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  textStyles: {
    marginLeft: pTd(12),
    color: theme.colors.textBase1,
    ...fonts.SGRegularFont,
  },
  leftMargin12: {
    marginLeft: pTd(12),
  },
  leftMargin0: {
    marginLeft: 0,
  },
  backgroundBox: {
    height: screenHeight,
    width: screenWidth,
    backgroundColor: theme.colors.bgTransparent,
  },
}));
