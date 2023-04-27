import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatTransferTime } from 'utils';
import { formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';

import { pTd } from 'utils/unit';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { TransactionTypes, transactionTypesMap } from '@portkey-wallet/constants/constants-ca/activity';
import { AmountSign, divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
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
import { HIDDEN_TRANSACTION_TYPES } from '@portkey-wallet/constants/constants-ca/activity';
import { useIsTestnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useGetCurrentAccountTokenPrice, useIsTokenHasPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';

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
  const isTestnet = useIsTestnet();
  const isTokenHasPrice = useIsTokenHasPrice(item?.symbol);

  const pin = usePin();
  const dispatch = useAppDispatch();

  const amountString = useMemo(() => {
    const { amount = '', isReceived, decimals = 8, symbol } = item || {};
    let prefix = ' ';

    if (amount) prefix = isReceived ? AmountSign.PLUS : AmountSign.MINUS;

    return `${prefix} ${formatAmountShow(divDecimals(amount, Number(decimals)))}${symbol ? ' ' + symbol : ''}`;
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
    async (managerTransferTxId: string, data: CrossChainTransferParamsType) => {
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

  return (
    <TouchableOpacity style={itemStyle.itemWrap} onPress={() => onPress?.(item)}>
      <Text style={itemStyle.time}>{formatTransferTime(Number(item?.timestamp) * 1000)}</Text>
      <View style={itemStyle.contentWrap}>
        <CommonAvatar
          style={itemStyle.left}
          svgName={
            HIDDEN_TRANSACTION_TYPES.includes(item?.transactionType as TransactionTypes) ? 'Contract' : 'transfer'
          }
          avatarSize={pTd(32)}
        />

        <View style={itemStyle.center}>
          <Text style={itemStyle.centerType}>
            {item?.transactionType ? transactionTypesMap(item.transactionType, item.nftInfo?.nftId) : ''}
          </Text>
          <Text style={[itemStyle.centerStatus, FontStyles.font3]}>
            {t('From')}
            {':  '}
            {formatStr2EllipsisStr(addressFormat(item?.fromAddress, item?.fromChainId), 10)}
          </Text>

          {item?.transactionType && !HIDDEN_TRANSACTION_TYPES.includes(item?.transactionType) && (
            <Text style={[itemStyle.centerStatus, FontStyles.font3]}>
              {formatChainInfoToShow(item?.fromChainId)}
              {'-->'}
              {formatChainInfoToShow(item?.toChainId)}
            </Text>
          )}
        </View>
        <View style={itemStyle.right}>
          <Text style={[itemStyle.tokenBalance]}>
            {item?.nftInfo?.nftId ? `#${item?.nftInfo?.nftId}` : ''}
            {!item?.nftInfo?.nftId ? amountString : ''}
          </Text>
          {!isTestnet && !item?.nftInfo && (isTokenHasPrice || item?.symbol === null) && (
            <Text style={itemStyle.usdtBalance}>{`$ ${formatAmountShow(
              divDecimals(item?.amount, Number(item?.decimals)).multipliedBy(item ? tokenPriceObject[item?.symbol] : 0),
              2,
            )}`}</Text>
          )}
        </View>
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
    </TouchableOpacity>
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
    marginRight: pTd(18),
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
    lineHeight: pTd(22),
  },
  usdtBalance: {
    textAlign: 'right',
    lineHeight: pTd(16),
    fontSize: pTd(10),
    color: defaultColors.font5,
  },
  right: {
    display: 'flex',
    height: '100%',
    marginTop: pTd(12),
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
