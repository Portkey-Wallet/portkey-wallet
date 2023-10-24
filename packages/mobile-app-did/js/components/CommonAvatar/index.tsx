import React from 'react';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { Text } from 'react-native';
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
  style?: any;
  color?: string;
  resizeMode?: ResizeMode;
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
  } = props;
  const initialsTitle = String(title?.[0] || '').toUpperCase();

  const sizeStyle = {
    width: Number(avatarSize),
    height: Number(avatarSize),
    lineHeight: hasBorder ? Number(avatarSize) - pTd(2) : Number(avatarSize),
    borderRadius: shapeType === 'square' ? pTd(6) : Number(avatarSize) / 2,
  };

  if (svgName)
    return (
      <Svg
        size={avatarSize}
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

  if (imageUrl) {
    return checkIsSvgUrl(imageUrl) ? (
      <SvgCssUri
        uri={imageUrl}
        style={[styles.avatarWrap, shapeType === 'square' && styles.squareStyle, sizeStyle, style]}
      />
    ) : (
      <FastImage
        resizeMode={resizeMode}
        style={[styles.avatarWrap, shapeType === 'square' && styles.squareStyle, sizeStyle, style]}
        source={{
          uri: imageUrl,
        }}
      />
    );
  }

  return (
    <Text
      style={[
        styles.avatarWrap,
        shapeType === 'square' && styles.squareStyle,
        hasBorder && styles.hasBorder,
        sizeStyle,
        style,
      ]}>
      {initialsTitle}
    </Text>
  );
}
const styles = StyleSheet.create({
  avatarWrap: {
    width: pTd(48),
    height: pTd(48),
    borderRadius: pTd(48),
    color: defaultColors.font5,
    backgroundColor: defaultColors.bg4,
    display: 'flex',
    fontSize: pTd(20),
    lineHeight: '100%',
    overflow: 'hidden',
    textAlign: 'center',
  },
  hasBorder: {
    borderWidth: pTd(1),
    borderColor: defaultColors.border1,
  },
  squareStyle: {
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg7,
    borderWidth: 0,
    color: defaultColors.font7,
  },
});
