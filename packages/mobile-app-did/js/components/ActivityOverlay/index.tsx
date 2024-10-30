import React, { useState, useCallback, useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { ModalBody } from 'components/ModalBody';
import { ELF_DECIMAL, TransactionTypes } from '@portkey-wallet/constants/constants-ca/activity';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWallet, useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchActivity } from '@portkey-wallet/store/store-ca/activity/api';
import { ActivityItemType, TransactionStatus } from '@portkey-wallet/types/types-ca/activity';
import { addressFormat, formatChainInfoToShow, getExploreLink, handleLoopFetch } from '@portkey-wallet/utils';
import {
  divDecimalsStr,
  formatAmountUSDShow,
  formatTokenAmountShowWithDecimals,
} from '@portkey-wallet/utils/converter';
import { defaultColors, darkColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import { TextL, TextM, TextS, TextXXL } from 'components/CommonText';
import CommonToast from 'components/CommonToast';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import * as Clipboard from 'expo-clipboard';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { formatTransferTime } from '@portkey-wallet/utils/time';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { SHOW_FROM_TRANSACTION_TYPES } from '@portkey-wallet/constants/constants-ca/activity';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { IActivityApiParams } from '@portkey-wallet/store/store-ca/activity/type';
import Lottie from 'lottie-react-native';
import Touchable from 'components/Touchable';
import NFTAvatar from 'components/NFTAvatar';
import { useLanguage } from 'i18n/hooks';
import { useEffectOnce } from '@portkey-wallet/hooks';

const ActivityDetail = (props: ActivityItemType & IActivityApiParams) => {
  const { transactionId = '', blockHash = '', isReceived: isReceivedParams, activityType } = props;
  const { t } = useLanguage();
  const defaultToken = useDefaultToken();
  const isMainnet = useIsMainnet();

  const caAddressesInfoList = useCaAddressInfoList();
  const caAddressInfos = useMemo(() => {
    const result = caAddressesInfoList.filter(item => item.chainId === props?.fromChainId);
    return result?.length > 0 ? result : caAddressesInfoList;
  }, [caAddressesInfoList, props?.fromChainId]);

  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const { currentNetwork } = useCurrentWallet();
  const [initializing, setInitializing] = useState(false);

  const [activityItem, setActivityItem] = useState<ActivityItemType>(props);

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
    const { transactionType, fromChainId, toChainId } = activityItem || {};

    const isNetworkShow = transactionType && SHOW_FROM_TRANSACTION_TYPES.includes(transactionType);

    if (!isNetworkShow) return null;

    return (
      <>
        <View style={styles.flexSpaceBetween}>
          <TextL>{t('Network')}</TextL>
          <View style={styles.networkInfoContent}>
            <TextL>{formatChainInfoToShow(fromChainId, currentNetwork)}</TextL>
            <View style={GStyles.flexRowWrap}>
              <TextL>{` → `}</TextL>
              <TextL>{formatChainInfoToShow(toChainId, currentNetwork)}</TextL>
            </View>
          </View>
        </View>
      </>
    );
  }, [activityItem, currentNetwork, t]);

  const feeUI = useMemo(() => {
    if (activityItem?.isReceived) return null;

    const transactionFees =
      activityItem?.transactionFees?.length === 0
        ? [{ fee: 0, symbol: defaultToken.symbol, feeInUsd: 0 }]
        : activityItem?.transactionFees || [];

    return (
      <View style={[styles.flexSpaceBetween]}>
        <TextL>{t('Network fee')}</TextL>
        {activityItem?.isDelegated ? (
          <View>
            <TextL>{`0 ${defaultToken.symbol}`}</TextL>
            {isMainnet && <TextM>{`$ 0`}</TextM>}
          </View>
        ) : (
          <View>
            {transactionFees.map((item, index) => (
              <View key={index} style={[styles.transactionFeeItemWrap, index > 0 && styles.marginTop8]}>
                <TextL>{`${divDecimalsStr(item?.fee ?? 0, ELF_DECIMAL)} ${item.symbol}`}</TextL>
                {isMainnet && <TextM>{formatAmountUSDShow(item?.feeInUsd)}</TextM>}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }, [
    activityItem?.isDelegated,
    activityItem?.isReceived,
    activityItem?.transactionFees,
    defaultToken.symbol,
    isMainnet,
    t,
  ]);

  const amountShow = useMemo(() => {
    return `${activityItem?.isReceived ? '+' : '-'} ${formatTokenAmountShowWithDecimals(
      activityItem?.amount,
      activityItem?.decimals,
    )} ${activityItem?.symbol || ''}`;
  }, [activityItem?.amount, activityItem?.decimals, activityItem?.isReceived, activityItem?.symbol]);

  useEffectOnce(() => {
    getTokenPrice(activityItem?.symbol);
  });

  const loadingDom = useMemo(
    () => (
      <View style={[GStyles.marginTop(pTd(24)), GStyles.flexRow, GStyles.flexCenter]}>
        <Lottie style={styles.loadingIcon} source={require('assets/lottieFiles/loading.json')} autoPlay loop />
      </View>
    ),
    [],
  );

  const activityDom = useMemo(
    () => (
      <>
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
            </>
          ) : (
            <View style={[GStyles.center]}>
              <TextXXL style={[styles.tokenCount]}>
                {SHOW_FROM_TRANSACTION_TYPES.includes(activityItem?.transactionType as TransactionTypes) && amountShow}
              </TextXXL>
              {isMainnet && (
                <TextM style={styles.usdtCount}>{formatAmountUSDShow(activityItem?.currentTxPriceInUsd)}</TextM>
              )}
            </View>
          ))}
        <View style={[styles.flexSpaceBetween]}>
          <TextL>Date</TextL>
          <TextL>{activityItem && activityItem.timestamp ? formatTransferTime(activityItem?.timestamp) : ''}</TextL>
        </View>
        <View style={[styles.flexSpaceBetween]}>
          <TextL>Status</TextL>
          <TextL style={styles.greenFontColor}>{t(status.text)}</TextL>
        </View>
        {/* from */}
        {activityItem?.transactionType && SHOW_FROM_TRANSACTION_TYPES.includes(activityItem?.transactionType) && (
          <View style={[styles.flexSpaceBetween]}>
            <TextL>From</TextL>
            <View style={styles.fromWrap}>
              {activityItem?.from && <TextL>{activityItem?.from}</TextL>}
              <TextL>
                {formatStr2EllipsisStr(addressFormat(activityItem?.fromAddress, activityItem?.fromChainId))}
              </TextL>
            </View>
          </View>
        )}
        {/* to */}
        {activityItem?.transactionType && SHOW_FROM_TRANSACTION_TYPES.includes(activityItem?.transactionType) && (
          <View style={[styles.flexSpaceBetween]}>
            <TextL>To</TextL>
            <View style={styles.fromWrap}>
              {activityItem?.to && <TextL>{activityItem?.to}</TextL>}
              <TextL>{formatStr2EllipsisStr(addressFormat(activityItem?.toAddress, activityItem?.toChainId))}</TextL>
            </View>
          </View>
        )}
        {networkUI}
        {feeUI}
        {/* TXn */}
        <View style={[styles.flexSpaceBetween]}>
          <TextL>Txn ID</TextL>
          <View style={GStyles.flex1} />
          <TextL>{formatStr2EllipsisStr(transactionId, 10, 'tail')}</TextL>
          {CopyIconUI(transactionId)}
        </View>

        {explorerUrl && (
          <CommonButton
            containerStyle={GStyles.marginTop(8)}
            onPress={() => {
              if (!activityItem?.transactionId) return;

              OverlayModal.hide();
              navigationService.navigate('ViewOnWebView', {
                title: t('View on Explorer'),
                url: getExploreLink(explorerUrl, activityItem?.transactionId || '', 'transaction'),
              });
            }}
            title={t('View on Explorer')}
            type="primary"
          />
        )}
      </>
    ),
    [
      CopyIconUI,
      activityItem,
      amountShow,
      explorerUrl,
      feeUI,
      isMainnet,
      isNft,
      networkUI,
      status.text,
      t,
      transactionId,
    ],
  );

  return (
    <ModalBody modalBodyType="bottom" title={props.transactionName}>
      {initializing ? loadingDom : activityDom}
    </ModalBody>
  );
};

export const showActivityDetail = (props: ActivityItemType & IActivityApiParams) => {
  OverlayModal.show(<ActivityDetail {...props} />, {
    position: 'bottom',
  });
};

export default {
  showActivityDetail,
};

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
    ...fonts.mediumFont,
  },
  usdtCount: {
    color: darkColors.textBase2,
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
    alignItems: 'center',
    minHeight: pTd(54),
    padding: pTd(16),
    width: '100%',
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
  // button: {
  //   marginBottom: pTd(30),
  // },
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
  fromWrap: {
    display: 'flex',
    alignItems: 'flex-end',
  },
});
