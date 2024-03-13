import React, { memo, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import { TextM, TextS } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import { useImageTracer } from 'model/hooks/imageTracer';

export type NoDataPropsType = {
  style?: ViewStyle | ViewStyle[];
  data: {
    alias: string;
    balance: string;
    chainId: string;
    imageUrl: string;
    imageLargeUrl: string;
    symbol: string;
    tokenContractAddress: string;
    tokenId: string;
  };
  onPress?: () => void;
};

const NFTAvatar: React.FC<NoDataPropsType> = props => {
  const {
    style = {},
    data: { imageUrl, imageLargeUrl, tokenId, alias },
    onPress,
  } = props;

  const imageUrlList = useMemo(() => {
    return [imageUrl, imageLargeUrl];
  }, [imageUrl, imageLargeUrl]);

  const { targetImageUrl } = useImageTracer(imageUrlList);

  const outStyles = Array.isArray(style) ? style : [style];

  return (
    <TouchableOpacity style={[styles.wrap, ...outStyles]} onPress={onPress}>
      {targetImageUrl && <CommonAvatar shapeType="square" imageUrl={targetImageUrl} style={styles.img} />}
      <TextM
        numberOfLines={targetImageUrl ? 1 : 2}
        ellipsizeMode="tail"
        style={[styles.title, !!targetImageUrl && styles.titleNoPic]}>
        {alias}
      </TextM>
      <TextS style={[styles.id, !!targetImageUrl && styles.idNoPic]}>{`# ${tokenId}`}</TextS>
      {targetImageUrl && <View style={styles.mask} />}
    </TouchableOpacity>
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
    backgroundColor: defaultColors.bg4,
  },
  img: {
    position: 'absolute',
    width: pTd(98),
    height: pTd(98),
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
    opacity: 0.25,
    shadowOffset: {
      width: pTd(10),
      height: -pTd(10),
    },
    shadowRadius: pTd(6),
  },
});
