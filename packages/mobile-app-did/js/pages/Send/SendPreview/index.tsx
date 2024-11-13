import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import ActionSheet from 'components/ActionSheet';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { useLanguage } from 'i18n/hooks';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { usePin } from 'hooks/store';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getManagerAccount } from 'utils/redux';
import crossChainTransfer, {
  CrossChainTransferIntervalParams,
  intervalCrossChainTransfer,
} from 'utils/transfer/crossChainTransfer';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { formatAmountShow, formatAmountUSDShow, timesDecimals, unitConverter } from '@portkey-wallet/utils/converter';
import sameChainTransfer from 'utils/transfer/sameChainTransfer';
import { addFailedActivity, removeFailedActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { useRouterEffectParams } from '@portkey-wallet/hooks/useRouterParams';
import CommonToast from 'components/CommonToast';
import navigationService from 'utils/navigationService';
import { IToSendPreviewParamsType, TransferType } from '@portkey-wallet/types/types-ca/routeParams';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { getAelfTxResult } from '@portkey-wallet/utils/aelf';
import { ZERO } from '@portkey-wallet/constants/misc';
import { sleep } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import { useAmountInUsdShow, useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import useEffectOnce from 'hooks/useEffectOnce';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { useCheckTransferLimitWithJump } from 'hooks/security';
import { useCrossTransferByEtransfer } from '@portkey-wallet/hooks/hooks-ca/useWithdrawByETransfer';
import { useFocusEffect } from '@react-navigation/native';
import { useAccountNFTCollectionInfo, useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import {
  PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION,
  PAGE_SIZE_IN_ACCOUNT_TOKEN,
} from '@portkey-wallet/constants/constants-ca/assets';
import useGetEBridgeConfig from 'hooks/ebridge';
import { EBridge } from '@portkey-wallet/utils/eBridge';
import { ContractBasic as BaseContractBasic } from '@portkey/contracts';
import SendReceivePreview, { FooterType } from 'components/SendReceivePreview';
import { ActionType } from 'types/common';
import { getEstimatedTime } from '../utils';
import { useGetTokenViewContract } from 'hooks/contract';
import { getELFChainBalance } from '@portkey-wallet/utils/balance';
import { useRecent } from '@portkey-wallet/hooks/hooks-ca/recent';
import { IRecentItem } from '@portkey-wallet/store/store-ca/recent/type';

const SendPreview: React.FC = () => {
  const { t } = useLanguage();
  const isMainnet = useIsMainnet();
  const defaultToken = useDefaultToken();
  const routerParams = useRouterEffectParams<IToSendPreviewParamsType>();
  const getTokenViewContract = useGetTokenViewContract();

  const {
    sendType,
    assetInfo,
    toInfo,
    transactionFee,
    transactionFeeUnit,
    networkFee,
    networkFeeUnit,
    sendNumber,
    guardiansApproved,
    isAutoSend = false,
    receiveAmount,
    receiveAmountUsd,
    transferType = TransferType.GENERAL_SAME_CHAIN,
    targetNetwork,
  } = routerParams;
  useFetchTxFee();
  const [isLoading, setIsLoading] = useState(false);
  const { getAELFChainInfoConfig, getEVMChainInfoConfig, getTokenConfig } = useGetEBridgeConfig();
  const isApproved = useMemo(() => guardiansApproved && guardiansApproved.length > 0, [guardiansApproved]);
  const { crossChain: crossDefaultFee } = useGetTxFee(assetInfo.chainId);
  const amountInUsdShow = useAmountInUsdShow();
  const dispatch = useAppCommonDispatch();
  const pin = usePin();
  const chainInfo = useCurrentChain(assetInfo.chainId);
  const { fetchAccountNFTCollectionInfoList } = useAccountNFTCollectionInfo();
  const { fetchAccountTokenInfoList } = useAccountTokenInfo();
  const currentWallet = useCurrentWalletInfo();
  const currentNetwork = useCurrentNetworkInfo();
  const caAddressInfos = useCaAddressInfoList();
  const wallet = useCurrentWalletInfo();
  const portkeyContractRef = useRef<ContractBasic>();
  const tokenContractRef = useRef<ContractBasic>();
  const [tokenPriceObject, getTokenPrice] = useGetCurrentAccountTokenPrice();

  const crossTransferByEtransfer = useCrossTransferByEtransfer(pin);
  const { addRecent } = useRecent();

  const isETransferOrEBridge = useMemo(
    () => transferType === TransferType.E_TRANSFER || transferType === TransferType.E_BRIDGE,
    [transferType],
  );

  const checkTransferLimitWithJump = useCheckTransferLimitWithJump();
  const [isError, setIsError] = useState(false);

  const amount = useMemo(
    () => timesDecimals(sendNumber, assetInfo.decimals).toFixed(),
    [assetInfo.decimals, sendNumber],
  );

  const EstimateAmount = useMemo(() => {
    // adjust etransfer
    if (
      ZERO.plus(sendNumber).isLessThanOrEqualTo(transactionFee || '') &&
      assetInfo.symbol === defaultToken.symbol &&
      transferType === TransferType.E_TRANSFER
    )
      return {
        estimateAmount: `0 ${assetInfo?.label || assetInfo?.symbol}`,
        estimateAmountUsd: isMainnet ? '$ 0' : '',
      };

    // adjust etransfer & ebridge
    if (transferType === TransferType.E_BRIDGE || transferType === TransferType.E_TRANSFER)
      return {
        estimateAmount: `${receiveAmount} ${assetInfo.label || assetInfo.symbol}`,
        estimateAmountUsd: isMainnet ? receiveAmountUsd : '',
      };

    const fee = (isETransferOrEBridge ? transactionFee : networkFee) || 0;
    if (ZERO.plus(sendNumber).isLessThanOrEqualTo(fee))
      return {
        estimateAmount: `0 ${assetInfo?.label || assetInfo?.symbol}`,
        estimateAmountUsd: isMainnet ? '$ 0' : '',
      };

    let _amount = sendNumber;
    _amount = formatAmountShow(ZERO.plus(_amount).minus(networkFee || ''), Number(defaultToken.decimals));

    const amountUsd = amountInUsdShow(
      ZERO.plus(_amount)
        .minus(networkFee || '')
        .toFixed(),
      0,
      assetInfo.symbol,
    );
    return {
      estimateAmount: `${_amount} ${assetInfo.label || assetInfo.symbol}`,
      estimateAmountUsd: isMainnet ? amountUsd : '',
    };
  }, [
    amountInUsdShow,
    assetInfo.label,
    assetInfo.symbol,
    defaultToken.decimals,
    defaultToken.symbol,
    isETransferOrEBridge,
    isMainnet,
    networkFee,
    receiveAmount,
    receiveAmountUsd,
    sendNumber,
    transactionFee,
    transferType,
  ]);

  const estimatedTime = useMemo(() => getEstimatedTime(targetNetwork, transferType), [targetNetwork, transferType]);

  const getElfBalance = useCallback(async () => {
    const caAddress = wallet?.[assetInfo.chainId]?.caAddress;
    if (!assetInfo || !caAddress) return;
    try {
      const tokenContract = await getTokenViewContract(assetInfo.chainId);
      const _balance = await getELFChainBalance(tokenContract, defaultToken.symbol, caAddress);
      return _balance;
    } catch (error) {
      throw 'fail';
      console.log('init ELF Balance', error);
    }
  }, [assetInfo, defaultToken.symbol, getTokenViewContract, wallet]);

  const showRetry = useCallback(
    (retryFunc: () => void) => {
      ActionSheet.alert({
        title: t('Transaction failed !'),
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

  const actionAfterTransfer = useCallback(async () => {
    const aelfIcon = caAddressInfos?.find(ele => ele?.chainId === toInfo?.chainId)?.chainImageUrl;

    const recentItem: IRecentItem = {
      address: toInfo?.address || '',
      chainId: toInfo?.chainId,
      network: targetNetwork?.network || 'aelf',
      networkIcon: targetNetwork?.imageUrl || aelfIcon,
      transferTime: Date.now(),
    };

    addRecent({ recentItem });

    if (sendType === 'nft') {
      await fetchAccountNFTCollectionInfoList({
        caAddressInfos,
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION,
      });
    } else {
      await fetchAccountTokenInfoList({
        caAddressInfos,
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
      });
    }
    navigationService.navigate('SendFinishPage', {
      actionType: ActionType.SEND,
      address: toInfo.address,
    });
  }, [
    addRecent,
    caAddressInfos,
    fetchAccountNFTCollectionInfoList,
    fetchAccountTokenInfoList,
    sendType,
    targetNetwork?.imageUrl,
    targetNetwork?.network,
    toInfo.address,
    toInfo?.chainId,
  ]);

  const transfer = useCallback(async () => {
    setIsError(false);

    const tokenInfo = {
      symbol: assetInfo.symbol,
      decimals: assetInfo.decimals ?? 0,
      address: assetInfo.tokenContractAddress,
    };

    if (!chainInfo || !pin) return;
    const account = getManagerAccount(pin);
    if (!account) return;

    if (!portkeyContractRef.current) {
      portkeyContractRef.current = await getContractBasic({
        contractAddress: chainInfo.caContractAddress,
        rpcUrl: chainInfo.endPoint,
        account,
      });
    }

    if (!tokenContractRef.current) {
      tokenContractRef.current = await getContractBasic({
        contractAddress: tokenInfo.address,
        rpcUrl: chainInfo.endPoint,
        account,
      });
    }

    // transfer limit check
    if (!isApproved) {
      const checkTransferLimitResult = await checkTransferLimitWithJump({
        caContract: portkeyContractRef.current,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        amount: String(sendNumber),
        chainId: chainInfo.chainId,
        approveMultiLevelParams: {
          successNavigate: {
            name: 'SendPreview',
            params: {
              ...routerParams,
              isAutoSend: true,
            },
          },
        },
      });
      if (!checkTransferLimitResult) return;
    }

    // TODO:change it
    if (transferType === TransferType.GENERAL_SAME_CHAIN) {
      console.log('sameChainTransfers==sendHandler', tokenInfo);
      const sameTransferResult = await sameChainTransfer({
        contract: portkeyContractRef.current,
        tokenInfo: {
          ...assetInfo,
          address: assetInfo?.tokenContractAddress || assetInfo?.address,
        } as unknown as BaseToken,
        caHash: wallet.caHash || '',
        amount,
        toAddress: toInfo.address,
        guardiansApproved,
      });

      if (sameTransferResult.error) {
        throw sameTransferResult?.error?.message;
      }
      console.log('sameTransferResult', sameTransferResult);
    } else if (transferType === TransferType.GENERAL_CROSS_CHAIN) {
      const crossChainTransferResult = await crossChainTransfer({
        tokenContract: tokenContractRef.current,
        contract: portkeyContractRef.current,
        chainType: currentNetwork.walletType ?? 'aelf',
        managerAddress: wallet.address,
        tokenInfo: { ...assetInfo, address: assetInfo.tokenContractAddress } as unknown as BaseToken,
        caHash: wallet.caHash || '',
        amount,
        crossDefaultFee,
        toAddress: toInfo.address,
        guardiansApproved,
      });

      console.log('crossChainTransferResult', crossChainTransferResult);
    } else if (transferType === TransferType.E_TRANSFER) {
      let network = '';
      if (toInfo.address.includes('_')) {
        const arr = toInfo.address.split('_');
        network = arr[arr.length - 1];
      } else {
        network = targetNetwork?.network || toInfo?.network || String(toInfo?.chainId);
      }

      const crossTransferByEtransferResult = await crossTransferByEtransfer.withdraw({
        chainId: chainInfo.chainId,
        tokenContract: tokenContractRef.current,
        portkeyContract: portkeyContractRef.current,
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
      if (!crossTransferByEtransferResult?.transactionId) throw 'Transfer error';
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

      if (!currentWallet.caAddress || !currentWallet.caHash) throw 'currentWallet is null';
      const fee = await bridge.getELFFee();
      const needElfBalance =
        assetInfo.symbol === defaultToken.symbol
          ? timesDecimals(sendNumber, defaultToken.decimals).plus(fee).toString()
          : fee;
      const elfBalance = (await getElfBalance()) || '';
      if (ZERO.plus(needElfBalance).isGreaterThan(elfBalance)) {
        setIsError(true);
        throw 'No enough fee';
      }

      const limit = bridge.getLimit();
      console.log('fee,limit', fee, limit);

      const createReceiptResult = await bridge.createReceipt({
        tokenContract: tokenContractRef.current as unknown as BaseContractBasic,
        portkeyContract: portkeyContractRef.current as unknown as BaseContractBasic,
        targetAddress: toInfo.address,
        amount: String(sendNumber),
        owner: currentWallet.caAddress,
        caHash: currentWallet.caHash,
      });
      console.log(createReceiptResult, 'createReceiptResult===EBridge');
    }
  }, [
    amount,
    assetInfo,
    chainInfo,
    checkTransferLimitWithJump,
    crossDefaultFee,
    crossTransferByEtransfer,
    currentNetwork.walletType,
    currentWallet.caAddress,
    currentWallet.caHash,
    defaultToken.decimals,
    defaultToken.symbol,
    getAELFChainInfoConfig,
    getEVMChainInfoConfig,
    getElfBalance,
    getTokenConfig,
    guardiansApproved,
    isApproved,
    pin,
    routerParams,
    sendNumber,
    targetNetwork?.network,
    toInfo.address,
    toInfo?.chainId,
    toInfo?.network,
    transferType,
    wallet.address,
    wallet.caHash,
  ]);

  const retryCrossChain = useCallback(
    async (managerTransferTxId: string, data: CrossChainTransferIntervalParams) => {
      const tokenInfo = {
        symbol: assetInfo.symbol,
        decimals: assetInfo.decimals ?? 0,
        address: assetInfo.tokenContractAddress,
      };
      if (!chainInfo || !pin) return;
      const account = getManagerAccount(pin);
      if (!account) return;

      setIsLoading(true);
      try {
        if (!tokenContractRef.current) {
          tokenContractRef.current = await getContractBasic({
            contractAddress: tokenInfo.address,
            rpcUrl: chainInfo.endPoint,
            account,
          });
        }
        const tokenContract = tokenContractRef.current;
        await intervalCrossChainTransfer(tokenContract, data);
        dispatch(removeFailedActivity(managerTransferTxId));
        navigationService.navigate('SendFinishPage', {
          actionType: ActionType.SEND,
          address: toInfo.address,
        });
      } catch (error) {
        showRetry(() => {
          retryCrossChain(managerTransferTxId, data);
        });
      } finally {
        setIsLoading(false);
      }
    },
    [
      assetInfo.decimals,
      assetInfo.symbol,
      assetInfo.tokenContractAddress,
      chainInfo,
      dispatch,
      pin,
      showRetry,
      toInfo.address,
    ],
  );

  const send = useCallback(async () => {
    setIsLoading(true);
    try {
      await transfer();
      await sleep(1500);
      await actionAfterTransfer();
    } catch (error: any) {
      console.log('sendHandler: error', error);
      if (error.type === 'managerTransfer') {
        console.log(error);
        CommonToast.failError(error.error);
        return;
      } else if (error.type === 'crossChainTransfer') {
        dispatch(
          addFailedActivity({
            transactionId: error.managerTransferTxId,
            params: error.data,
          }),
        );
        showRetry(() => {
          retryCrossChain(error.managerTransferTxId, error.data);
        });
        return;
      } else {
        CommonToast.failError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [actionAfterTransfer, dispatch, retryCrossChain, showRetry, transfer]);

  useFocusEffect(
    useCallback(() => {
      if (!isAutoSend) return;
      send();
    }, [isAutoSend, send]),
  );

  const networkInfoShow = (address: string) => {
    const chainId = address.split('_')[2] as ChainId;
    return formatChainInfoToShow(chainId);
  };

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
      amountUSD={`${formatAmountUSDShow(ZERO.plus(sendNumber).multipliedBy(tokenPriceObject[assetInfo.symbol]))}`}
      toAddress={toInfo?.address}
      toInfoChainId={toInfo?.chainId}
      destinationNetwork={isETransferOrEBridge ? targetNetwork?.name : formatChainInfoToShow(toInfo?.chainId)}
      destinationNetworkImageUrl={targetNetwork?.imageUrl}
      transactionFee={isETransferOrEBridge ? `${transactionFee} ${transactionFeeUnit}` : ''}
      transactionFeeUSD={
        isETransferOrEBridge
          ? `$ ${unitConverter(
              ZERO.plus(transactionFee || '').multipliedBy(tokenPriceObject[transactionFeeUnit || '']),
            )}`
          : ''
      }
      estimatedNetworkFee={`${networkFee} ${networkFeeUnit}`}
      estimatedNetworkFeeUSD={`$ ${unitConverter(
        ZERO.plus(networkFee || '').multipliedBy(tokenPriceObject[networkFeeUnit || '']),
      )}`}
      amountToReceive={EstimateAmount.estimateAmount}
      amountToReceiveUSD={EstimateAmount.estimateAmountUsd}
      estimatedDuration={estimatedTime}
      onPress={send}
    />
  );
};

export default memo(SendPreview);
