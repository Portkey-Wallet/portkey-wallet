import React from 'react';
import { StyleSheet, StatusBar, View, ScrollView } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { TextL, TextM, TextXXL } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import fonts from 'assets/theme/fonts';
import navigationService from 'utils/navigationService';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import SafeAreaBox from 'components/SafeAreaBox';
import Svg from 'components/Svg';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import { ScreenWidth } from '@rneui/base';
import { bottomBarHeight } from '@portkey-wallet/utils/mobile/device';
import { copyText } from 'utils';
import { formatTransferTime } from '@portkey-wallet/utils/time';
import Touchable from 'components/Touchable';
import NFTAvatar from 'components/NFTAvatar';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { SeedTypeEnum } from '@portkey-wallet/types/types-ca/assets';

export interface TokenDetailProps {
  route?: any;
}

interface NftItemType {
  alias: string;
  balance: string;
  isSeed?: boolean;
  seedType?: SeedTypeEnum;
  chainId: ChainId;
  imageUrl: string;
  imageLargeUrl: string;
  symbol: string;
  tokenContractAddress: string;
  tokenId: string;
  decimals: string;
  totalSupply: string;
  inscriptionName?: string;
  limitPerMint?: string;
  expires?: string;
  seedOwnedSymbol?: string;
  collectionInfo: {
    imageUrl: string;
    collectionName: string;
  };
}

const NFTDetail: React.FC<TokenDetailProps> = () => {
  const { t } = useLanguage();

  const nftItem = useRouterParams<NftItemType>();

  const {
    alias,
    balance,
    tokenContractAddress,
    imageLargeUrl,
    symbol,
    chainId,
    tokenId,
    decimals,
    isSeed,
    seedType,
    inscriptionName,
    totalSupply,
    limitPerMint,
    expires,
    seedOwnedSymbol,
    collectionInfo: { imageUrl, collectionName },
  } = nftItem;

  return (
    <SafeAreaBox style={styles.pageWrap}>
      <StatusBar barStyle={'default'} />
      <Touchable style={styles.iconWrap} onPress={() => navigationService.goBack()}>
        <Svg icon="left-arrow" size={20} />
      </Touchable>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.collection, GStyles.flexRow, GStyles.itemCenter]}>
          <NFTAvatar
            disabled
            nftSize={pTd(24)}
            badgeSizeType="large"
            data={{
              alias: collectionName,
              imageUrl,
            }}
            style={styles.collectionAvatar}
          />
          <TextM style={[FontStyles.font3, styles.marginLeft8, fonts.mediumFont]}>{collectionName}</TextM>
        </View>
        <TextXXL style={styles.tokenId}>{`${alias} #${tokenId}`}</TextXXL>
        <NFTAvatar
          disabled
          isSeed={isSeed}
          seedType={seedType}
          nftSize={pTd(335)}
          badgeSizeType="large"
          data={{
            alias,
            imageUrl: imageLargeUrl,
            tokenId,
          }}
          style={styles.image}
        />

        <View style={styles.infoWrap}>
          <View>
            <TextL style={[styles.basicInfoTitle, fonts.mediumFont]}>{t('Basic info')}</TextL>
            <View style={[GStyles.flexRow, styles.rowWrap]}>
              <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Contract address')}</TextM>
              <View style={GStyles.flex1} />
              <TextM style={[styles.leftTitle, FontStyles.font5]}>
                {formatStr2EllipsisStr(addressFormat(tokenContractAddress, chainId))}
              </TextM>
              <Touchable
                style={[styles.marginLeft8, GStyles.flexCol, styles.copyIconWrap]}
                onPress={async () => await copyText(addressFormat(tokenContractAddress, chainId))}>
                <Svg icon="copy" size={pTd(13)} />
              </Touchable>
            </View>
            <View style={[GStyles.flexRow, styles.rowWrap]}>
              <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('BlockChain')}</TextM>
              <View style={GStyles.flex1} />
              <TextM style={[styles.leftTitle, FontStyles.font5]}>{formatChainInfoToShow(chainId)}</TextM>
            </View>
            <View style={[GStyles.flexRow, styles.rowWrap]}>
              <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Symbol')}</TextM>
              <View style={GStyles.flex1} />
              <TextM style={[styles.leftTitle, FontStyles.font5]}>{symbol}</TextM>
            </View>
            <View style={[GStyles.flexRow, styles.rowWrap]}>
              <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Total supply')}</TextM>
              <View style={GStyles.flex1} />
              <TextM style={[styles.leftTitle, FontStyles.font5]}>
                {formatAmountShow(divDecimals(totalSupply, decimals))}
              </TextM>
            </View>
          </View>

          {/* Token Creation via This Seed */}
          {isSeed && (
            <View style={GStyles.marginTop(pTd(32))}>
              <TextL style={[styles.basicInfoTitle, fonts.mediumFont]}>{t('Token Creation via This Seed')}</TextL>
              <View style={[GStyles.flexRow, styles.rowWrap]}>
                <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Type')}</TextM>
                <View style={GStyles.flex1} />
                <TextM style={[styles.leftTitle, FontStyles.font5]}>
                  {SeedTypeEnum[seedType || SeedTypeEnum.None]}
                </TextM>
              </View>
              <View style={[GStyles.flexRow, styles.rowWrap]}>
                <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Token Symbol')}</TextM>
                <View style={GStyles.flex1} />
                <TextM style={[styles.leftTitle, FontStyles.font5]}>{seedOwnedSymbol}</TextM>
              </View>
              <View style={[GStyles.flexRow, styles.rowWrap]}>
                <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Expires')}</TextM>
                <View style={GStyles.flex1} />
                <TextM style={[styles.leftTitle, FontStyles.font5]}>{formatTransferTime(expires)}</TextM>
              </View>
            </View>
          )}

          {/* Inscription info */}
          {inscriptionName && (
            <View style={GStyles.marginTop(pTd(32))}>
              <TextL style={[styles.basicInfoTitle, fonts.mediumFont]}>{t('Inscription info')}</TextL>
              <View style={[GStyles.flexRow, styles.rowWrap]}>
                <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Inscription Name')}</TextM>
                <View style={GStyles.flex1} />
                <TextM style={[styles.leftTitle, FontStyles.font5]}>{inscriptionName}</TextM>
              </View>
              <View style={[GStyles.flexRow, styles.rowWrap]}>
                <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Limit Per Mint')}</TextM>
                <View style={GStyles.flex1} />
                <TextM style={[styles.leftTitle, FontStyles.font5]}>{limitPerMint}</TextM>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[GStyles.flexCol, styles.bottomSection]}>
        <TextM style={[styles.balance, FontStyles.font5, fonts.mediumFont]}>{`You have: ${formatAmountShow(
          divDecimals(balance, decimals),
        )}`}</TextM>
        <CommonButton
          title={t('Send')}
          style={styles.sendBtn}
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
  collectionAvatar: {
    borderRadius: pTd(4),
  },
  tokenId: {
    ...fonts.mediumFont,
    lineHeight: pTd(24),
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
    backgroundColor: defaultColors.bg1,
    position: 'absolute',
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: defaultColors.border6,
    width: ScreenWidth,
    height: pTd(110) + bottomBarHeight,
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
  },
  balance: {
    width: '100%',
    textAlign: 'center',
    marginTop: pTd(10),
    marginBottom: pTd(16),
  },
  sendBtn: {
    marginBottom: pTd(16),
  },
  infoWrap: {
    marginBottom: pTd(150),
  },
});
