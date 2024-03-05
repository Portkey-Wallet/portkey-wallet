import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatTransferTime } from 'utils';
import { formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';

import { pTd } from 'utils/unit';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { TransactionTypes } from '@portkey-wallet/constants/constants-ca/activity';
import { AmountSign, divDecimals, divDecimalsStr, formatAmountShow } from '@portkey-wallet/utils/converter';
import CommonButton from 'components/CommonButton';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import Loading from 'components/Loading';
import { CrossChainTransferParamsType, intervalCrossChainTransfer } from 'utils/transfer/crossChainTransfer';
import { useAppDispatch } from 'store/hooks';
import { removeFailedActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { getManagerAccount } from 'utils/redux';
import { usePin } from 'hooks/store';
import ActionSheet from 'components/ActionSheet';
import CommonToast from 'components/CommonToast';
import { addressFormat } from '@portkey-wallet/utils';
import CommonAvatar from 'components/CommonAvatar';
import { SHOW_FROM_TRANSACTION_TYPES } from '@portkey-wallet/constants/constants-ca/activity';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useGetCurrentAccountTokenPrice, useIsTokenHasPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import fonts from 'assets/theme/fonts';
import { ZERO } from '@portkey-wallet/constants/misc';
import { getEllipsisTokenShow } from 'pages/Chat/utils/format';
import Touchable from 'components/Touchable';

interface ActivityItemPropsType {
  item?: ActivityItemType;
  onPress?: (item: any) => void;
}

const ActivityItem: React.FC<ActivityItemPropsType> = ({ item, onPress }) => {
  const { t } = useLanguage();
  const activity = useAppCASelector(state => state.activity);
  const tokenContractRef = useRef<ContractBasic>();
  const currentChainList = useCurrentChainList();
  const [tokenPriceObject] = useGetCurrentAccountTokenPrice();
  const isMainnet = useIsMainnet();
  const isTokenHasPrice = useIsTokenHasPrice(item?.symbol);

  const pin = usePin();
  const dispatch = useAppDispatch();

  const amountString = useMemo(() => {
    const { amount = '', isReceived, decimals = 8, symbol } = item || {};
    let prefix = ' ';
    if (amount && !ZERO.isEqualTo(amount)) prefix = isReceived ? AmountSign.PLUS : AmountSign.MINUS;

    const tmpAmount = getEllipsisTokenShow(divDecimalsStr(amount, decimals), symbol || '', 10);

    return `${prefix} ${tmpAmount}`;
  }, [item]);

  const showRetry = useCallback(
    (retryFunc: () => void) => {
      ActionSheet.alert({
        title: t('Transaction failed ！'),
        buttons: [
          {
            title: t('Resend'),
            type: 'solid',
            onPress: () => {
              retryFunc();
            },
          },
        ],
      });
    },
    [t],
  );

  const retryCrossChain = useCallback(
    async (managerTransferTxId: string, data: CrossChainTransferParamsType & { issueChainId: number }) => {
      const chainInfo = currentChainList?.find(chain => chain.chainId === data.tokenInfo.chainId);
      if (!chainInfo || !pin) return;
      const account = getManagerAccount(pin);
      if (!account) return;

      Loading.show();
      try {
        if (!tokenContractRef.current) {
          tokenContractRef.current = await getContractBasic({
            contractAddress: data.tokenInfo.address,
            rpcUrl: chainInfo.endPoint,
            account,
          });
        }
        const tokenContract = tokenContractRef.current;
        await intervalCrossChainTransfer(tokenContract, data);
        dispatch(removeFailedActivity(managerTransferTxId));
        CommonToast.success('success');
      } catch (error) {
        showRetry(() => {
          retryCrossChain(managerTransferTxId, data);
        });
      }
      Loading.hide();
    },
    [currentChainList, dispatch, pin, showRetry],
  );

  const onResend = useCallback(() => {
    const { params } = activity.failedActivityMap[item?.transactionId || ''];
    retryCrossChain(item?.transactionId || '', params);
  }, [activity.failedActivityMap, item?.transactionId, retryCrossChain]);

  const RightDom = useMemo(() => {
    return SHOW_FROM_TRANSACTION_TYPES.includes(item?.transactionType as TransactionTypes) ? (
      <View style={[itemStyle.right]}>
        <Text style={[itemStyle.tokenBalance, fonts.regularFont]}>
          {item?.nftInfo?.nftId ? `#${item?.nftInfo?.nftId}` : amountString}
        </Text>
        <Text style={itemStyle.usdtBalance}>
          {isMainnet && !item?.nftInfo && (isTokenHasPrice || item?.symbol === null)
            ? `$ ${formatAmountShow(
                divDecimals(item?.amount, Number(item?.decimals)).multipliedBy(
                  item ? tokenPriceObject[item?.symbol] : 0,
                ),
                2,
              )}`
            : ''}
        </Text>
        <Text style={itemStyle.usdtBalance} />
      </View>
    ) : (
      <View style={[itemStyle.right]}>
        <Text style={[itemStyle.tokenBalance, fonts.regularFont]}>
          {item?.nftInfo?.nftId ? `#${item?.nftInfo?.nftId}` : amountString}
        </Text>

        {/* TODO : change func formatAmountShow */}
        {isMainnet && !item?.nftInfo && (isTokenHasPrice || item?.symbol === null) && (
          <Text style={itemStyle.usdtBalance}>{`$ ${formatAmountShow(
            divDecimals(item?.amount, Number(item?.decimals)).multipliedBy(item ? tokenPriceObject[item?.symbol] : 0),
            2,
          )}`}</Text>
        )}
      </View>
    );
  }, [amountString, isMainnet, isTokenHasPrice, item, tokenPriceObject]);

  return (
    <Touchable style={itemStyle.itemWrap} onPress={() => onPress?.(item)}>
      <Text style={itemStyle.time}>{formatTransferTime(Number(item?.timestamp) * 1000)}</Text>
      <View style={[itemStyle.contentWrap]}>
        <CommonAvatar
          style={itemStyle.left}
          svgName={item?.listIcon ? undefined : 'transfer'}
          imageUrl={item?.listIcon || ''}
          avatarSize={pTd(32)}
        />

        <View style={itemStyle.center}>
          <Text style={itemStyle.centerType}>{item?.transactionName}</Text>
          {item?.transactionType && SHOW_FROM_TRANSACTION_TYPES.includes(item?.transactionType) && (
            <Text style={[itemStyle.centerStatus, FontStyles.font3]}>
              {`${t('From')}: ${formatStr2EllipsisStr(addressFormat(item?.fromAddress, item?.fromChainId), 10)}`}
            </Text>
          )}
          {item?.transactionType && SHOW_FROM_TRANSACTION_TYPES.includes(item?.transactionType) && (
            <Text style={[itemStyle.centerStatus, FontStyles.font3]}>
              {`${formatChainInfoToShow(item?.fromChainId)}-->${formatChainInfoToShow(item?.toChainId)}`}
            </Text>
          )}
        </View>
        {RightDom}
      </View>
      {activity.failedActivityMap[item?.transactionId || ''] && (
        <View style={itemStyle.btnWrap}>
          <CommonButton
            title="Resend"
            type="primary"
            buttonStyle={itemStyle.resendWrap}
            titleStyle={itemStyle.resendTitle}
            onPress={onResend}
          />
        </View>
      )}
    </Touchable>
  );
};

export default memo(ActivityItem);

const itemStyle = StyleSheet.create({
  itemWrap: {
    ...GStyles.paddingArg(12, 20),
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.bg7,
    backgroundColor: defaultColors.bg1,
  },
  time: {
    fontSize: pTd(10),
    color: defaultColors.font3,
  },
  contentWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: pTd(74),
  },
  left: {
    marginRight: pTd(12),
    width: pTd(32),
    height: pTd(32),
    borderWidth: 0,
    backgroundColor: defaultColors.bg1,
  },
  center: {
    flex: 1,
  },
  centerType: {
    color: defaultColors.font5,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  centerStatus: {
    color: defaultColors.font10,
    marginTop: StyleSheet.hairlineWidth,
    fontSize: pTd(10),
    lineHeight: pTd(16),
  },
  tokenBalance: {
    textAlign: 'right',
    color: defaultColors.font5,
    fontSize: pTd(16),
    maxWidth: pTd(130),
  },
  usdtBalance: {
    textAlign: 'right',
    lineHeight: pTd(16),
    fontSize: pTd(10),
    color: defaultColors.font5,
    height: pTd(16),
  },
  right: {
    display: 'flex',
  },
  tokenName: {
    flex: 1,
  },
  btnWrap: {
    alignItems: 'flex-end',
  },
  resendWrap: {
    height: pTd(24),
    width: pTd(65),
    padding: 0,
  },
  resendTitle: {
    fontSize: pTd(12),
  },
});
