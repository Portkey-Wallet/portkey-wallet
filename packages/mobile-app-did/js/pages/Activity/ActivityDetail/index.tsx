import { ELF_DECIMAL, TransactionTypes } from '@portkey-wallet/constants/constants-ca/activity';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWallet, useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { fetchActivity } from '@portkey-wallet/store/store-ca/activity/api';
import { ActivityItemType, TransactionStatus } from '@portkey-wallet/types/types-ca/activity';
import { addressFormat, formatChainInfoToShow, getExploreLink, handleLoopFetch } from '@portkey-wallet/utils';
import {
  divDecimalsStr,
  formatAmountUSDShow,
  formatTokenAmountShowWithDecimals,
} from '@portkey-wallet/utils/converter';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import { TextL, TextM, TextS } from 'components/CommonText';
import CommonToast from 'components/CommonToast';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import * as Clipboard from 'expo-clipboard';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useMemo, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { formatTransferTime } from '@portkey-wallet/utils/time';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { SHOW_FROM_TRANSACTION_TYPES } from '@portkey-wallet/constants/constants-ca/activity';
import { useIsTokenHasPrice, useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { IActivityApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import Lottie from 'lottie-react-native';
import Touchable from 'components/Touchable';
import NFTAvatar from 'components/NFTAvatar';

const ActivityDetail = () => {
  const { t } = useLanguage();
  const defaultToken = useDefaultToken();
  const isMainnet = useIsMainnet();
  const activityItemFromRoute = useRouterParams<ActivityItemType & IActivityApiParams>();
  const { transactionId = '', blockHash = '', isReceived: isReceivedParams, activityType } = activityItemFromRoute;
  const caAddressesInfoList = useCaAddressInfoList();
  const caAddressInfos = useMemo(() => {
    const result = caAddressesInfoList.filter(item => item.chainId === activityItemFromRoute?.fromChainId);
    return result?.length > 0 ? result : caAddressesInfoList;
  }, [activityItemFromRoute?.fromChainId, caAddressesInfoList]);

  const isTokenHasPrice = useIsTokenHasPrice(activityItemFromRoute?.symbol);
  const [tokenPriceObject, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const { currentNetwork } = useCurrentWallet();
  const [initializing, setInitializing] = useState(true);

  const [activityItem, setActivityItem] = useState<ActivityItemType>();

  const { explorerUrl } = useCurrentChain(activityItem?.fromChainId) ?? {};

  const getActivityDetail = useCallback(async () => {
    const params = {
      caAddressInfos,
      transactionId,
      blockHash,
      activityType,
    };
    try {
      const res = await handleLoopFetch({
        fetch: () => fetchActivity(params),
        times: 5,
        interval: 1000,
        checkIsContinue: data => !data.transactionId,
      });

      if (isReceivedParams !== undefined) {
        res.isReceived = isReceivedParams;
      }
      setActivityItem(res);
      setInitializing(false);
    } catch (error) {
      CommonToast.fail('This transfer is being processed on the blockchain. Please check the details later.');
    }
  }, [activityType, blockHash, caAddressInfos, isReceivedParams, transactionId]);

  useEffectOnce(() => {
    getActivityDetail();
  });

  const isNft = useMemo(() => !!activityItem?.nftInfo?.nftId, [activityItem?.nftInfo?.nftId]);
  const status = useMemo(() => {
    if (!activityItem?.status) return { text: '', style: 'confirmed' };

    if (activityItem?.status === TransactionStatus.Mined)
      return {
        text: 'Confirmed',
        style: 'confirmed',
      };
    return {
      text: 'Failed',
      style: 'failed',
    };
  }, [activityItem]);

  const copyStr = useCallback(
    async (str: string) => {
      const isCopy = await Clipboard.setStringAsync(str);
      isCopy && CommonToast.success(t('Copy Success'));
    },
    [t],
  );

  const CopyIconUI = useCallback(
    (content: string) => (
      <Touchable style={[styles.marginLeft8, GStyles.flexCol, styles.copyIconWrap]} onPress={() => copyStr(content)}>
        <Svg icon="copy" size={pTd(13)} />
      </Touchable>
    ),
    [copyStr],
  );

  const networkUI = useMemo(() => {
    const { transactionType, fromChainId, toChainId, transactionId: _transactionId = '' } = activityItem || {};

    const isNetworkShow = transactionType && SHOW_FROM_TRANSACTION_TYPES.includes(transactionType);
    return (
      <>
        <View style={styles.section}>
          {isNetworkShow && (
            <View style={[styles.flexSpaceBetween]}>
              <TextM style={[styles.lightGrayFontColor]}>{t('Network')}</TextM>
              <View style={styles.networkInfoContent}>
                <TextM style={[styles.blackFontColor]}>{formatChainInfoToShow(fromChainId, currentNetwork)}</TextM>
                <View style={GStyles.flexRowWrap}>
                  <TextM style={[styles.lightGrayFontColor]}>{` → `}</TextM>
                  <TextM style={[styles.blackFontColor]}>{formatChainInfoToShow(toChainId, currentNetwork)}</TextM>
                </View>
              </View>
            </View>
          )}
          <View style={[styles.flexSpaceBetween, isNetworkShow && styles.marginTop16]}>
            <TextM style={[styles.lightGrayFontColor]}>{t('Transaction ID')}</TextM>
            <View style={GStyles.flex1} />
            <View style={[GStyles.flexRowWrap, styles.alignItemsEnd]}>
              <TextM>{formatStr2EllipsisStr(_transactionId, 10, 'tail')}</TextM>
            </View>
            {CopyIconUI(transactionId)}
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
      </>
    );
  }, [CopyIconUI, activityItem, currentNetwork, t, transactionId]);

  const feeUI = useMemo(() => {
    const transactionFees =
      activityItem?.transactionFees?.length === 0
        ? [{ fee: 0, symbol: defaultToken.symbol, feeInUsd: 0 }]
        : activityItem?.transactionFees || [];

    return (
      <View style={styles.section}>
        <View style={[styles.flexSpaceBetween]}>
          <TextM style={[styles.blackFontColor, styles.fontBold]}>{t('Transaction Fee')}</TextM>
          {activityItem?.isDelegated ? (
            <View style={[styles.transactionFeeItemWrap]}>
              <TextM style={[styles.blackFontColor, styles.fontBold]}>{`0 ${defaultToken.symbol}`}</TextM>
              {isMainnet && <TextS style={[styles.lightGrayFontColor, styles.marginTop4]}>{`$ 0`}</TextS>}
            </View>
          ) : (
            <View>
              {transactionFees.map((item, index) => (
                <View key={index} style={[styles.transactionFeeItemWrap, index > 0 && styles.marginTop8]}>
                  <TextM style={[styles.blackFontColor, styles.fontBold]}>{`${divDecimalsStr(
                    item?.fee ?? 0,
                    ELF_DECIMAL,
                  )} ${item.symbol}`}</TextM>
                  {isMainnet && (
                    <TextS style={[styles.lightGrayFontColor, styles.marginTop4]}>
                      {formatAmountUSDShow(item?.feeInUsd)}
                    </TextS>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }, [activityItem?.isDelegated, activityItem?.transactionFees, defaultToken.symbol, isMainnet, t]);

  const amountShow = useMemo(() => {
    return `${activityItem?.isReceived ? '+' : '-'} ${divDecimalsStr(activityItem?.amount, activityItem?.decimals)} ${
      activityItem?.symbol || ''
    }`;
  }, [activityItem?.amount, activityItem?.decimals, activityItem?.isReceived, activityItem?.symbol]);

  useEffectOnce(() => {
    getTokenPrice(activityItem?.symbol);
  });

  if (initializing)
    return (
      <PageContainer
        hideHeader
        safeAreaColor={['white']}
        containerStyles={styles.containerStyle}
        scrollViewProps={{ disabled: true }}>
        <StatusBar barStyle={'dark-content'} />
        <Touchable style={styles.closeWrap} onPress={() => navigationService.goBack()}>
          <Svg icon="close" size={pTd(16)} />
        </Touchable>
        <View style={[GStyles.marginTop(pTd(24)), GStyles.flexRow, GStyles.flexCenter]}>
          <Lottie style={styles.loadingIcon} source={require('assets/lottieFiles/loading.json')} autoPlay loop />
        </View>
      </PageContainer>
    );

  return (
    <PageContainer
      hideHeader
      safeAreaColor={['white']}
      containerStyles={styles.containerStyle}
      scrollViewProps={{ disabled: true }}>
      <StatusBar barStyle={'dark-content'} />
      <Touchable style={styles.closeWrap} onPress={() => navigationService.goBack()}>
        <Svg icon="close" size={pTd(16)} />
      </Touchable>
      <Text style={[styles.typeTitle]}>{activityItem?.transactionName}</Text>

      {activityItem?.transactionType &&
        SHOW_FROM_TRANSACTION_TYPES.includes(activityItem?.transactionType) &&
        (isNft ? (
          <>
            <View style={styles.topWrap}>
              <NFTAvatar
                disabled
                badgeSizeType="small"
                isSeed={activityItem?.nftInfo?.isSeed}
                seedType={activityItem?.nftInfo?.seedType}
                nftSize={pTd(64)}
                data={{ imageUrl: activityItem?.nftInfo?.imageUrl || '', alias: activityItem?.nftInfo?.alias }}
                style={styles.img}
              />
              <View style={styles.nftInfo}>
                <TextL numberOfLines={1} style={styles.nftTitle}>{`${activityItem?.nftInfo?.alias || ''} #${
                  activityItem?.nftInfo?.nftId || ''
                }  `}</TextL>
                <TextS
                  numberOfLines={1}
                  style={[FontStyles.font3, styles.marginTop4]}>{`Amount: ${formatTokenAmountShowWithDecimals(
                  activityItem?.amount,
                  activityItem?.decimals,
                )}`}</TextS>
              </View>
            </View>
            <View style={styles.divider} />
          </>
        ) : (
          <>
            <Text style={[styles.tokenCount, styles.fontBold]}>
              {SHOW_FROM_TRANSACTION_TYPES.includes(activityItem?.transactionType as TransactionTypes) && amountShow}
            </Text>
            {isMainnet && (
              <Text style={styles.usdtCount}>{formatAmountUSDShow(activityItem?.currentTxPriceInUsd)}</Text>
            )}
          </>
        ))}
      <View style={[styles.flexSpaceBetween, styles.titles1]}>
        <TextM style={styles.lightGrayFontColor}>{t('Status')}</TextM>
        <TextM style={styles.lightGrayFontColor}>{t('Date')}</TextM>
      </View>
      <View style={[styles.flexSpaceBetween, styles.values1]}>
        <TextM style={styles.greenFontColor}>{t(status.text)}</TextM>
        <TextM style={styles.blackFontColor}>
          {activityItem && activityItem.timestamp ? formatTransferTime(activityItem?.timestamp) : ''}
        </TextM>
      </View>
      <View style={styles.card}>
        {/* From */}
        {activityItem?.transactionType && SHOW_FROM_TRANSACTION_TYPES.includes(activityItem?.transactionType) && (
          <>
            <View style={styles.section}>
              <View style={[GStyles.flexRowWrap]}>
                <TextM style={styles.lightGrayFontColor}>{t('From')}</TextM>
                <View style={GStyles.flex1} />
                <View style={[styles.alignItemsEnd, styles.justifyContentCenter]}>
                  {activityItem?.from && <TextM style={styles.blackFontColor}>{activityItem.from}</TextM>}
                  <TextS style={styles.lightGrayFontColor}>
                    {formatStr2EllipsisStr(addressFormat(activityItem?.fromAddress, activityItem?.fromChainId))}
                  </TextS>
                </View>
                {CopyIconUI(addressFormat(activityItem?.fromAddress, activityItem?.fromChainId) || '')}
              </View>
            </View>
            <Text style={[styles.divider, styles.marginTop0]} />
          </>
        )}
        {/* To */}
        {activityItem?.transactionType && SHOW_FROM_TRANSACTION_TYPES.includes(activityItem?.transactionType) && (
          <>
            <View style={styles.section}>
              <View style={[GStyles.flexRowWrap]}>
                <TextM style={[styles.lightGrayFontColor]}>{t('To')}</TextM>
                <View style={GStyles.flex1} />
                <View style={[styles.alignItemsEnd, styles.justifyContentCenter]}>
                  {activityItem?.to && <TextM style={[styles.blackFontColor]}>{activityItem?.to}</TextM>}
                  <TextS style={[styles.lightGrayFontColor]}>
                    {formatStr2EllipsisStr(addressFormat(activityItem?.toAddress, activityItem?.toChainId))}
                  </TextS>
                </View>
                {CopyIconUI(addressFormat(activityItem?.toAddress, activityItem?.toChainId) || '')}
              </View>
            </View>
            <Text style={[styles.divider, styles.marginTop0]} />
          </>
        )}

        {/* more Info */}

        {networkUI}
        {/* transaction Fee */}
        {feeUI}
      </View>
      <View style={styles.space} />
      {explorerUrl && (
        <CommonButton
          containerStyle={[GStyles.marginTop(8), styles.bottomButton]}
          onPress={() => {
            if (!activityItem?.transactionId) return;

            navigationService.navigate('ViewOnWebView', {
              title: t('View on Explorer'),
              url: getExploreLink(explorerUrl, activityItem?.transactionId || '', 'transaction'),
            });
          }}
          title={t('View on Explorer')}
          type="clear"
          style={styles.button}
          buttonStyle={styles.bottomButton}
        />
      )}
    </PageContainer>
  );
};

export default ActivityDetail;

export const styles = StyleSheet.create({
  containerStyle: {
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
    paddingTop: pTd(16),
    display: 'flex',
    alignItems: 'center',
  },
  closeWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  typeIcon: {
    marginTop: pTd(32),
  },
  typeTitle: {
    marginTop: pTd(5),
    marginBottom: pTd(40),
    color: defaultColors.font5,
    fontSize: pTd(20),
    lineHeight: pTd(24),
  },
  tokenCount: {
    fontSize: pTd(28),
    ...fonts.mediumFont,
    color: defaultColors.font5,
  },
  usdtCount: {
    marginTop: pTd(4),
    fontSize: pTd(14),
  },
  topWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    minWidth: '100%',
  },
  img: {
    width: pTd(64),
    height: pTd(64),
    borderRadius: pTd(6),
    marginRight: pTd(16),
  },
  noImg: {
    overflow: 'hidden',
    width: pTd(64),
    height: pTd(64),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg7,
    fontSize: pTd(54),
    lineHeight: pTd(64),
    textAlign: 'center',
    color: defaultColors.font7,
    marginRight: pTd(16),
  },
  topLeft: {
    ...GStyles.flexCol,
    justifyContent: 'center',
  },
  nftInfo: {
    display: 'flex',
    justifyContent: 'center',
  },
  nftTitle: {
    ...fonts.mediumFont,
    color: defaultColors.font5,
    marginBottom: pTd(4),
    maxWidth: pTd(230),
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap',
  },
  flexSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: pTd(20),
    width: '100%',
  },
  titles1: {
    marginTop: pTd(24),
  },
  values1: {
    marginTop: pTd(4),
  },
  divider: {
    marginTop: pTd(24),
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: defaultColors.border1,
  },
  titles2: {
    marginTop: pTd(25),
  },
  values2: {
    marginTop: pTd(4),
  },
  card: {
    marginTop: pTd(24),
    borderRadius: pTd(6),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border1,
    width: '100%',
  },
  section: {
    ...GStyles.paddingArg(16, 12),
  },
  marginTop16: {
    marginTop: pTd(16),
  },
  marginTop8: {
    marginTop: pTd(8),
  },
  marginTop4: {
    marginTop: pTd(4),
  },
  marginTop0: {
    marginTop: 0,
  },
  marginLeft8: {
    marginLeft: pTd(8),
  },
  space: {
    flex: 1,
  },
  button: {
    marginBottom: pTd(30),
  },
  lightGrayFontColor: {
    color: defaultColors.font3,
  },
  blackFontColor: {
    color: defaultColors.font5,
  },
  fontBold: {
    ...fonts.mediumFont,
  },
  greenFontColor: {
    color: defaultColors.font10,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignItemsEnd: {
    alignItems: 'flex-end',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  bottomButton: {
    backgroundColor: defaultColors.bg1,
  },
  networkInfoContent: {
    flexDirection: 'row',
    flexShrink: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginLeft: pTd(20),
  },
  transactionFeeItemWrap: {
    alignItems: 'flex-end',
  },
  copyIconWrap: {
    justifyContent: 'flex-end',
    // backgroundColor: 'red',
    paddingBottom: pTd(3),
  },
  loadingIcon: {
    width: pTd(24),
    height: pTd(24),
  },
});
