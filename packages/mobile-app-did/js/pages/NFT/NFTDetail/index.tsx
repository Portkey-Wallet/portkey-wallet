import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { SeedTypeEnum, NFTItemBaseType } from '@portkey-wallet/types/types-ca/assets';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useNFTItemDetail } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useEffectOnce } from '@portkey-wallet/hooks';
import PortkeySkeleton from 'components/PortkeySkeleton';

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

  const isFetchingTraits = useMemo(() => traitsPercentages?.length === 0, [traitsPercentages?.length]);

  const fetchDetail = useLockCallback(async () => {
    try {
      const result = await fetchNftDetail({
        symbol,
        chainId,
      });
      setNftDetailInfo(pre => ({ ...pre, ...result }));
    } catch (error) {
      console.log('fetchDetail error', error);
    }
  }, [fetchNftDetail, chainId, symbol]);

  useEffectOnce(() => {
    if (traitsPercentages && recommendedRefreshSeconds) {
      fetchDetail();
      timerRef.current = setInterval(async () => {
        await fetchDetail();
      }, recommendedRefreshSeconds * 1000);
    }
  });

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
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
              imageUrl: collectionInfo?.imageUrl || '',
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
          {/* Basic Info */}
          <View>
            <TextL style={[styles.basicInfoTitle, fonts.mediumFont]}>{t('Basic Info')}</TextL>
            <View style={[GStyles.flexRow, styles.rowWrap]}>
              <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Contract address')}</TextM>
              <View style={GStyles.flex(1)} />
              <TextM style={[styles.rightValue, FontStyles.font5]}>
                {formatStr2EllipsisStr(addressFormat(tokenContractAddress, chainId))}
              </TextM>
              <Touchable
                style={[styles.marginLeft8, GStyles.flexCol, styles.copyIconWrap]}
                onPress={async () => await copyText(addressFormat(tokenContractAddress, chainId))}>
                <Svg icon="copy" size={pTd(13)} />
              </Touchable>
            </View>
            <View style={[GStyles.flexRow, styles.rowWrap]}>
              <TextM style={[styles.leftTitle, FontStyles.font3, GStyles.flex(2)]}>{t('Blockchain')}</TextM>
              <View style={styles.blank} />
              <TextM style={[styles.rightValue, FontStyles.font5, GStyles.flex(3)]}>
                {formatChainInfoToShow(chainId)}
              </TextM>
            </View>
            <View style={[GStyles.flexRow, styles.rowWrap]}>
              <TextM style={[styles.leftTitle, FontStyles.font3, GStyles.flex(2)]}>{t('Symbol')}</TextM>
              <View style={styles.blank} />
              <TextM style={[styles.rightValue, styles.rightValue, FontStyles.font5, GStyles.flex(3)]}>{symbol}</TextM>
            </View>
            <View style={[GStyles.flexRow, styles.rowWrap, GStyles.marginBottom(0)]}>
              <TextM style={[styles.leftTitle, FontStyles.font3, GStyles.flex(2)]}>{t('Total supply')}</TextM>
              <View style={styles.blank} />
              <TextM style={[styles.rightValue, FontStyles.font5, GStyles.flex(3)]}>
                {formatTokenAmountShowWithDecimals(totalSupply, decimals)}
              </TextM>
            </View>
          </View>

          {/* Token Creation via This Seed */}
          {isSeed && (
            <View style={GStyles.marginTop(pTd(24))}>
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
              <View style={[GStyles.flexRow, styles.rowWrap, GStyles.marginBottom(0)]}>
                <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Expires')}</TextM>
                <View style={GStyles.flex1} />
                <TextM style={[styles.leftTitle, FontStyles.font5]}>{formatTransferTime(expires)}</TextM>
              </View>
            </View>
          )}

          {/* Traits */}
          {traitsPercentages && (
            <View style={GStyles.marginTop(pTd(24))}>
              <TextL style={[styles.basicInfoTitle, fonts.mediumFont]}>{t('Traits')}</TextL>
              <>
                {isFetchingTraits ? (
                  <>
                    {[1, 2, 3].map((ele, idx) => (
                      <View key={idx} style={[styles.rowWrap, idx === 2 && GStyles.marginBottom(0)]}>
                        <PortkeySkeleton width={pTd(100)} height={pTd(20)} />
                        <View style={styles.verticalBlank} />
                        <PortkeySkeleton width={pTd(140)} height={pTd(20)} />
                      </View>
                    ))}
                  </>
                ) : (
                  <>
                    {traitsPercentages.map((ele, idx) => (
                      <View
                        key={idx}
                        style={[
                          GStyles.flexRow,
                          GStyles.itemCenter,
                          styles.rowWrap,
                          idx === traitsPercentages.length - 1 && GStyles.marginBottom(0),
                        ]}>
                        <View style={GStyles.flex(3)}>
                          <TextM style={[styles.leftTitle, FontStyles.font3]}>{t(ele?.traitType)}</TextM>
                          <View style={styles.verticalBlank} />
                          <TextM style={[styles.leftTitle, fonts.mediumFont]}>{ele?.value}</TextM>
                        </View>
                        <View style={styles.blank} />
                        <TextM style={[styles.rightValue, FontStyles.font5, GStyles.flex(2)]}>{ele?.percent}</TextM>
                      </View>
                    ))}
                  </>
                )}
              </>
            </View>
          )}

          {/* Generation Info */}
          {generation && (
            <View style={GStyles.marginTop(pTd(24))}>
              <TextL style={[styles.basicInfoTitle, fonts.mediumFont]}>{t('Generation Info')}</TextL>
              <View style={[GStyles.flexRow, styles.rowWrap, GStyles.marginBottom(0)]}>
                <TextM style={[styles.leftTitle, FontStyles.font3, GStyles.flex(2)]}>{t('Generation')}</TextM>
                <View style={GStyles.flex1} />
                <TextM style={[styles.rightValue, FontStyles.font5, GStyles.flex(3)]}>{generation}</TextM>
              </View>
            </View>
          )}

          {/* Inscription Info */}
          {inscriptionName && (
            <View style={GStyles.marginTop(pTd(24))}>
              <TextL style={[styles.basicInfoTitle, fonts.mediumFont]}>{t('Inscription Info')}</TextL>
              <View style={[GStyles.flexRow, styles.rowWrap]}>
                <TextM style={[styles.leftTitle, FontStyles.font3, GStyles.flex(2)]}>{t('Inscription Name')}</TextM>
                <View style={styles.blank} />
                <TextM style={[styles.rightValue, FontStyles.font5, GStyles.flex(3)]}>{inscriptionName}</TextM>
              </View>
              <View style={[GStyles.flexRow, styles.rowWrap, GStyles.marginBottom(0)]}>
                <TextM style={[styles.leftTitle, FontStyles.font3, GStyles.flex(2)]}>{t('Limit Per Mint')}</TextM>
                <View style={styles.blank} />
                <TextM style={[styles.rightValue, FontStyles.font5, GStyles.flex(3)]}>{limitPerMint}</TextM>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[GStyles.flexCol, styles.bottomSection]}>
        <TextM
          style={[styles.balance, FontStyles.font5, fonts.mediumFont]}>{`You have: ${formatTokenAmountShowWithDecimals(
          balance,
          decimals,
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
    marginBottom: pTd(12),
  },
  rowWrap: { marginBottom: pTd(12) },
  blank: {
    width: pTd(16),
  },
  verticalBlank: {
    height: pTd(4),
  },
  leftTitle: {},
  rightValue: {
    textAlign: 'right',
  },
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
