import React, { memo, useMemo } from 'react';
import { StyleSheet, View, ViewStyle, Image, StyleProp, ImageStyle } from 'react-native';
import { pTd } from 'utils/unit';
import { TextM, TextS } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import Touchable from 'components/Touchable';
import nftBadge from 'assets/image/pngs/nftBadge.png';
import tokenBadge from 'assets/image/pngs/tokenBadge.png';

export type NoDataPropsType = {
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  seedType?: 'ft' | 'nft';
  showNftDetailInfo?: boolean;
  nftSize?: number;
  badgeSizeType?: 'small' | 'normal' | 'large';
  data: {
    alias?: string;
    imageUrl: string;
    tokenId?: string;
  };
  onPress?: () => void;
};

const NFTAvatar: React.FC<NoDataPropsType> = props => {
  const {
    style = {},
    disabled = false,
    seedType,
    showNftDetailInfo = false,
    nftSize = pTd(98),
    badgeSizeType = 'small',
    data: { imageUrl, tokenId, alias },
    onPress,
  } = props;

  const outStyles = Array.isArray(style) ? style : [style];

  const badgeSizeStyle = useMemo<StyleProp<ImageStyle>>(() => {
    if (badgeSizeType === 'small')
      return {
        width: pTd(24),
        height: pTd(12),
      };

    if (badgeSizeType === 'large')
      return {
        width: pTd(48),
        height: pTd(24),
      };

    return { width: pTd(32), height: pTd(16) };
  }, [badgeSizeType]);

  const nftWrapStyle = useMemo<StyleProp<ImageStyle>>(() => {
    return { width: nftSize, height: nftSize };
  }, [nftSize]);

  return (
    <Touchable disabled={disabled} style={[styles.wrap, nftWrapStyle, ...outStyles]} onPress={onPress}>
      {seedType && <Image source={seedType === 'ft' ? tokenBadge : nftBadge} style={[styles.badge, badgeSizeStyle]} />}
      {imageUrl && <CommonAvatar avatarSize={nftSize} shapeType="square" imageUrl={imageUrl} style={[styles.img]} />}
      {showNftDetailInfo && (
        <>
          <TextM
            numberOfLines={imageUrl ? 1 : 2}
            ellipsizeMode="tail"
            style={[styles.title, !!imageUrl && styles.titleNoPic]}>
            {alias}
          </TextM>

          <TextS style={[styles.id, !!imageUrl && styles.idNoPic]}>{`# ${tokenId}`}</TextS>
          {imageUrl && <View style={styles.mask} />}
        </>
      )}
    </Touchable>
  );
};
export default memo(NFTAvatar);

const styles = StyleSheet.create({
  wrap: {
    width: pTd(98),
    height: pTd(98),
    ...GStyles.paddingArg(12, 8),
    borderRadius: pTd(8),
    overflow: 'hidden',
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: defaultColors.bg6,
  },
  img: {
    position: 'absolute',
  },
  title: {
    color: defaultColors.font5,
    lineHeight: pTd(20),
  },
  titleNoPic: {
    zIndex: 100,
    position: 'absolute',
    color: defaultColors.font2,
    left: pTd(8),
    bottom: pTd(20),
  },
  id: {
    position: 'absolute',
    bottom: pTd(12),
    left: pTd(8),
    lineHeight: pTd(16),
  },
  idNoPic: {
    zIndex: 100,
    position: 'absolute',
    bottom: pTd(4),
    color: defaultColors.font2,
  },
  message: {
    color: defaultColors.font7,
    lineHeight: pTd(22),
    textAlign: 'center',
  },
  mask: {
    position: 'absolute',
    width: pTd(98),
    height: pTd(40),
    bottom: 0,
    backgroundColor: 'black',
    opacity: 0.4,
    shadowOffset: {
      width: pTd(10),
      height: -pTd(10),
    },
    shadowRadius: pTd(6),
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: '5%',
    width: pTd(24),
    height: pTd(12),
    zIndex: 10000,
  },
});
