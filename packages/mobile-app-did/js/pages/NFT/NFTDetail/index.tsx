import React, { useEffect, useRef, useState } from 'react';
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
import { ScreenWidth } from '@rneui/base';
import { bottomBarHeight } from '@portkey-wallet/utils/mobile/device';
import { copyText } from 'utils';
import { formatTransferTime } from '@portkey-wallet/utils/time';
import Touchable from 'components/Touchable';
import NFTAvatar from 'components/NFTAvatar';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { SeedTypeEnum, NFTItemBaseType } from '@portkey-wallet/types/types-ca/assets';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useNFTItemDetail } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useEffectOnce } from '@portkey-wallet/hooks';

export interface TokenDetailProps {
  route?: any;
}

interface INftDetailPage extends NFTItemBaseType {
  collectionInfo?: {
    imageUrl: string;
    collectionName: string;
  };
}

const NFTDetail: React.FC<TokenDetailProps> = () => {
  const { t } = useLanguage();

  const timerRef = useRef<NodeJS.Timeout>();
  const nftItem = useRouterParams<INftDetailPage>();
  const fetchNftDetail = useNFTItemDetail();

  const [nftDetailInfo, setNftDetailInfo] = useState<INftDetailPage>(nftItem);

  const {
    alias,
    balance,
    isSeed,
    seedType,
    chainId,
    imageUrl,
    imageLargeUrl,
    symbol,
    tokenContractAddress,
    tokenId,
    decimals,
    totalSupply,
    inscriptionName,
    limitPerMint,
    expires,
    seedOwnedSymbol,
    recommendedRefreshSeconds,
    generation,
    collectionInfo,
    traitsPercentages,
  } = nftDetailInfo;

  const fetchDetail = useLockCallback(async () => {
    try {
      const result = await fetchNftDetail({
        symbol,
        chainId,
      });

      setNftDetailInfo(pre => ({ ...pre, result }));
    } catch (error) {
      console.log('fetchDetail error', error);
    }
  }, [fetchNftDetail, chainId, symbol]);

  useEffectOnce(() => {
    if (traitsPercentages) {
      timerRef.current = setInterval(async () => {
        await fetchDetail();
      }, (recommendedRefreshSeconds ?? 10) * 1000);
    }
  });

  useEffect(
    () => () => {
      if (timerRef.current && nftDetailInfo.traits) clearInterval(timerRef.current);
    },
    [nftDetailInfo.traits],
  );

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
              alias: collectionInfo?.collectionName,
              imageUrl: nftDetailInfo?.imageUrl,
            }}
            style={styles.collectionAvatar}
          />
          <TextM style={[FontStyles.font3, styles.marginLeft8, fonts.mediumFont]}>
            {collectionInfo?.collectionName}
          </TextM>
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
            imageUrl: imageLargeUrl || imageUrl,
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

          {/* Traits */}
          {traitsPercentages && (
            <View style={GStyles.marginTop(pTd(32))}>
              <TextL style={fonts.mediumFont}>{t('Traits')}</TextL>
              {traitsPercentages.map((ele, idx) => (
                <View key={idx} style={[GStyles.flexRow, GStyles.itemCenter, GStyles.marginTop(12)]}>
                  <View>
                    <TextM style={[styles.leftTitle, FontStyles.font3]}>{t(ele?.traitType)}</TextM>
                    <TextM style={[styles.leftTitle, fonts.mediumFont]}>{ele?.value}</TextM>
                  </View>
                  <View style={GStyles.flex1} />
                  <TextM style={FontStyles.font5}>{ele?.percent}</TextM>
                </View>
              ))}
            </View>
          )}

          {/* Generation info */}
          {generation && (
            <View style={GStyles.marginTop(pTd(32))}>
              <TextL style={[styles.basicInfoTitle, fonts.mediumFont]}>{t('Generation info')}</TextL>
              <View style={[GStyles.flexRow, styles.rowWrap]}>
                <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Generation')}</TextM>
                <View style={GStyles.flex1} />
                <TextM style={[styles.leftTitle, FontStyles.font5]}>{generation}</TextM>
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
