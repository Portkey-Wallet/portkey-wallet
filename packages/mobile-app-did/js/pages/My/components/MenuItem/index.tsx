import { defaultColors } from 'assets/theme';
import { TextL, TextM } from 'components/CommonText';
import Svg, { IconName } from 'components/Svg';
import SvgUri from 'components/Svg/SvgUri';

import React, { memo } from 'react';
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
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  icon,
  onPress,
  style,
  size = 28,
  arrowSize = 20,
  suffix,
  iconStyle,
  svgUrl,
}) => {
  return (
    <TouchableOpacity style={[styles.itemWrap, style]} onPress={() => onPress?.()}>
      {svgUrl !== undefined &&
        (svgUrl !== '' ? (
          <SvgUri source={{ uri: svgUrl }} width={size} height={size} style={[styles.menuIcon, iconStyle]} />
        ) : (
          <View style={[{ width: size, height: size }, styles.menuIcon, iconStyle]} />
        ))}
      {icon && <Svg icon={icon} size={size} iconStyle={[styles.menuIcon, iconStyle]} />}

      <TextL style={styles.titleWrap}>{title}</TextL>
      {suffix !== undefined && <TextM style={styles.suffixWrap}>{suffix}</TextM>}
      <Svg icon="right-arrow" size={arrowSize} color={defaultColors.icon1} />
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
    marginBottom: pTd(24),
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
});
