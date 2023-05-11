import React from 'react';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { Image } from 'react-native';

const GameImgMap = {
  bingoGame: require('../../assets/image/pngs/bingoGame.png'),
} as const;

export type GameImgMapKeyType = keyof typeof GameImgMap;

interface CommonAvatarProps {
  size?: number;
  style?: any;
  pngName?: GameImgMapKeyType;
}

export default function DiscoverImage(props: CommonAvatarProps) {
  const { size = pTd(32), pngName = 'bingoGame' } = props;
  const [isError, setError] = React.useState(false);

  if (isError) return <Svg icon="default_record" size={size} />;
  return (
    <Image
      resizeMode={'contain'}
      style={[styles.avatarWrap]}
      source={GameImgMap[pngName]}
      onError={() => {
        setError(true);
      }}
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
