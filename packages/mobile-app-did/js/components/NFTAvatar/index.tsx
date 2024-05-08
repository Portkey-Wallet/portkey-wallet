import React, { memo, useMemo } from 'react';
import { StyleSheet, View, Text, ViewStyle, Image, StyleProp, ImageStyle, TextStyle } from 'react-native';
import { pTd } from 'utils/unit';
import { TextM, TextS } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import Touchable from 'components/Touchable';
import nftBadge from 'assets/image/pngs/nftBadge.png';
import tokenBadge from 'assets/image/pngs/tokenBadge.png';
import { SeedTypeEnum } from '@portkey-wallet/types/types-ca/assets';
import { FontStyles } from 'assets/theme/styles';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';

export type NoDataPropsType = {
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  isSeed?: boolean;
  seedType?: SeedTypeEnum;
  showNftDetailInfo?: boolean;
  nftSize?: number;
  badgeSizeType?: 'small' | 'normal' | 'large';
  data: {
    alias?: string;
    imageUrl: string;
    tokenId?: string;
    balance?: string;
    decimals?: string;
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
    isSeed = false,
    badgeSizeType = 'small',
    data: { imageUrl, alias, balance, decimals },
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

  const fontSizeStyle = useMemo<StyleProp<TextStyle>>(
    () => ({
      fontSize: nftSize / 2,
      height: nftSize,
      lineHeight: nftSize,
    }),
    [nftSize],
  );

  const nftWrapStyle = useMemo<StyleProp<ImageStyle>>(() => {
    return { width: nftSize, height: nftSize };
  }, [nftSize]);

  return (
    <Touchable
      disabled={disabled}
      style={[styles.wrap, !imageUrl && !showNftDetailInfo && styles.wrapContentCenter, nftWrapStyle, ...outStyles]}
      onPress={onPress}>
      {isSeed && (
        <Image
          source={seedType === SeedTypeEnum.Token ? tokenBadge : nftBadge}
          style={[styles.badge, badgeSizeStyle]}
        />
      )}
      {!imageUrl && !showNftDetailInfo && <Text style={[FontStyles.font7, fontSizeStyle]}>{alias?.[0]}</Text>}
      {imageUrl && <CommonAvatar avatarSize={nftSize} shapeType="square" imageUrl={imageUrl} style={styles.img} />}
      {showNftDetailInfo && (
        <>
          <TextM
            numberOfLines={imageUrl ? 1 : 2}
            ellipsizeMode="tail"
            style={[styles.title, !!imageUrl && styles.titleNoPic]}>
            {alias}
          </TextM>

          <TextS numberOfLines={1} style={[styles.id, !!imageUrl && styles.idNoPic]}>
            {formatTokenAmountShowWithDecimals(balance, decimals)}
          </TextS>
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
    backgroundColor: defaultColors.bg4,
  },
  wrapContentCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
