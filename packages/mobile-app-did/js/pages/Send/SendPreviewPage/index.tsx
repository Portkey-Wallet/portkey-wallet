import React, { useMemo } from 'react';
import { isCrossChain } from '@portkey-wallet/utils/aelf';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { formatAmountShow, formatAmountUSDShow, unitConverter } from '@portkey-wallet/utils/converter';
import { useRouterEffectParams } from '@portkey-wallet/hooks/useRouterParams';
import { IToSendPreviewParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { ZERO } from '@portkey-wallet/constants/misc';
import { ChainId } from '@portkey-wallet/types';
import {
  useAmountInUsdShow,
  useGetCurrentAccountTokenPrice,
  useIsTokenHasPrice,
} from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import useEffectOnce from 'hooks/useEffectOnce';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL } from '@portkey-wallet/hooks/hooks-ca/useWithdrawByETransfer';
import SendReceivePreview from 'components/SendReceivePreview';
import { ActionType } from 'types/common';

const SendPreviewPage = () => {
  const isMainnet = useIsMainnet();
  const defaultToken = useDefaultToken();

  const routerParams = useRouterEffectParams<IToSendPreviewParamsType>();
  const {
    sendType,
    assetInfo,
    toInfo,
    transactionFee,
    sendNumber,
    receiveAmount,
    receiveAmountUsd,
    isEtransferCrossInLimit = false,
    crossChainFee,
    crossChainFeeUnit,
  } = routerParams;

  useFetchTxFee();
  const { crossChain: crossDefaultFee } = useGetTxFee(assetInfo.chainId);
  const amountInUsdShow = useAmountInUsdShow();

  const [tokenPriceObject, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const isTokenHasPrice = useIsTokenHasPrice(assetInfo.symbol);

  const isSupportEtransferCross = useMemo(
    () => CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(assetInfo.symbol) && isEtransferCrossInLimit,
    [assetInfo.symbol, isEtransferCrossInLimit],
  );

  const isCrossChainTransfer = isCrossChain(toInfo.address, assetInfo.chainId);

  const EstimateAmount = useMemo(() => {
    if (ZERO.plus(sendNumber).isLessThanOrEqualTo(crossChainFee) && assetInfo.symbol === defaultToken.symbol)
      return {
        estimateAmount: `0 ${assetInfo?.label || assetInfo?.symbol}`,
        estimateAmountUsd: isMainnet ? '$ 0' : '',
      };

    let _amount = sendNumber;
    let amountUsd;
    if (receiveAmount) _amount = receiveAmount;
    else _amount = formatAmountShow(ZERO.plus(_amount).minus(crossChainFee), Number(defaultToken.decimals));

    if (receiveAmountUsd) amountUsd = formatAmountUSDShow(receiveAmountUsd);
    else amountUsd = amountInUsdShow(ZERO.plus(_amount).minus(crossChainFee).toFixed(), 0, assetInfo.symbol);

    return {
      estimateAmount: `${_amount} ${assetInfo.label || assetInfo.symbol}`,
      estimateAmountUsd: isMainnet ? amountUsd : '',
    };
  }, [
    amountInUsdShow,
    assetInfo.label,
    assetInfo.symbol,
    crossChainFee,
    defaultToken.decimals,
    defaultToken.symbol,
    isMainnet,
    receiveAmount,
    receiveAmountUsd,
    sendNumber,
  ]);

  const networkInfoShow = (address: string) => {
    const chainId = address.split('_')[2] as ChainId;
    return formatChainInfoToShow(chainId);
  };

  useEffectOnce(() => {
    getTokenPrice(assetInfo.symbol);
    getTokenPrice(defaultToken.symbol);
  });

  return (
    <SendReceivePreview
      actionType={ActionType.SEND}
      NFTInfo={
        sendType === 'nft'
          ? {
              isSeed: assetInfo.isSeed,
              seedType: assetInfo.seedType,
              imageUrl: assetInfo.imageUrl,
              alias: assetInfo.alias,
            }
          : undefined
      }
      amount={`${formatAmountShow(sendNumber, assetInfo.decimals)} ${assetInfo.label || assetInfo?.symbol}`}
      amountUSD={
        isMainnet && isTokenHasPrice
          ? `${formatAmountUSDShow(ZERO.plus(sendNumber).multipliedBy(tokenPriceObject[assetInfo.symbol]))}`
          : ''
      }
      toAddress={toInfo?.address}
      destinationNetwork={networkInfoShow(toInfo?.address)}
      destinationNetworkIcon={require('assets/image/pngs/aelf.png')}
      transactionFee={`${transactionFee} ${defaultToken.symbol}`}
      transactionFeeUSD={
        isMainnet
          ? `$ ${unitConverter(ZERO.plus(transactionFee).multipliedBy(tokenPriceObject[defaultToken.symbol]))}`
          : ''
      }
      estimatedNetworkFee={
        isCrossChainTransfer
          ? isSupportEtransferCross
            ? `${crossChainFee} ${crossChainFeeUnit}`
            : `${unitConverter(crossDefaultFee)} ${defaultToken.symbol}`
          : ''
      }
      estimatedNetworkFeeUSD={
        isCrossChainTransfer && isMainnet
          ? `$ ${unitConverter(ZERO.plus(crossDefaultFee).multipliedBy(tokenPriceObject[defaultToken.symbol]))}`
          : ''
      }
      amountToReceive={
        isCrossChainTransfer && (isSupportEtransferCross || assetInfo.symbol === defaultToken.symbol)
          ? EstimateAmount.estimateAmount
          : ''
      }
      amountToReceiveUSD={
        isCrossChainTransfer && (isSupportEtransferCross || assetInfo.symbol === defaultToken.symbol) && isMainnet
          ? EstimateAmount.estimateAmountUsd
          : ''
      }
    />
  );
};

export default SendPreviewPage;
