import React, { useState, useCallback, useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { ModalBody } from 'components/ModalBody';
import {
  ELF_DECIMAL,
  SHOW_DAPP_TRANSACTION_TYPES,
  TransactionTypes,
} from '@portkey-wallet/constants/constants-ca/activity';
import { useDefaultToken, useExplorerUrl } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import { fetchActivity } from '@portkey-wallet/store/store-eoa/activity/api';
import { ActivityItemType } from '@portkey-wallet/types/types-eoa/activity';
import { addressFormat, getExploreLink, handleLoopFetch } from '@portkey-wallet/utils';
import {
  AmountSign,
  divDecimalsStr,
  formatAmountUSDShow,
  formatTokenAmountShowWithDecimals,
} from '@portkey-wallet/utils/converter';
import { darkColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { TextL, TextM, TextXXL } from 'components/CommonText';
import CommonToast from 'components/CommonToast';
import Svg from 'components/Svg';
import * as Clipboard from 'expo-clipboard';
import { ScrollView, StyleSheet, View } from 'react-native';
import { formatActivityTimeDetailRevamp } from '@portkey-wallet/utils/time';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';
import { SHOW_FROM_TRANSACTION_TYPES } from '@portkey-wallet/constants/constants-eoa/activity';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-eoa/useTokensPrice';
import { IActivityApiParams } from '@portkey-wallet/store/store-eoa/activity/type';
import Lottie from 'lottie-react-native';
import Touchable from 'components/Touchable';
import NFTAvatar from 'components/NFTAvatar';
import { useLanguage } from 'i18n/hooks';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { makeStyles, useTheme } from '@rneui/themed';
import { contractStatusEnum } from '@portkey-wallet/constants/constants-eoa/common';
import CommonAvatar from 'components/CommonAvatar';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useAppEOASelector } from '@portkey-wallet/hooks';
import { CrossChainTransferParamsType, intervalCrossChainTransfer } from 'utils/transfer/crossChainTransfer';
import { useGetTokenContract } from 'hooks/contract';
import { useAppDispatch } from 'store/hooks';
import { removeFailedActivity } from '@portkey-wallet/store/store-eoa/activity/slice';
import { useCurrentAccount, useCurrentAddressInfos } from '@portkey-wallet/hooks/hooks-eoa/wallet';

const ActivityDetail = (props: ActivityItemType & IActivityApiParams) => {
  const { transactionId = '', blockHash = '', isReceived: isReceivedParams, activityType } = props;
  const { address } = useCurrentAccount() ?? { address: '' };
  const { t } = useLanguage();
  const defaultToken = useDefaultToken();
  const isMainnet = useIsMainnet();
  const [resendLoading, setResendLoading] = useState(false);
  const addressesInfoList = useCurrentAddressInfos();
  const caAddressInfos = useMemo(() => {
    let result = addressesInfoList;
    if (address === props.fromAddress) {
      result = addressesInfoList.filter(item => item.chainId === props?.fromChainId);
    } else if (address === props.toAddress) {
      result = addressesInfoList.filter(item => item.chainId === props?.toChainId);
    }
    return result?.length > 0 ? result : addressesInfoList;
  }, [addressesInfoList, props, address]);

  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const [initializing, setInitializing] = useState(false);
  const activity = useAppEOASelector(state => state.activity);
  const [activityItem, setActivityItem] = useState<ActivityItemType>(props);
  const explorerUrl = useExplorerUrl(activityItem?.fromChainId);
  const styles = getStyles();
  const { theme } = useTheme();
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
    getTokenPrice(activityItem?.symbol);
  });
  const showResend = useMemo(
    () => activity.failedActivityMap[activityItem?.transactionId || ''],
    [activity.failedActivityMap, activityItem?.transactionId],
  );
  const dispatch = useAppDispatch();
  const isEmptyToken = useMemo(
    () => !(activityItem?.nftInfo || activityItem?.symbol || activityItem?.operations?.length),
    [activityItem?.nftInfo, activityItem?.operations?.length, activityItem?.symbol],
  );
  const isDappTx = useMemo(() => !!activityItem?.dappName, [activityItem?.dappName]);
  const isShowEmptyTokenForDapp = useMemo(() => isEmptyToken && isDappTx, [isDappTx, isEmptyToken]);
  const isShowSystemForDefault = useMemo(() => isEmptyToken && !isDappTx, [isDappTx, isEmptyToken]);
  const isMultiTokenTx = useMemo(
    () => activityItem?.operations?.length && activityItem.operations.length >= 2,
    [activityItem?.operations?.length],
  );
  const getTokenContract = useGetTokenContract();

  const retryCrossChain = useCallback(
    async (managerTransferTxId: string, data: CrossChainTransferParamsType & { issueChainId: number }) => {
      setResendLoading(true);
      try {
        const tokenContract = await getTokenContract(data.tokenInfo.chainId);
        await intervalCrossChainTransfer(tokenContract, data);
        dispatch(removeFailedActivity(managerTransferTxId));
      } catch (error) {
        CommonToast.fail('Transaction failed !');
      }
      setResendLoading(false);
    },
    [dispatch, getTokenContract],
  );

  const onResend = useCallback(() => {
    const { params } = activity.failedActivityMap[activityItem?.transactionId || ''];
    retryCrossChain(activityItem?.transactionId || '', params);
  }, [activity.failedActivityMap, activityItem?.transactionId, retryCrossChain]);

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
    [copyStr, styles.copyIconWrap, styles.marginLeft8],
  );

  const amountShowUI = useMemo(() => {
    const { amount = '', isReceived, decimals = 8, symbol, nftInfo } = activityItem || {};
    let prefix = ' ';
    if (amount && !ZERO.isEqualTo(amount)) {
      prefix = isReceived ? AmountSign.PLUS : AmountSign.MINUS;
    }
    const suffix = nftInfo?.alias || symbol || '';

    return (
      <TextXXL
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[fonts.BGMediumFont, { color: isReceived ? darkColors.textSuccess1 : darkColors.textBase1 }]}>
        {`${prefix}${formatTokenAmountShowWithDecimals(activityItem?.amount, decimals)} ${suffix}`}
      </TextXXL>
    );
  }, [activityItem]);

  const modalTitle = useMemo(() => {
    if (isShowSystemForDefault) {
      return 'Wallet activity';
    }
    return activityItem.transactionName;
  }, [activityItem.transactionName, isShowSystemForDefault]);

  const barUI = useMemo(() => {
    return <View style={styles.bar} />;
  }, [styles.bar]);

  const amountShow = useMemo(() => {
    return `${activityItem?.isReceived ? '+' : '-'} ${formatTokenAmountShowWithDecimals(
      activityItem?.amount,
      activityItem?.decimals,
    )} ${activityItem?.symbol || ''}`;
  }, [activityItem?.amount, activityItem?.decimals, activityItem?.isReceived, activityItem?.symbol]);

  const dateUI = useMemo(() => {
    return (
      <View style={[styles.flexSpaceBetween]}>
        <TextL>Date</TextL>
        <TextL style={fonts.SGMediumFont}>
          {activityItem && activityItem.timestamp ? formatActivityTimeDetailRevamp(activityItem?.timestamp) : ''}
        </TextL>
      </View>
    );
  }, [activityItem, styles.flexSpaceBetween]);

  const statusUI = useMemo(() => {
    let textStyle = {
      text: '',
      style: '',
    };
    if (activityItem?.status === contractStatusEnum.MINED) {
      textStyle = {
        text: t('Success'),
        style: theme.colors.textSuccess1,
      };
    } else if (activityItem?.status === contractStatusEnum.PENDING) {
      textStyle = {
        text: t('Pending'),
        style: theme.colors.textWarning1,
      };
    } else if (activityItem?.status === contractStatusEnum.FAILED) {
      textStyle = {
        text: t('Failed'),
        style: theme.colors.textDanger2,
      };
    }
    if (textStyle.text) {
      return (
        <View style={[styles.flexSpaceBetween]}>
          <TextL>Status</TextL>
          <TextL style={[fonts.SGMediumFont, { color: textStyle.style }]}>{textStyle.text}</TextL>
        </View>
      );
    }
    return <></>;
  }, [activityItem?.status, styles, t, theme]);

  const fromOrToUI = useMemo(() => {
    if (activityItem?.dappName) {
      return <></>;
    }
    if (activityItem?.transactionType && SHOW_FROM_TRANSACTION_TYPES.includes(activityItem?.transactionType)) {
      return activityItem.isReceived ? (
        <View style={[styles.flexSpaceBetween]}>
          <TextL>From</TextL>
          <View style={styles.fromWrap}>
            {activityItem?.from && <TextL style={fonts.SGMediumFont}>{activityItem?.from}</TextL>}
            <TextL style={fonts.SGMediumFont}>
              {formatStr2EllipsisStr(addressFormat(activityItem?.fromAddress, activityItem?.fromChainId))}
            </TextL>
          </View>
        </View>
      ) : (
        <View style={[styles.flexSpaceBetween]}>
          <TextL>To</TextL>
          <View style={styles.fromWrap}>
            {activityItem?.to && <TextL style={fonts.SGMediumFont}>{activityItem?.to}</TextL>}
            <TextL style={fonts.SGMediumFont}>
              {formatStr2EllipsisStr(addressFormat(activityItem?.toAddress, activityItem?.toChainId))}
            </TextL>
          </View>
        </View>
      );
    }
    return <></>;
  }, [activityItem, styles]);

  const networkUI = useMemo(() => {
    const { transactionType, fromChainIdUpdated, toChainIdUpdated, fromChainIcon, toChainIcon } = activityItem || {};
    const isNetworkShow = transactionType && SHOW_FROM_TRANSACTION_TYPES.includes(transactionType);
    if (!isNetworkShow) {
      return null;
    }
    return (
      <>
        <View style={styles.flexSpaceBetween}>
          <TextL>{t('Source network')}</TextL>
          <View style={[GStyles.flexRow, GStyles.flexCenter, GStyles.itemCenter]}>
            <CommonAvatar
              imageUrl={fromChainIcon || ''}
              title={fromChainIdUpdated}
              avatarSize={pTd(18)}
              titleStyle={styles.avatarTitleStyle}
            />
            <TextL style={[fonts.SGMediumFont, styles.marginLeft4, GStyles.alignCenter, { lineHeight: pTd(22) }]}>
              {fromChainIdUpdated}
            </TextL>
          </View>
        </View>
        <View style={styles.flexSpaceBetween}>
          <TextL>{t('Destination network')}</TextL>
          <View style={[GStyles.flexRow, GStyles.flexCenter, GStyles.itemCenter]}>
            <CommonAvatar
              imageUrl={toChainIcon || ''}
              title={toChainIdUpdated}
              avatarSize={pTd(18)}
              titleStyle={styles.avatarTitleStyle}
            />
            <TextL style={[fonts.SGMediumFont, styles.marginLeft4, GStyles.alignCenter, { lineHeight: pTd(22) }]}>
              {toChainIdUpdated}
            </TextL>
          </View>
        </View>
      </>
    );
  }, [activityItem, styles.avatarTitleStyle, styles.flexSpaceBetween, styles.marginLeft4, t]);

  const feeUI = useMemo(() => {
    if (activityItem?.isReceived) {
      return null;
    }

    const transactionFees =
      activityItem?.transactionFees?.length === 0
        ? [{ fee: 0, symbol: defaultToken.symbol, feeInUsd: 0 }]
        : activityItem?.transactionFees || [];

    return (
      <View style={[styles.flexSpaceBetween]}>
        <TextL>{t('Network fee')}</TextL>
        {activityItem?.isDelegated ? (
          <View style={styles.transactionFeeItemWrap}>
            <TextL style={fonts.SGMediumFont}>{`0 ${defaultToken.symbol}`}</TextL>
            {isMainnet && <TextM style={styles.usdtCount}>{'$0'}</TextM>}
          </View>
        ) : (
          <View>
            {transactionFees.map((item, index) => (
              <View key={index} style={[styles.transactionFeeItemWrap, index > 0 && styles.marginTop8]}>
                <TextL style={fonts.SGMediumFont}>{`${divDecimalsStr(item?.fee ?? 0, ELF_DECIMAL)} ${
                  item.symbol
                }`}</TextL>
                {isMainnet && <TextM style={styles.usdtCount}>{formatAmountUSDShow(item?.feeInUsd)}</TextM>}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }, [activityItem, defaultToken.symbol, isMainnet, styles, t]);

  const tXIDUI = useMemo(() => {
    return (
      <View style={[styles.flexSpaceBetween]}>
        <TextL>Txn ID</TextL>
        <View style={GStyles.flex1} />
        <TextL style={fonts.SGMediumFont}>{formatStr2EllipsisStr(transactionId, 10, 'tail')}</TextL>
        {CopyIconUI(transactionId)}
      </View>
    );
  }, [CopyIconUI, styles.flexSpaceBetween, transactionId]);

  const dappTXDetailUI = useMemo(() => {
    if (
      isMultiTokenTx &&
      activityItem.dappName &&
      activityItem?.transactionType &&
      SHOW_DAPP_TRANSACTION_TYPES.includes(activityItem.transactionType)
    ) {
      let [tokenPaid, tokenReceived] =
        activityItem.operations?.map(_token => ({
          symbol: _token.nftInfo ? _token.nftInfo.alias : _token.symbol,
          url: _token.nftInfo ? _token.nftInfo.imageUrl : _token.icon,
          isReceived: _token.isReceived,
          amount: _token.amount,
          decimals: _token.decimals,
        })) || [];
      if (tokenPaid.isReceived) {
        [tokenPaid, tokenReceived] = [tokenReceived, tokenPaid];
      }
      return (
        <>
          {barUI}
          <View style={[styles.flexSpaceBetween]}>
            <TextL>Provider</TextL>
            <TextL style={fonts.SGMediumFont}>{activityItem.dappName}</TextL>
          </View>
          <View style={[styles.flexSpaceBetween]}>
            <TextL>You paid</TextL>
            <TextL
              style={[
                fonts.SGMediumFont,
                { color: tokenPaid?.isReceived ? theme.colors.textSuccess1 : theme.colors.textBase1 },
              ]}>
              {`${tokenPaid?.isReceived ? '+' : '-'} ${formatTokenAmountShowWithDecimals(
                tokenPaid?.amount,
                tokenPaid?.decimals,
              )} ${tokenPaid?.symbol || ''}`}
            </TextL>
          </View>
          <View style={[styles.flexSpaceBetween]}>
            <TextL>You received</TextL>
            <TextL
              style={[
                fonts.SGMediumFont,
                { color: tokenReceived?.isReceived ? theme.colors.textSuccess1 : theme.colors.textBase1 },
              ]}>
              {`${tokenReceived?.isReceived ? '+' : '-'} ${formatTokenAmountShowWithDecimals(
                tokenReceived?.amount,
                tokenReceived?.decimals,
              )} ${tokenReceived?.symbol || ''}`}
            </TextL>
          </View>
        </>
      );
    }
    return <></>;
  }, [activityItem, barUI, isMultiTokenTx, styles, theme]);

  const loadingDom = useMemo(
    () => (
      <View style={[GStyles.marginTop(pTd(24)), GStyles.flexRow, GStyles.flexCenter]}>
        <Lottie style={styles.loadingIcon} source={require('assets/lottieFiles/loading.json')} autoPlay loop />
      </View>
    ),
    [styles.loadingIcon],
  );

  const txIconShow = useMemo(() => {
    if (isShowEmptyTokenForDapp) {
      return (
        <View style={styles.topIconWrap}>
          <CommonAvatar
            title={activityItem?.dappName || 'Unknown'}
            svgName={activityItem?.dappName ? undefined : 'transfer'}
            imageUrl={activityItem?.dappIcon || ''}
            avatarSize={pTd(60)}
            hasBorder
            titleStyle={styles.avatarTitleStyle}
            borderStyle={GStyles.hairlineBorder}
          />
          <TextXXL style={[fonts.BGMediumFont, styles.marginTop8]}>{activityItem.transactionName}</TextXXL>
        </View>
      );
    }
    if (isShowSystemForDefault) {
      return (
        <View style={[styles.topIconWrap]}>
          {activityItem?.sourceIcon ? (
            <View style={styles.cornerMarkWrap}>
              <CommonAvatar
                title={activityItem?.transactionName}
                svgName={activityItem?.listIcon ? undefined : 'transfer'}
                imageUrl={activityItem?.listIcon || ''}
                avatarSize={pTd(60)}
                titleStyle={styles.avatarTitleStyle}
              />
              <View style={styles.cornerMark}>
                <CommonAvatar
                  imageUrl={activityItem.sourceIcon}
                  avatarSize={pTd(24)}
                  titleStyle={styles.avatarTitleStyle}
                  borderStyle={GStyles.hairlineBorder}
                />
              </View>
            </View>
          ) : (
            <CommonAvatar
              title={activityItem?.transactionName}
              svgName={activityItem?.listIcon ? undefined : 'transfer'}
              imageUrl={activityItem?.listIcon || ''}
              avatarSize={pTd(60)}
              titleStyle={styles.avatarTitleStyle}
            />
          )}
          <TextXXL style={[fonts.BGMediumFont, styles.marginTop8]}>{activityItem.transactionName}</TextXXL>
        </View>
      );
    }
    if (isMultiTokenTx) {
      const { operations = [] } = activityItem || {};
      let [tokenTop, tokenBottom] = operations.map(_token => ({
        symbol: _token.nftInfo ? _token.nftInfo.alias : _token.symbol,
        url: _token.nftInfo ? _token.nftInfo.imageUrl : _token.icon,
        isReceived: _token.isReceived,
        amount: _token.amount,
        decimals: _token.decimals,
      }));
      const sameDirection = tokenTop.isReceived === tokenBottom.isReceived;
      if (!sameDirection && !tokenTop.isReceived) {
        [tokenBottom, tokenTop] = [tokenTop, tokenBottom];
      }
      let renderTopIconInfo = { imageUrl: tokenTop.url, title: tokenTop.symbol };
      let renderBottomIconInfo = { imageUrl: tokenBottom.url, title: tokenBottom.symbol };
      if (!sameDirection) {
        [renderTopIconInfo, renderBottomIconInfo] = [renderBottomIconInfo, renderTopIconInfo];
      }
      return (
        <View style={styles.topIconWrap}>
          <View style={styles.doubleIconWrap}>
            <CommonAvatar {...renderTopIconInfo} avatarSize={pTd(42)} style={styles.avatar1} />
            <CommonAvatar {...renderBottomIconInfo} avatarSize={pTd(42)} style={styles.avatar2} />
          </View>
          <View style={[styles.multiTokenTitle]}>
            <TextXXL style={[fonts.BGMediumFont]}>{tokenBottom.symbol}</TextXXL>
            <CommonAvatar svgName="arrow-down-thin" style={styles.arrowIcon} avatarSize={pTd(16)} />
            <TextXXL style={[fonts.BGMediumFont]}>{tokenTop.symbol}</TextXXL>
          </View>
        </View>
      );
    }
    if (activityItem?.nftInfo) {
      return (
        <View style={styles.topIconWrap}>
          <NFTAvatar
            disabled
            isSeed={activityItem.nftInfo?.isSeed}
            seedType={activityItem.nftInfo?.seedType}
            nftSize={pTd(60)}
            badgeSizeType="small"
            data={{ imageUrl: activityItem?.nftInfo?.imageUrl || '', alias: activityItem?.nftInfo?.alias }}
            style={styles.nftImg}
          />
          <View style={styles.marginTop8}>{amountShowUI}</View>
          <View>
            <TextM style={styles.usdtCount} numberOfLines={1}>{`${activityItem?.nftInfo?.alias || ''} #${
              activityItem?.nftInfo?.nftId || ''
            }`}</TextM>
          </View>
        </View>
      );
    }
    const isTransferType = SHOW_FROM_TRANSACTION_TYPES.includes(activityItem.transactionType);
    return (
      <View style={styles.topIconWrap}>
        {isTransferType ? (
          <View style={styles.cornerMarkWrap}>
            <CommonAvatar
              svgName={activityItem?.listIcon ? undefined : 'transfer'}
              imageUrl={activityItem?.listIcon || ''}
              title={activityItem.transactionName}
              style={styles.cornerMarkSymbolIcon}
              avatarSize={pTd(60)}
              hasBorder
              titleStyle={styles.avatarTitleStyle}
            />
            <View style={styles.cornerMark}>
              <CommonAvatar
                svgName={activityItem.isReceived ? 'arrow-down-thin' : 'send-thin'}
                style={styles.cornerMarkIcon}
                avatarSize={pTd(16)}
                titleStyle={styles.avatarTitleStyle}
                borderStyle={GStyles.hairlineBorder}
              />
            </View>
          </View>
        ) : (
          <CommonAvatar
            svgName={activityItem?.listIcon ? undefined : 'transfer'}
            imageUrl={activityItem?.listIcon || ''}
            title={activityItem.transactionName}
            avatarSize={pTd(60)}
            hasBorder
            titleStyle={styles.avatarTitleStyle}
            borderStyle={GStyles.hairlineBorder}
          />
        )}
        <View style={[GStyles.center, styles.marginTop8]}>
          <TextXXL
            style={[
              styles.tokenCount,
              fonts.BGMediumFont,
              { color: activityItem?.isReceived ? theme.colors.textSuccess1 : theme.colors.textBase1 },
            ]}>
            {SHOW_FROM_TRANSACTION_TYPES.includes(activityItem?.transactionType as TransactionTypes) && amountShow}
          </TextXXL>
        </View>
        {isMainnet && (
          <View>
            <TextM style={styles.usdtCount}>{formatAmountUSDShow(activityItem?.currentTxPriceInUsd)}</TextM>
          </View>
        )}
      </View>
    );
  }, [
    theme,
    activityItem,
    amountShow,
    amountShowUI,
    isMainnet,
    isMultiTokenTx,
    isShowEmptyTokenForDapp,
    isShowSystemForDefault,
    styles,
  ]);

  const reSendBtn = useMemo(() => {
    return showResend ? (
      <CommonButton
        containerStyle={GStyles.marginArg(12, 16, 0, 16)}
        onPress={onResend}
        loading={resendLoading}
        title={t('Resend')}
        type="primary"
      />
    ) : (
      <></>
    );
  }, [onResend, resendLoading, showResend, t]);

  const viewOnExpBtn = useMemo(() => {
    return explorerUrl ? (
      <CommonButton
        containerStyle={GStyles.marginArg(12, 16, 0, 16)}
        onPress={() => {
          if (!activityItem?.transactionId) {
            return;
          }

          OverlayModal.hide();
          navigationService.navigate('ViewOnWebView', {
            title: t('View on Explorer'),
            url: getExploreLink(explorerUrl, activityItem?.transactionId || '', 'transaction'),
          });
        }}
        title={t('View on Explorer')}
        type={showResend ? 'outline' : 'primary'}
      />
    ) : (
      <></>
    );
  }, [activityItem?.transactionId, explorerUrl, showResend, t]);

  const activityDom = useMemo(
    () => (
      <>
        <ScrollView>
          {txIconShow}
          {dateUI}
          {statusUI}
          {fromOrToUI}
          {networkUI}
          {feeUI}
          {tXIDUI}
          {dappTXDetailUI}
        </ScrollView>
        {reSendBtn}
        {viewOnExpBtn}
      </>
    ),
    [dateUI, feeUI, fromOrToUI, reSendBtn, dappTXDetailUI, networkUI, statusUI, tXIDUI, txIconShow, viewOnExpBtn],
  );

  return (
    <ModalBody modalBodyType="bottom" title={modalTitle}>
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

export const getStyles = makeStyles(theme => ({
  tokenCount: {
    ...fonts.mediumFont,
  },
  usdtCount: {
    color: theme.colors.textBase2,
  },
  topIconWrap: {
    marginTop: pTd(12),
    marginBottom: pTd(12),
    paddingTop: pTd(16),
    paddingBottom: pTd(16),
    width: '100%',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nftImg: {
    width: pTd(60),
    height: pTd(60),
    borderRadius: pTd(8),
  },
  nftInfo: {
    display: 'flex',
    justifyContent: 'center',
  },
  doubleIconWrap: {
    width: pTd(60),
    height: pTd(60),
    position: 'relative',
  },
  avatar1: {
    position: 'absolute',
    zIndex: 100,
    left: 0,
    top: 0,
  },
  avatar2: {
    position: 'absolute',
    zIndex: 101,
    right: 0,
    bottom: 0,
  },
  flexSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: pTd(54),
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    width: '100%',
  },
  marginTop8: {
    marginTop: pTd(8),
  },
  marginLeft8: {
    marginLeft: pTd(8),
  },
  marginLeft4: {
    marginLeft: pTd(4),
  },
  space: {
    flex: 1,
  },
  transactionFeeItemWrap: {
    alignItems: 'flex-end',
  },
  copyIconWrap: {
    justifyContent: 'flex-end',
  },
  fromWrap: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  loadingIcon: {
    width: pTd(30),
  },
  avatarTitleStyle: {
    fontSize: pTd(16),
    color: theme.colors.font11,
  },
  cornerMarkWrap: {
    width: pTd(60),
    height: pTd(60),
    position: 'relative',
  },
  cornerMarkSymbolIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border8,
  },
  cornerMark: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: pTd(24),
    height: pTd(24),
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.bgBrand2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(12),
  },
  cornerMarkIcon: {
    backgroundColor: theme.colors.bgBrand2,
    borderColor: theme.colors.borderBase1,
  },
  multiTokenTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: pTd(8),
    marginHorizontal: pTd(4),
  },
  arrowIcon: {
    backgroundColor: theme.colors.bgBase1,
    transform: [{ rotate: '-90deg' }],
  },
  bar: {
    marginTop: pTd(12),
    height: pTd(12),
    marginHorizontal: pTd(16),
    borderTopColor: theme.colors.borderBase1,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
}));
