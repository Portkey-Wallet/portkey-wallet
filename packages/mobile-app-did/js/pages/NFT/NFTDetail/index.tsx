import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, StatusBar, View, Image } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { TextL, TextM, TextXL, TextXXL } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import fonts from 'assets/theme/fonts';
import navigationService from 'utils/navigationService';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import SafeAreaBox from 'components/SafeAreaBox';
import Svg from 'components/Svg';
import CommonAvatar from 'components/CommonAvatar';
import * as Clipboard from 'expo-clipboard';
import CommonToast from 'components/CommonToast';
import { formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';

export interface TokenDetailProps {
  route?: any;
}

interface NftItemType {
  alias: string;
  balance: string;
  chainId: ChainId;
  imageUrl: string;
  imageLargeUrl: string;
  symbol: string;
  tokenContractAddress: string;
  tokenId: string;
  totalSupply: string;
  collectionInfo: {
    imageUrl: string;
    collectionName: string;
  };
}

const NFTDetail: React.FC<TokenDetailProps> = props => {
  const { t } = useLanguage();

  const nftItem = useRouterParams<NftItemType>();

  const {
    alias,
    balance,
    tokenContractAddress,
    imageLargeUrl,
    symbol,
    totalSupply,
    chainId,
    tokenId,
    collectionInfo: { imageUrl, collectionName },
  } = nftItem;

  console.log('nftItem', nftItem);

  const copyStr = useCallback(
    async (str: string) => {
      const isCopy = await Clipboard.setStringAsync(str);
      isCopy && CommonToast.success(t('Copy Success'));
    },
    [t],
  );

  return (
    <SafeAreaBox style={styles.pageWrap}>
      <StatusBar barStyle={'default'} />
      <TouchableOpacity style={styles.iconWrap} onPress={() => navigationService.goBack()}>
        <Svg icon="left-arrow" size={20} />
      </TouchableOpacity>

      <View style={[styles.collection, GStyles.flexRow, GStyles.itemCenter]}>
        <CommonAvatar imageUrl={imageUrl} title={collectionName} shapeType={'circular'} avatarSize={pTd(24)} />
        <TextM style={[FontStyles.font3, styles.marginLeft8, fonts.mediumFont]}>{collectionName}</TextM>
      </View>
      <TextXXL style={styles.tokenId}>{`#${tokenId}`}</TextXXL>

      <CommonAvatar title={alias} style={[imageLargeUrl ? styles.image1 : styles.image]} imageUrl={imageLargeUrl} />

      <View>
        <TextL style={[styles.basicInfoTitle, fonts.mediumFont]}>{t('Basic info')}</TextL>
        <View style={[GStyles.flexRow, styles.rowWrap]}>
          <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Contract address')}</TextM>
          <View style={GStyles.flex1} />
          <TextM style={[styles.leftTitle, FontStyles.font5]}>{formatStr2EllipsisStr(tokenContractAddress)}</TextM>
          <TouchableOpacity
            style={[styles.marginLeft8, GStyles.flexCol, styles.copyIconWrap]}
            onPress={() => copyStr(tokenContractAddress)}>
            <Svg icon="copy" size={pTd(13)} />
          </TouchableOpacity>
        </View>
        <View style={[GStyles.flexRow, styles.rowWrap]}>
          <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('BlockChain')}</TextM>
          <View style={GStyles.flex1} />
          <TextM style={[styles.leftTitle, FontStyles.font5]}>{formatChainInfoToShow(chainId)}</TextM>
        </View>
        <View style={[GStyles.flexRow, styles.rowWrap]}>
          <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Token symbol')}</TextM>
          <View style={GStyles.flex1} />
          <TextM style={[styles.leftTitle, FontStyles.font5]}>{symbol}</TextM>
        </View>
        <View style={[GStyles.flexRow, styles.rowWrap]}>
          <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Total Supply')}</TextM>
          <View style={GStyles.flex1} />
          <TextM style={[styles.leftTitle, FontStyles.font5]}>{totalSupply ?? ''}</TextM>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TextXL style={[styles.symbolContent, FontStyles.font3]}>{`You have: ${balance}`}</TextXL>
        <CommonButton
          title={t('Send')}
          type="primary"
          onPress={() => {
            navigationService.navigate('SendHome', {
              sendType: 'nft',
              assetInfo: nftItem,
              toInfo: { name: '', address: '' },
            } as unknown as IToSendHomeParamsType);
          }}
        />
      </View>
    </SafeAreaBox>
  );
};

export default NFTDetail;

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg1,
    ...GStyles.paddingArg(0, 20, 0),
  },
  iconWrap: {
    width: pTd(20),
    marginBottom: pTd(16),
    marginTop: pTd(16),
  },
  collection: {
    marginTop: pTd(8),
  },
  collectionAvatar: {},
  tokenId: {
    ...fonts.mediumFont,
    lineHeight: pTd(24),
    marginTop: pTd(8),
  },
  balance: {
    lineHeight: pTd(20),
    marginTop: pTd(8),
  },
  amount: {
    marginTop: pTd(8),
  },
  image: {
    marginTop: pTd(24),
    marginBottom: pTd(24),
    width: pTd(335),
    height: pTd(335),
    borderRadius: pTd(8),
    lineHeight: pTd(335),
    textAlign: 'center',
    fontSize: pTd(100),
    backgroundColor: defaultColors.bg7,
    color: defaultColors.font7,
  },
  image1: {
    marginTop: pTd(24),
    marginBottom: pTd(24),
    width: pTd(335),
    height: pTd(335),
    borderRadius: pTd(8),
    lineHeight: pTd(335),
    textAlign: 'center',
    fontSize: pTd(100),
  },
  basicInfoTitle: {
    marginBottom: pTd(8),
  },
  rowWrap: {
    height: pTd(34),
    alignItems: 'center',
  },
  leftTitle: {},
  copyIconWrap: {},
  symbolDescribeTitle: {
    marginTop: pTd(32),
    ...fonts.mediumFont,
  },
  symbolContent: {
    marginTop: pTd(4),
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },
  marginLeft8: {
    marginLeft: pTd(8),
  },
  bottomSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: defaultColors.border6,
  },
});
