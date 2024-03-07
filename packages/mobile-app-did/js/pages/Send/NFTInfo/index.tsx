import React from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';

import { useLanguage } from 'i18n/hooks';
import { TextL, TextS } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import NFTAvatar from 'components/NFTAvatar';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { IToSendAssetParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { SeedTypeEnum } from '@portkey-wallet/types/types-ca/assets';

interface AmountNFT {
  nftItem: IToSendAssetParamsType;
}

export default function NFTInfo({
  nftItem = {
    alias: '',
    balance: '0',
    imageUrl: '',
    tokenId: '',
    decimals: '0',
    symbol: '',
    chainId: 'AELF',
    tokenContractAddress: '',
    isSeed: false,
    seedType: SeedTypeEnum.Token,
  },
}: AmountNFT) {
  const { t } = useLanguage();

  return (
    <View style={styles.wrap}>
      <NFTAvatar
        disabled
        isSeed={nftItem.isSeed}
        seedType={nftItem.seedType}
        nftSize={pTd(56)}
        badgeSizeType="normal"
        data={nftItem}
        style={styles.avatar}
      />
      <View>
        <TextL numberOfLines={1} style={styles.nftTitle}>
          {`${nftItem?.alias || ''}  #${nftItem?.tokenId}`}
        </TextL>
        <TextS numberOfLines={1} style={[styles.balance, FontStyles.font3]}>{`${t('Balance')}:  ${formatAmountShow(
          divDecimals(nftItem?.balance, nftItem?.decimals),
        )}`}</TextS>
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
    marginRight: pTd(16),
    width: pTd(56),
    height: pTd(56),
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
