import React, { memo, useMemo } from 'react';
import { defaultColors } from 'assets/theme';
import { TextL, TextM } from 'components/CommonText';
import Svg, { IconName } from 'components/Svg';
import SvgUri from 'components/Svg/SvgUri';
import Touchable from 'components/Touchable';
import { StyleSheet, StyleProp, ViewStyle, TextProps, View } from 'react-native';
import { pTd } from 'utils/unit';

export interface IMenuItemProps {
  title: string;
  icon?: IconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  hideArrow?: boolean;
  size?: number;
  TextComponent?: React.FC<TextProps>;
  arrowSize?: number;
  suffix?: string | number | React.ReactNode;
  iconColor?: string;
  iconStyle?: StyleProp<ViewStyle>;
  svgUrl?: string;
  showWarningCycle?: boolean;
}

const MenuItem: React.FC<IMenuItemProps> = ({
  title,
  icon,
  onPress,
  style,
  size = pTd(28),
  hideArrow = false,
  arrowSize = pTd(20),
  suffix,
  iconColor,
  iconStyle,
  svgUrl,
  showWarningCycle = false,
}) => {
  const SuffixDom = useMemo((): React.ReactNode => {
    if (!suffix) return null;
    if (typeof suffix === 'number' || typeof suffix === 'string')
      return <TextM style={styles.suffixWrap}>{suffix}</TextM>;

    return suffix;
  }, [suffix]);

  return (
    <Touchable style={[styles.itemWrap, style]} onPress={() => onPress?.()}>
      {svgUrl !== undefined &&
        (svgUrl !== '' ? (
          <SvgUri source={{ uri: svgUrl }} width={size} height={size} style={[styles.menuIcon, iconStyle]} />
        ) : (
          <View style={[{ width: size, height: size }, styles.menuIcon, iconStyle]} />
        ))}
      {icon && (
        <View style={styles.svgWrap}>
          {showWarningCycle && <View style={styles.warningCycle} />}
          <Svg
            icon={icon}
            size={size}
            color={iconColor ? iconColor : undefined}
            iconStyle={[styles.menuIcon, iconStyle]}
          />
        </View>
      )}
      <TextL style={styles.titleWrap}>{title}</TextL>
      {SuffixDom}
      {!hideArrow && <Svg icon="right-arrow" size={arrowSize} color={defaultColors.icon1} />}
    </Touchable>
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
    color: defaultColors.neutralTertiaryText,
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
