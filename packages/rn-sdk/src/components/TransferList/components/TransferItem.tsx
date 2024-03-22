import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import CommonAvatar from '@portkey-wallet/rn-components/components/CommonAvatar';
import { ActivityItemType } from 'network/dto/query';
import { SHOW_FROM_TRANSACTION_TYPES, TransactionTypes } from '@portkey-wallet/constants/constants-ca/activity';
import { ZERO } from '@portkey-wallet/constants/misc';
import { formatStr2EllipsisStr, addressFormat, formatChainInfoToShow } from '@portkey-wallet/utils';
import { formatTransferTime } from '@portkey-wallet/utils/time';
import { AmountSign, divDecimalsStr, formatAmountShow, divDecimals } from '@portkey-wallet/utils/converter';
import { getEllipsisTokenShow } from 'utils/commonUtil';
import { useCommonNetworkInfo } from 'components/TokenOverlay/hooks';
import { useTokenPrices } from 'model/hooks/balance';

interface ActivityItemPropsType {
  item?: ActivityItemType;
  onPress?: (item: any) => void;
}

const ActivityItem: React.FC<ActivityItemPropsType> = ({ item, onPress }) => {
  const { t } = useLanguage();
  const { currentNetwork } = useCommonNetworkInfo();
  const isMainnet = useMemo(() => currentNetwork === 'MAINNET', [currentNetwork]);
  const tokenList = useMemo(() => (item?.symbol ? [item.symbol] : []), [item?.symbol]);
  const { tokenPrices = [] } = useTokenPrices(tokenList);
  const isTokenHasPrice = useMemo(() => {
    return tokenPrices.find(token => token.symbol === item?.symbol) ? true : false;
  }, [item?.symbol, tokenPrices]);

  const amountString = useMemo(() => {
    const { amount = '', isReceived, decimals = 8, symbol } = item || {};
    let prefix = ' ';
    if (amount && !ZERO.isEqualTo(amount)) prefix = isReceived ? AmountSign.PLUS : AmountSign.MINUS;

    const tmpAmount = getEllipsisTokenShow(divDecimalsStr(amount, decimals), symbol || '', 10);

    return `${prefix} ${tmpAmount}`;
  }, [item]);

  // const showRetry = useCallback(
  //   (retryFunc: () => void) => {
  //     ActionSheet.alert({
  //       title: t('Transaction failed !'),
  //       buttons: [
  //         {
  //           title: t('Resend'),
  //           type: 'solid',
  //           onPress: () => {
  //             retryFunc();
  //           },
  //         },
  //       ],
  //     });
  //   },
  //   [t],
  // );

  // const retryCrossChain = useCallback(
  //   async (managerTransferTxId: string, data: CrossChainTransferParamsType) => {
  //     const { privateKey } = wallet || {};
  //     if (!peerUrl || !privateKey) return;
  //     Loading.show();
  //     try {
  //       if (!tokenContractRef.current) {
  //         tokenContractRef.current = await getContractBasic({
  //           contractAddress: data.tokenInfo.address,
  //           rpcUrl: peerUrl,
  //           account: AElfWeb3SDK.getWalletByPrivateKey(privateKey),
  //         });
  //       }
  //       const tokenContract = tokenContractRef.current;
  //       await intervalCrossChainTransfer(tokenContract, data);
  //       dispatch(removeFailedActivity(managerTransferTxId));
  //       CommonToast.success('success');
  //     } catch (error) {
  //       showRetry(() => {
  //         retryCrossChain(managerTransferTxId, data);
  //       });
  //     }
  //     Loading.hide();
  //   },
  //   [peerUrl, showRetry, wallet],
  // );

  // const onResend = useCallback(() => {
  //   const { params } = activity.failedActivityMap[item?.transactionId || ''];
  //   retryCrossChain(item?.transactionId || '', params);
  // }, [activity.failedActivityMap, item?.transactionId, retryCrossChain]);

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
                  item ? tokenPrices.find(token => token.symbol === item?.symbol)?.priceInUsd || 0 : 0,
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
        {isMainnet && !item?.nftInfo && (isTokenHasPrice || item?.symbol === null) && (
          <Text style={itemStyle.usdtBalance}>{`$ ${formatAmountShow(
            divDecimals(item?.amount, Number(item?.decimals)).multipliedBy(
              item ? tokenPrices.find(token => token.symbol === item?.symbol)?.priceInUsd || 0 : 0,
            ),
            2,
          )}`}</Text>
        )}
      </View>
    );
  }, [amountString, isMainnet, isTokenHasPrice, item, tokenPrices]);

  return (
    <TouchableOpacity style={itemStyle.itemWrap} onPress={() => onPress?.(item)}>
      <Text style={itemStyle.time}>{formatTransferTime(Number(item?.timestamp) * 1000)}</Text>
      <View style={[itemStyle.contentWrap]}>
        <CommonAvatar
          style={itemStyle.left}
          // svgName={
          //   SHOW_FROM_TRANSACTION_TYPES.includes(item?.transactionType as TransactionTypes) ? 'transfer' : 'Contract'
          // }
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
      {/* {activity.failedActivityMap[item?.transactionId || ''] && (
        <View style={itemStyle.btnWrap}>
          <CommonButton
            title="Resend"
            type="primary"
            buttonStyle={itemStyle.resendWrap}
            titleStyle={itemStyle.resendTitle}
            onPress={onResend}
          />
        </View>
      )} */}
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
