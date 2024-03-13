import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
// import { parseInputChange } from '@portkey/utils/input';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';

import { useLanguage } from 'i18n/hooks';
import { TextL, TextS } from 'components/CommonText';
import CommonAvatar from 'components/CommonAvatar';
import { FontStyles } from 'assets/theme/styles';
import { useImageTracer } from 'model/hooks/imageTracer';

interface AmountNFT {
  nftItem: any;
}

export default function NFTInfo({ nftItem = { alias: '', balance: 0 } }: AmountNFT) {
  const { t } = useLanguage();
  const { imageUrl, imageLargeUrl } = nftItem;
  const imageUrlList = useMemo(() => {
    return [imageUrl, imageLargeUrl];
  }, [imageUrl, imageLargeUrl]);
  const { targetImageUrl } = useImageTracer(imageUrlList);

  return (
    <View style={styles.wrap}>
      <CommonAvatar
        shapeType="square"
        imageUrl={targetImageUrl}
        title={nftItem?.alias || ''}
        avatarSize={pTd(56)}
        style={styles.avatar}
      />
      <View>
        <TextL numberOfLines={1} style={styles.nftTitle}>{`${nftItem?.alias || ''}  #${nftItem?.tokenId}`}</TextL>
        <TextS numberOfLines={1} style={[styles.balance, FontStyles.font3]}>{`${t('Balance')}: ${
          nftItem?.balance
        }`}</TextS>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  wrap: {
    paddingTop: pTd(12),
    paddingBottom: pTd(16),
    ...GStyles.flexRowWrap,
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 0,
    backgroundColor: defaultColors.bg7,
    marginRight: pTd(16),
  },
  nftTitle: {
    maxWidth: pTd(230),
  },
  balance: {
    marginTop: pTd(4),
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topTitle: {
    color: defaultColors.font3,
    fontSize: pTd(14),
  },
  topBalance: {
    color: defaultColors.font3,
    fontSize: pTd(12),
  },
  bottom: {
    marginTop: pTd(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bottomLeft: {
    minWidth: pTd(114),
    height: pTd(40),
    backgroundColor: defaultColors.bg4,
    borderRadius: pTd(6),
    ...GStyles.paddingArg(6, 10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolName: {
    flex: 1,
    textAlign: 'center',
  },
  bottomRight: {
    flexDirection: 'row',
    position: 'relative',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  containerStyle: {
    width: '100%',
    minWidth: pTd(143),
    maxWidth: pTd(183),
    height: pTd(40),
    overflow: 'hidden',
  },
  inputContainerStyle: {
    borderColor: 'white', // how to delete bottom border?a
  },
  inputStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: pTd(40),
    borderColor: defaultColors.bg1,
    // backgroundColor: 'green',
    lineHeight: pTd(28),
    paddingRight: pTd(80),
    color: defaultColors.font5,
    fontSize: pTd(24),
  },
  usdtNumSent: {
    position: 'absolute',
    right: 0,
    bottom: pTd(5),
    borderBottomColor: defaultColors.border6,
    color: defaultColors.font3,
  },
});
