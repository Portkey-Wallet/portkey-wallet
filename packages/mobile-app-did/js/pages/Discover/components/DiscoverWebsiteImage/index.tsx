import React, { useMemo } from 'react';
import { pTd } from 'utils/unit';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import Default_Image from 'assets/image/pngs/default_record.png';
import FastImage from 'components/FastImage';

interface DiscoverWebsiteImageProps {
  imageUrl?: string;
  size?: number;
  style?: any;
}

export default function DiscoverWebsiteImage(props: DiscoverWebsiteImageProps) {
  const { size = pTd(32), imageUrl, style } = props;

  const sizeStyle = useMemo(
    () => ({
      width: size,
      height: size,
      borderRadius: size,
    }),
    [size],
  );

  return (
    <FastImage
      resizeMode={'cover'}
      style={[styles.avatarWrap, sizeStyle, style]}
      source={{ uri: imageUrl }}
      defaultSource={Default_Image}
    />
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
