import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { formatChainInfoToShow, getChainIdByAddress } from '@portkey-wallet/utils';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import { usePin } from 'hooks/store';
import { getManagerAccount } from 'utils/redux';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';

import { formatAmountShow, timesDecimals, unitConverter } from '@portkey-wallet/utils/converter';
import { useRouterEffectParams } from '@portkey-wallet/hooks/useRouterParams';
import CommonToast from 'components/CommonToast';
import navigationService from 'utils/navigationService';
import { IToSendPreviewParamsType, TransferType } from '@portkey-wallet/types/types-eoa/routeParams';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { getAelfTxResult, isDIDAelfAddress } from '@portkey-wallet/utils/aelf';
import { ZERO } from '@portkey-wallet/constants/misc';
import { sleep } from '@portkey-wallet/utils';
import { useAmountInUsdShow, useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-eoa/useTokensPrice';
import useEffectOnce from 'hooks/useEffectOnce';
import { useCrossTransferByEtransfer } from '@portkey-wallet/hooks/hooks-eoa/useWithdrawByETransfer';
import { useFocusEffect } from '@react-navigation/native';

import useGetEBridgeConfig from 'hooks/ebridge';
import { EBridge } from '@portkey-wallet/utils/eBridgeEOA';
import { ContractBasic as BaseContractBasic } from '@portkey/contracts';
import SendReceivePreview, { FooterType } from 'components/SendReceivePreview';
import { ActionType } from 'types/common';
import { getEstimatedTime } from '../utils';
import { useGetTokenContract } from 'hooks/contract';
import { useRecent } from '@portkey-wallet/hooks/hooks-eoa/recent';
import { IRecentItem } from '@portkey-wallet/store/store-eoa/recent/type';

import myEvents from 'utils/deviceEvent';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useBalanceByContract } from 'hooks/balanceByContract';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import { ChainId } from '@portkey-wallet/types';

enum ErrorType {
  NO_TOAST = 'noToast',
}

const SendPreview: React.FC = () => {
  const isMainnet = useIsMainnet();
  const { getELFBalanceByContract } = useBalanceByContract();
  const routerParams = useRouterEffectParams<IToSendPreviewParamsType>();
  const currentAccount = useCurrentAccount();
  const getTokenContract = useGetTokenContract();

  const { addRecent } = useRecent();
  const currentChainList = useCurrentChainList();

  console.log('===preview params', routerParams);

  const {
    sendType,
    assetInfo,
    toInfo,
    transactionFee,
    transactionFeeUnit,
    networkFee,
    networkFeeUnit,
    sendNumber,
    isAutoSend = false,
    receiveAmount,
    receiveAmountUsd,
    transferType = TransferType.GENERAL_SAME_CHAIN,
    targetNetwork,
  } = routerParams;

  const defaultToken = useDefaultToken(assetInfo.chainId);

  const [isLoading, setIsLoading] = useState(false);
  const { getAELFChainInfoConfig, getEVMChainInfoConfig, getTokenConfig } = useGetEBridgeConfig();
  const amountInUsdShow = useAmountInUsdShow();
  // const dispatch = useAppCommonDispatch();
  const pin = usePin();
  const chainInfo = useCurrentChain(assetInfo.chainId);
  // const currentWallet = useCurrentWalletInfo();
  // const currentNetwork = useCurrentNetworkInfo();
  // const caAddressInfos = useCaAddressInfoList();
  // const currentChainList = useCurrentChainList();
  // const wallet = useCurrentWalletInfo();
  const tokenContractRef = useRef<ContractBasic>();
  const [tokenPriceObject, getTokenPrice] = useGetCurrentAccountTokenPrice();

  const crossTransferByEtransfer = useCrossTransferByEtransfer(pin);

  const isETransferOrEBridge = useMemo(
    () => transferType === TransferType.E_TRANSFER || transferType === TransferType.E_BRIDGE,
    [transferType],
  );

  const [isError, setIsError] = useState(false);

  const amount = useMemo(
    () => timesDecimals(sendNumber, assetInfo.decimals).toFixed(),
    [assetInfo.decimals, sendNumber],
  );

  const EstimateAmount = useMemo(() => {
    let _amount = sendNumber;

    if (
      ZERO.plus(sendNumber).isLessThanOrEqualTo(transactionFee || '') &&
      assetInfo.symbol === defaultToken.symbol &&
      transferType === TransferType.E_TRANSFER
    ) {
      return {
        estimateAmount: `0 ${assetInfo?.label || assetInfo?.symbol}`,
        estimateAmountUsd: isMainnet ? '$0' : '',
      };
    }

    // adjust etransfer & ebridge
    if (transferType === TransferType.E_BRIDGE || transferType === TransferType.E_TRANSFER) {
      return {
        estimateAmount: `${receiveAmount} ${assetInfo.label || assetInfo.symbol}`,
        estimateAmountUsd: isMainnet ? receiveAmountUsd : '',
      };
    }

    // adjust general transfer
    if (transferType === TransferType.GENERAL_SAME_CHAIN) {
      _amount = formatAmountShow(_amount, Number(assetInfo.decimals));
      const amountUsd = amountInUsdShow(_amount, 0, assetInfo.symbol);

      console.log('GENERAL_SAME_CHAIN', _amount, amountUsd);

      return {
        estimateAmount: `${_amount} ${assetInfo.label || assetInfo.symbol}`,
        estimateAmountUsd: isMainnet ? amountUsd : '',
      };
    }

    const fee = networkFee || 0;
    if (ZERO.plus(sendNumber).isLessThanOrEqualTo(fee) && assetInfo.symbol === defaultToken.symbol) {
      return {
        estimateAmount: `0 ${assetInfo?.label || assetInfo?.symbol}`,
        estimateAmountUsd: isMainnet ? '$0' : '',
      };
    }

    _amount =
      assetInfo.symbol === defaultToken.symbol
        ? formatAmountShow(ZERO.plus(_amount).minus(networkFee || ''), Number(defaultToken.decimals))
        : formatAmountShow(ZERO.plus(_amount), Number(assetInfo.decimals));

    const amountUsd = tokenPriceObject[assetInfo?.symbol] ? amountInUsdShow(_amount, 0, assetInfo.symbol) : '';

    return {
      estimateAmount: `${_amount} ${assetInfo.label || assetInfo.symbol}`,
      estimateAmountUsd: isMainnet ? amountUsd : '',
    };
  }, [
    amountInUsdShow,
    assetInfo.decimals,
    assetInfo.label,
    assetInfo.symbol,
    defaultToken.decimals,
    defaultToken.symbol,
    isMainnet,
    networkFee,
    receiveAmount,
    receiveAmountUsd,
    sendNumber,
    tokenPriceObject,
    transactionFee,
    transferType,
  ]);

  const estimatedTime = useMemo(() => getEstimatedTime(targetNetwork, transferType), [targetNetwork, transferType]);

  const actionAfterTransfer = useCallback(async () => {
    const _chainId = toInfo?.chainId || getChainIdByAddress(toInfo.address);

    const aelfIcon = currentChainList?.find(ele => ele?.chainId === _chainId)?.chainImageUrl;

    const recentItem: IRecentItem = {
      address: toInfo?.address || '',
      chainId: targetNetwork?.network ? undefined : (_chainId as ChainId),
      network: targetNetwork?.network || 'aelf',
      networkIcon: targetNetwork?.imageUrl || aelfIcon,
      transferTime: Date.now(),
    };

    console.log('recent', routerParams, recentItem);

    addRecent({ recentItem });

    if (sendType === 'nft') {
      console.log('wfs====fetchAccountNFTCollectionInfoList3');
      // await fetchAccountNFTCollectionInfoList({
      //   caAddressInfos,
      //   skipCount: 0,
      //   maxResultCount: PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION,
      // });
      console.log('updateNFT!!!!');
      myEvents.updateNFT.emit();
    } else {
      // await fetchAccountTokenInfoList({
      //   caAddressInfos,
      //   skipCount: 0,
      //   maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
      // });
    }
    navigationService.navigate('SendFinishPage', {
      actionType: ActionType.SEND,
      address: toInfo.address,
    });
  }, [
    addRecent,
    currentChainList,
    routerParams,
    sendType,
    targetNetwork?.imageUrl,
    targetNetwork?.network,
    toInfo.address,
    toInfo?.chainId,
  ]);

  const transfer = useCallback(async () => {
    setIsError(false);

    if (!chainInfo || !pin) {
      return;
    }
    const account = getManagerAccount(pin);
    if (!account) {
      return;
    }

    if (!tokenContractRef.current) {
      tokenContractRef.current = await getTokenContract(assetInfo.chainId);
    }

    if (transferType === TransferType.GENERAL_SAME_CHAIN) {
      const result = await tokenContractRef.current.callSendMethod('Transfer', currentAccount?.address || '', {
        to: toInfo.address,
        symbol: assetInfo.symbol,
        amount,
        memo: '',
      });
      console.log('sameTransfer result', result);

      if (result.error) {
        throw result?.error?.message;
      }
      console.log('sameTransferResult', result);
    } else if (transferType === TransferType.E_TRANSFER) {
      let network = '';
      if (isDIDAelfAddress(toInfo.address)) {
        const arr = toInfo.address.split('_');
        network = arr[arr.length - 1];
      } else {
        network = targetNetwork?.network || toInfo?.network || String(toInfo?.chainId);
      }

      const crossTransferByEtransferResult = await crossTransferByEtransfer.withdraw({
        chainId: chainInfo.chainId,
        tokenContract: tokenContractRef.current,
        toAddress: toInfo.address,
        amount: String(sendNumber),
        network,
        tokenInfo: {
          symbol: assetInfo.symbol,
          decimals: Number(assetInfo.decimals),
          address: assetInfo.tokenContractAddress,
        },
        isCheckSymbol: false,
      });
      console.log('crossTransferByEtransferResult', crossTransferByEtransferResult);
      if (!crossTransferByEtransferResult?.transactionId) {
        throw 'Transfer error';
      }
      const txResult = await getAelfTxResult(chainInfo.endPoint, crossTransferByEtransferResult.transactionId);
      console.log(txResult, 'txResult===etransferCrossTransfer');
    } else if (transferType === TransferType.E_BRIDGE) {
      const fromChainInfo = getAELFChainInfoConfig(assetInfo.chainId);
      const toChainInfo = getEVMChainInfoConfig(targetNetwork?.network || toInfo?.network || '');
      const tokenEBridgeInfo = getTokenConfig(assetInfo.symbol);
      const bridge = new EBridge({
        fromChainInfo,
        toChainInfo,
        tokenInfo: tokenEBridgeInfo,
      });

      const fee = await bridge.getELFFee();
      const needElfBalance =
        assetInfo.symbol === defaultToken.symbol
          ? timesDecimals(sendNumber, defaultToken.decimals).plus(fee).toString()
          : fee;
      const elfBalance = (await getELFBalanceByContract(assetInfo.chainId)) || '';
      if (ZERO.plus(needElfBalance).isGreaterThan(elfBalance)) {
        setIsError(true);
        setIsLoading(false);
        throw {
          type: ErrorType.NO_TOAST,
          error: 'No enough fee',
        };
      }

      const limit = bridge.getLimit();
      console.log('fee,limit', fee, limit);

      const createReceiptResult = await bridge.createReceipt({
        tokenContract: tokenContractRef.current as unknown as BaseContractBasic,
        targetAddress: toInfo.address,
        amount: String(sendNumber),
        owner: currentAccount?.address || '',
        account: currentAccount?.address || '',
      });
      console.log(createReceiptResult, 'createReceiptResult===EBridge');
    }
  }, [
    amount,
    assetInfo.chainId,
    assetInfo.decimals,
    assetInfo.symbol,
    assetInfo.tokenContractAddress,
    chainInfo,
    crossTransferByEtransfer,
    currentAccount?.address,
    defaultToken.decimals,
    defaultToken.symbol,
    getAELFChainInfoConfig,
    getELFBalanceByContract,
    getEVMChainInfoConfig,
    getTokenConfig,
    getTokenContract,
    pin,
    sendNumber,
    targetNetwork?.network,
    toInfo.address,
    toInfo?.chainId,
    toInfo?.network,
    transferType,
  ]);

  const send = useCallback(async () => {
    setIsLoading(true);
    try {
      await transfer();
      await sleep(1500);
      await actionAfterTransfer();
    } catch (error: any) {
      console.log('sendHandler: error', error);
      CommonToast.failError(error);
    } finally {
      setIsLoading(false);
    }
  }, [actionAfterTransfer, transfer]);

  // const testSend = useCallback(async () => {
  //   const contract = await getContract(assetInfo.chainId, assetInfo?.tokenContractAddress || assetInfo?.address || '');

  //   console.log('token contract', contract);

  //   const result = await contract.callSendMethod('Transfer', currentAccount?.address || '', {
  //     to: toInfo.address,
  //     symbol: assetInfo.symbol,
  //     amount,
  //     memo: '',
  //   });
  //   console.log('sameTransfer result', result);

  //   if (result.error) {
  //     throw result?.error?.message;
  //   }
  //   console.log('sameTransferResult', result);
  // }, []);

  useFocusEffect(
    useCallback(() => {
      if (!isAutoSend) {
        return;
      }
      send();
    }, [isAutoSend, send]),
  );

  useEffectOnce(() => {
    getTokenPrice(assetInfo.symbol);
    getTokenPrice(defaultToken.symbol);
  });

  const footerType = useMemo(() => {
    switch (transferType) {
      case TransferType.E_TRANSFER:
        return FooterType.E_TRANSFER;
      case TransferType.E_BRIDGE:
        return FooterType.E_BRIDGE;
      default:
        return undefined;
    }
  }, [transferType]);

  const transactionFeeShow = useMemo(() => {
    const result = {
      feeShow: '',
      feeUsdShow: '',
    };
    switch (transferType) {
      case TransferType.E_TRANSFER:
      case TransferType.E_BRIDGE:
        result.feeShow = `${transactionFee} ${transactionFeeUnit}`;
        result.feeUsdShow = `$${unitConverter(
          ZERO.plus(transactionFee || '').multipliedBy(tokenPriceObject[transactionFeeUnit || '']),
        )}`;
        break;
    }
    return result;
  }, [tokenPriceObject, transactionFee, transactionFeeUnit, transferType]);

  return (
    <SendReceivePreview
      isLoading={isLoading}
      isError={isError}
      actionType={ActionType.SEND}
      footerType={footerType}
      NFTInfo={
        sendType === 'nft'
          ? {
              isSeed: assetInfo.isSeed,
              seedType: assetInfo.seedType,
              imageUrl: assetInfo.imageUrl,
              alias: assetInfo.alias,
              collectionName: assetInfo.collectionName || assetInfo.collectionInfo?.collectionName,
              tokenId: assetInfo.tokenId,
            }
          : undefined
      }
      amount={`${formatAmountShow(sendNumber, assetInfo.decimals)} ${assetInfo.label || assetInfo?.symbol}`}
      amountUSD={ZERO.plus(sendNumber).multipliedBy(tokenPriceObject[assetInfo.symbol])}
      toAddress={toInfo?.address}
      toInfoChainId={toInfo?.chainId}
      destinationNetwork={
        isETransferOrEBridge
          ? targetNetwork?.name || formatChainInfoToShow(toInfo?.chainId)
          : formatChainInfoToShow(toInfo?.chainId)
      }
      destinationNetworkImageUrl={targetNetwork?.imageUrl}
      transactionFee={transactionFeeShow.feeShow}
      transactionFeeUSD={transactionFeeShow.feeUsdShow}
      estimatedNetworkFee={`${networkFee} ${networkFeeUnit || 'ELF'}`}
      estimatedNetworkFeeUSD={`$${unitConverter(
        ZERO.plus(networkFee || '').multipliedBy(tokenPriceObject[networkFeeUnit || 'ELF']),
      )}`}
      amountToReceive={EstimateAmount.estimateAmount}
      amountToReceiveUSD={EstimateAmount.estimateAmountUsd}
      estimatedDuration={estimatedTime}
      onPress={send}
    />
  );
};

export default memo(SendPreview);
