import React, { memo } from 'react';
import { defaultColors } from 'assets/theme';
import { TextL, TextM } from '@portkey-wallet/rn-components/components/CommonText';
import CommonSvg, { IconName } from '@portkey-wallet/rn-components/components/Svg';
import SvgUri from '@portkey-wallet/rn-components/components/Svg/SvgUri';

import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextProps, View } from 'react-native';
import { pTd } from 'utils/unit';

interface MenuItemProps {
  title: string;
  icon?: IconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
  TextComponent?: React.FC<TextProps>;
  arrowSize?: number;
  suffix?: string | number;
  iconStyle?: StyleProp<ViewStyle>;
  svgUrl?: string;
  showWarningCycle?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  icon,
  onPress,
  style,
  size = pTd(28),
  arrowSize = pTd(20),
  suffix,
  iconStyle,
  svgUrl,
  showWarningCycle = false,
}) => {
  return (
    <TouchableOpacity style={[styles.itemWrap, style]} onPress={() => onPress?.()}>
      {svgUrl !== undefined &&
        (svgUrl !== '' ? (
          <SvgUri source={{ uri: svgUrl }} width={size} height={size} style={[styles.menuIcon, iconStyle]} />
        ) : (
          <View style={[{ width: size, height: size }, styles.menuIcon, iconStyle]} />
        ))}
      {icon && (
        <View style={styles.svgWrap}>
          {showWarningCycle && <View style={styles.warningCycle} />}
          <CommonSvg icon={icon} size={size} iconStyle={[styles.menuIcon, iconStyle]} />
        </View>
      )}

      <TextL style={styles.titleWrap}>{title}</TextL>
      {suffix !== undefined && <TextM style={styles.suffixWrap}>{suffix}</TextM>}
      <CommonSvg icon="right-arrow" size={arrowSize} color={defaultColors.icon1} />
    </TouchableOpacity>
  );
};

export default memo(MenuItem);

const styles = StyleSheet.create({
  itemWrap: {
    height: pTd(56),
    backgroundColor: defaultColors.bg1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pTd(16),
    borderRadius: pTd(6),
  },
  menuIcon: {
    borderRadius: pTd(6),
    overflow: 'hidden',
    marginRight: pTd(12),
  },
  titleWrap: {
    flex: 1,
    color: defaultColors.font5,
    marginRight: pTd(12),
  },
  suffixWrap: {
    marginRight: pTd(4),
    color: defaultColors.font3,
  },
  svgWrap: {
    position: 'relative',
  },
  warningCycle: {
    position: 'absolute',
    zIndex: 1000,
    right: pTd(13),
    top: -pTd(3),
    width: pTd(8),
    height: pTd(8),
    borderRadius: pTd(5),
    backgroundColor: defaultColors.bg17,
    borderWidth: pTd(1),
    borderColor: defaultColors.bg1,
  },
});
