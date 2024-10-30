import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import ActionSheet from 'components/ActionSheet';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { isCrossChain } from '@portkey-wallet/utils/aelf';
import { useLanguage } from 'i18n/hooks';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { usePin } from 'hooks/store';
import { useCaAddressInfoList, useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
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
import Loading from 'components/Loading';
import { IToSendPreviewParamsType, TransferType } from '@portkey-wallet/types/types-ca/routeParams';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { getAelfTxResult } from '@portkey-wallet/utils/aelf';
import { ZERO } from '@portkey-wallet/constants/misc';
import { sleep } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import {
  useAmountInUsdShow,
  useGetCurrentAccountTokenPrice,
  useIsTokenHasPrice,
} from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import useEffectOnce from 'hooks/useEffectOnce';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { useCheckTransferLimitWithJump } from 'hooks/security';
import {
  CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL,
  useCrossTransferByEtransfer,
} from '@portkey-wallet/hooks/hooks-ca/useWithdrawByETransfer';
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

const SendPreview: React.FC = () => {
  const { t } = useLanguage();
  const isMainnet = useIsMainnet();
  const defaultToken = useDefaultToken();
  const routerParams = useRouterEffectParams<IToSendPreviewParamsType>();

  const {
    sendType,
    assetInfo,
    toInfo,
    transactionFee,
    transactionFeeUnit,
    networkFee,
    networkFeeUnit,
    sendNumber,
    successNavigateName,
    guardiansApproved,
    isAutoSend = false,
    receiveAmount,
    receiveAmountUsd,
    crossChainFee,
    crossChainFeeUnit,
    transferType = TransferType.GENERAL_SAME_CHAIN,
    targetNetwork,
  } = routerParams;

  const { getAELFChainInfoConfig, getEVMChainInfoConfig, getTokenConfig } = useGetEBridgeConfig();

  const isApproved = useMemo(() => guardiansApproved && guardiansApproved.length > 0, [guardiansApproved]);

  useFetchTxFee();
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
  const userInfo = useCurrentUserInfo();
  const portkeyContractRef = useRef<ContractBasic>();
  const tokenContractRef = useRef<ContractBasic>();
  const [tokenPriceObject, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const isTokenHasPrice = useIsTokenHasPrice(assetInfo.symbol);

  const crossTransferByEtransfer = useCrossTransferByEtransfer(pin);
  const isSupportEtransferCross = useMemo(
    () => CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(assetInfo.symbol),
    [assetInfo.symbol],
  );

  const isCrossChainTransfer = isCrossChain(toInfo.address, assetInfo.chainId);
  const checkTransferLimitWithJump = useCheckTransferLimitWithJump();

  const amount = useMemo(
    () => timesDecimals(sendNumber, assetInfo.decimals).toFixed(),
    [assetInfo.decimals, sendNumber],
  );

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

  const getEstimatedTime = useCallback(() => {
    const transferItem = targetNetwork?.serviceList?.find(ele =>
      ele?.serviceName?.toLocaleLowerCase()?.includes('transfer'),
    );
    const bridgeItem = targetNetwork?.serviceList?.find(ele =>
      ele?.serviceName?.toLocaleLowerCase()?.includes('bridge'),
    );

    if (transferType === TransferType.E_TRANSFER) return transferItem?.multiConfirmTime;
    if (transferType === TransferType.E_BRIDGE) return bridgeItem?.multiConfirmTime;
    return '';
  }, [targetNetwork?.serviceList, transferType]);

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

  const transfer = useCallback(async () => {
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
        return CommonToast.fail(sameTransferResult?.error?.message || '');
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
      });
      console.log('crossTransferByEtransferResult', crossTransferByEtransferResult);
      if (!crossTransferByEtransferResult?.transactionId) throw 'Transfer error';
      const txResult = await getAelfTxResult(chainInfo.endPoint, crossTransferByEtransferResult.transactionId);
      console.log(txResult, 'txResult===etransferCrossTransfer');
    } else if (transferType === TransferType.E_BRIDGE) {
      const fromChainInfo = getAELFChainInfoConfig(assetInfo.chainId);
      const toChainInfo = getEVMChainInfoConfig(toInfo.network);
      const tokenEBridgeInfo = getTokenConfig(assetInfo.symbol);
      const bridge = new EBridge({
        fromChainInfo,
        toChainInfo,
        tokenInfo: tokenEBridgeInfo,
      });

      if (!currentWallet.caAddress || !currentWallet.caHash) throw 'currentWallet is null';
      const fee = bridge.getELFFee();
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

    await sleep(1500);

    if (sendType === 'nft') {
      fetchAccountNFTCollectionInfoList({
        caAddressInfos,
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION,
      });
    } else {
      fetchAccountTokenInfoList({
        caAddressInfos,
        skipCount: 0,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
      });
    }
    if (successNavigateName) {
      navigationService.navigate(successNavigateName);
    } else {
      navigationService.navigate('Tab', { clearType: sendType + Math.random() });
    }
    CommonToast.success('success');
  }, [
    amount,
    assetInfo,
    caAddressInfos,
    chainInfo,
    checkTransferLimitWithJump,
    crossDefaultFee,
    crossTransferByEtransfer,
    currentNetwork.walletType,
    currentWallet.caAddress,
    currentWallet.caHash,
    fetchAccountNFTCollectionInfoList,
    fetchAccountTokenInfoList,
    getAELFChainInfoConfig,
    getEVMChainInfoConfig,
    getTokenConfig,
    guardiansApproved,
    isApproved,
    pin,
    routerParams,
    sendNumber,
    sendType,
    successNavigateName,
    targetNetwork?.network,
    toInfo.address,
    toInfo.chainId,
    toInfo.network,
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

      Loading.show();
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
        navigationService.navigate('Tab');
        CommonToast.success('success');
      } catch (error) {
        showRetry(() => {
          retryCrossChain(managerTransferTxId, data);
        });
      } finally {
        Loading.hide();
      }
    },
    [assetInfo.decimals, assetInfo.symbol, assetInfo.tokenContractAddress, chainInfo, dispatch, pin, showRetry],
  );

  // const imSend = useCallback(async () => {
  //   if (!chainInfo || !pin) return;
  //   const account = getManagerAccount(pin);
  //   if (!account) return;

  //   if (!contractRef.current) {
  //     contractRef.current = await getContractBasic({
  //       contractAddress: chainInfo.caContractAddress,
  //       rpcUrl: chainInfo.endPoint,
  //       account,
  //     });
  //   }

  //   if (!contractRef.current || !imTransferInfo?.channelId || !imTransferInfo?.toUserId) return;
  //   Loading.show();
  //   try {
  //     const params = {
  //       channelId: imTransferInfo?.channelId || '',
  //       toUserId: imTransferInfo?.toUserId || '',
  //       chainId: assetInfo.chainId,
  //       symbol: assetInfo.symbol,
  //       amount,
  //       image: '',
  //       memo: '',
  //       type: imTransferInfo.isGroupChat ? TransferTypeEnum.GROUP : TransferTypeEnum.P2P,
  //       caContract: contractRef.current,
  //       tokenContractAddress: assetInfo.tokenContractAddress,
  //       toCAAddress: toInfo.address,
  //       guardiansApproved,
  //     };

  //     await sendIMTransfer(params);
  //     CommonToast.success('Successfully sent');
  //   } catch (error: any) {
  //     const errorMessage = handleErrorMessage(error);
  //     if (errorMessage === 'fetch exceed limit') {
  //       CommonToast.warn('You can view the transfer later in the chat window.');
  //     } else {
  //       CommonToast.failError('Transferred failed');
  //     }
  //     console.log('IM send error', error);
  //   } finally {
  //     if (imTransferInfo.isGroupChat) {
  //       await jumpToChatGroupDetails({ channelUuid: imTransferInfo.channelId });
  //     } else {
  //       await jumpToChatDetails({ channelUuid: imTransferInfo.channelId });
  //     }
  //     Loading.hide();
  //   }
  // }, [
  //   amount,
  //   assetInfo.chainId,
  //   assetInfo.symbol,
  //   assetInfo.tokenContractAddress,
  //   chainInfo,
  //   guardiansApproved,
  //   imTransferInfo?.channelId,
  //   imTransferInfo?.isGroupChat,
  //   imTransferInfo?.toUserId,
  //   jumpToChatDetails,
  //   jumpToChatGroupDetails,
  //   pin,
  //   sendIMTransfer,
  //   toInfo.address,
  // ]);

  const send = useCallback(async () => {
    Loading.show();
    try {
      await transfer();
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
      Loading.hide();
    }
  }, [dispatch, retryCrossChain, showRetry, transfer]);

  const onSend = useCallback(() => {
    send();
    // imTransferInfo ? imSend() : Send();
  }, [send]);

  useFocusEffect(
    useCallback(() => {
      if (!isAutoSend) return;
      onSend();
    }, [isAutoSend, onSend]),
  );

  const networkInfoShow = (address: string) => {
    const chainId = address.split('_')[2] as ChainId;
    return formatChainInfoToShow(chainId);
  };

  useEffectOnce(() => {
    getTokenPrice(assetInfo.symbol);
    getTokenPrice(defaultToken.symbol);
  });

  const isETransferOrEBridge = useMemo(() => {
    return transferType === TransferType.E_TRANSFER || transferType === TransferType.E_BRIDGE;
  }, [transferType]);

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
      actionType={ActionType.SEND}
      footerType={footerType}
      NFTInfo={
        sendType === 'nft'
          ? {
              isSeed: assetInfo.isSeed,
              seedType: assetInfo.seedType,
              imageUrl: assetInfo.imageUrl,
              alias: assetInfo.alias,
              collectionName: assetInfo.collectionName,
              tokenId: assetInfo.tokenId,
            }
          : undefined
      }
      amount={`${formatAmountShow(sendNumber, assetInfo.decimals)} ${assetInfo.label || assetInfo?.symbol}`}
      amountUSD={`${formatAmountUSDShow(ZERO.plus(sendNumber).multipliedBy(tokenPriceObject[assetInfo.symbol]))}`}
      toAddress={toInfo?.address}
      toInfoChainId={toInfo?.chainId}
      destinationNetwork={networkInfoShow(toInfo?.address)}
      destinationNetworkImageUrl={targetNetwork?.imageUrl}
      transactionFee={!isETransferOrEBridge ? `${transactionFee} ${defaultToken.symbol}` : ''}
      transactionFeeUSD={
        !isETransferOrEBridge
          ? `$ ${unitConverter(ZERO.plus(transactionFee || '').multipliedBy(tokenPriceObject[defaultToken.symbol]))}`
          : ''
      }
      estimatedNetworkFee={isETransferOrEBridge ? `${networkFee} ${networkFeeUnit}` : ''}
      estimatedNetworkFeeUSD={
        isETransferOrEBridge
          ? `$ ${unitConverter(ZERO.plus(networkFee || '').multipliedBy(tokenPriceObject[networkFeeUnit || '']))}`
          : ''
      }
      amountToReceive={EstimateAmount.estimateAmount}
      amountToReceiveUSD={EstimateAmount.estimateAmountUsd}
      estimatedDuration={getEstimatedTime()}
    />
  );
};

export default memo(SendPreview);
