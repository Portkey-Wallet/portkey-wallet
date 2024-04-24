import React, { useEffect, useMemo, useState } from 'react';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { checkIsSvgUrl } from 'utils';
import { SvgCssUri } from 'react-native-svg';
import FastImage from 'components/FastImage';
import { ResizeMode } from 'react-native-fast-image';

export interface CommonAvatarProps {
  title?: string;
  avatarSize?: string | number;
  hasBorder?: boolean;
  svgName?: IconName;
  imageUrl?: string;
  shapeType?: 'square' | 'circular';
  style?: ViewStyle & TextStyle;
  color?: string;
  resizeMode?: ResizeMode;
  width?: number | string;
  height?: number | string;
  preserveAspectRatio?: string;
  titleStyle?: TextStyle;
  borderStyle?: ViewStyle;
}

export default function CommonAvatar(props: CommonAvatarProps) {
  const {
    title,
    svgName,
    avatarSize = pTd(48),
    style = {},
    color,
    imageUrl,
    shapeType = 'circular',
    hasBorder,
    resizeMode = 'contain',
    width,
    height,
    preserveAspectRatio,
    titleStyle: titleStyleProp,
    borderStyle: borderStyleProp,
  } = props;

  const [loadError, setLoadError] = useState(false);
  const initialsTitle = String(title?.[0] || '').toUpperCase();

  const sizeStyle = useMemo(
    () => ({
      width: width || Number(avatarSize),
      height: height || Number(avatarSize),
      borderRadius: shapeType === 'square' ? 4 : Number(avatarSize) / 2,
    }),
    [avatarSize, height, shapeType, width],
  );

  const titleStyle = useMemo(
    () => ({
      fontSize: style.fontSize || pTd(20),
      color: color || style.color || defaultColors.font5,
      lineHeight: style.lineHeight,
      ...titleStyleProp,
    }),
    [color, style.color, style.fontSize, style.lineHeight, titleStyleProp],
  );

  const borderStyle = useMemo(
    () => ({
      borderWidth: pTd(1),
      borderColor: defaultColors.border1,
      ...borderStyleProp,
    }),
    [borderStyleProp],
  );

  // when change url ,reset loading error state
  useEffect(() => setLoadError(false), [imageUrl]);

  if (svgName)
    return (
      <Svg
        oblongSize={[width || avatarSize, height || avatarSize]}
        icon={svgName}
        color={color}
        iconStyle={{
          ...styles.avatarWrap,
          ...(shapeType === 'square' ? styles.squareStyle : {}),
          ...sizeStyle,
          ...style,
        }}
      />
    );

  if (imageUrl && !loadError) {
    return checkIsSvgUrl(imageUrl) ? (
      <View style={[styles.avatarWrap, shapeType === 'square' && styles.squareStyle, sizeStyle, style]}>
        <SvgCssUri
          uri={imageUrl}
          width={sizeStyle.width}
          height={sizeStyle.height}
          preserveAspectRatio={preserveAspectRatio}
        />
      </View>
    ) : (
      <FastImage
        resizeMode={resizeMode}
        style={[styles.avatarWrap, shapeType === 'square' && styles.squareStyle, sizeStyle, style as any]}
        onError={() => setLoadError(true)}
        source={{
          uri: imageUrl,
        }}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatarWrap,
        shapeType === 'square' && styles.squareStyle,
        hasBorder && borderStyle,
        sizeStyle,
        style,
      ]}>
      <Text style={titleStyle}>{initialsTitle}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  avatarWrap: {
    width: pTd(48),
    height: pTd(48),
    borderRadius: pTd(48),
    backgroundColor: defaultColors.bg6,
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareStyle: {
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg7,
    borderWidth: 0,
    color: defaultColors.font7,
  },
});
