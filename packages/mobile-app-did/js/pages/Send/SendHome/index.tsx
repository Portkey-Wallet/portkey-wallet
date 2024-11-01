import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { getStyles } from './style';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { ZERO } from '@portkey-wallet/constants/misc';
import { getEntireDIDAelfAddress } from '@portkey-wallet/utils/aelf';
import useDebounce from 'hooks/useDebounce';
import { useLanguage } from 'i18n/hooks';
import AmountNFT from '../AmountNFT';
import NFTInfo from '../NFTInfo';
import CommonButton from 'components/CommonButton';
import { useCurrentWalletInfo, useMainChainCaInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import {
  CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL,
  useCrossTransferByEtransfer,
} from '@portkey-wallet/hooks/hooks-ca/useWithdrawByETransfer';
import {
  divDecimals,
  formatAmountShow,
  formatAmountUSDShow,
  formatTokenAmountShowWithDecimals,
  timesDecimals,
} from '@portkey-wallet/utils/converter';
import {
  IToSendHomeParamsType,
  IToSendPreviewParamsType,
  TransferType,
} from '@portkey-wallet/types/types-ca/routeParams';

import { getELFChainBalance } from '@portkey-wallet/utils/balance';
import { RouteProp, useRoute } from '@react-navigation/native';
import Loading from 'components/Loading';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';

import { TransactionError } from '@portkey-wallet/constants/constants-ca/send';
import { useCheckManagerSyncState } from 'hooks/wallet';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { useCheckTransferLimitWithJump, useSecuritySafeCheckAndToast } from 'hooks/security';
import CommonToast from 'components/CommonToast';
import Touchable from 'components/Touchable';
import { useGetCAContract, useGetTokenViewContract } from 'hooks/contract';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useGetTransferFee } from 'hooks/transfer';
import { usePin } from 'hooks/store';
import GStyles from 'assets/theme/GStyles';
import { TextTitle } from 'components/CommonText';
import { useEtransferFee } from 'hooks/etransfer';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { getAssetsEstimation } from '@portkey-wallet/store/store-ca/assets/api';
import { addressFormat, getChainIdByAddress } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import ToAddressInput from '../components/ToAddressInput';
import TokenBalanceShow from 'components/TokenBalanceShow';
import TokenAmountInput from 'components/TokenAmountInput';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { TransferErrorMessage, warning1Arr, WarningKey, WarningTips } from '../constant';
import { CommonPromptCard, PromptCardType } from 'components/CommonPromptCard';
import SupportedExchangesCard from '../components/SupportedExchangesCard';
import GeneralTips from '../components/GeneralTips';
import SelectExchangeCard from '../components/SelectExchangeCard';
import SelectNetwork, { INetworkItem } from '../components/SelectNetwork';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network-mainnet-v2';
import useGetEBridgeConfig from 'hooks/ebridge';
import { EBridge } from '@portkey-wallet/utils/eBridge';
import ActionSheet from 'components/ActionSheet';
import OverlayModal from 'components/OverlayModal';
import { eBridgeActionSheet, getLimitTips, getSmallerValue, isValidAmount } from '../utils';
import CommonInfoRow from 'components/CommonInfoRow';
import { SEND_RECEIVE_HELP_URL } from 'constants/common';
import { openOutLink } from 'utils/link';

const SendHome: React.FC = () => {
  const {
    params: { sendType = 'token', toInfo, assetInfo, imTransferInfo },
  } = useRoute<RouteProp<{ params: IToSendHomeParamsType }>>();
  const { t } = useLanguage();
  const styles = getStyles();
  useFetchTxFee();
  const defaultToken = useDefaultToken();
  const mainChainCaInfo = useMainChainCaInfo();
  const wallet = useCurrentWalletInfo();
  const chainInfo = useCurrentChain(assetInfo?.chainId);
  const securitySafeCheckAndToast = useSecuritySafeCheckAndToast();
  const [tokenPriceObject] = useGetCurrentAccountTokenPrice();
  const [chainList, setChainList] = useState<INetworkItem[]>([]);
  const [targetNetwork, setTargetNetwork] = useState<INetworkItem>();
  const recommendETransfer = useMemo(
    () => targetNetwork?.serviceList?.find(ele => ele?.serviceName?.toLocaleLowerCase()?.includes('transfer')),
    [targetNetwork?.serviceList],
  );

  const recommendEBridge = useMemo(
    () => targetNetwork?.serviceList?.find(ele => ele?.serviceName?.toLocaleLowerCase()?.includes('bridge')),
    [targetNetwork?.serviceList],
  );

  const [isSendToExchange, setIsSendToExchange] = useState(true);
  const [isCheckAddressFinish, setIsCheckAddressFinish] = useState(false);

  const isFixedToContact = useMemo(() => !!imTransferInfo?.channelId, [imTransferInfo?.channelId]);
  const { max: maxFee, crossChain: crossFee } = useGetTxFee(assetInfo?.chainId);
  const { getEtransferMaxFee } = useEtransferFee(assetInfo?.chainId);

  const pin = usePin();
  const crossTransferByEtransfer = useCrossTransferByEtransfer(pin);

  const isSupportCross = useMemo(
    () => CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(assetInfo.symbol),
    [assetInfo.symbol],
  );
  const { getTokenConfig, getAELFChainInfoConfig, getEVMChainInfoConfig } = useGetEBridgeConfig();

  const [warning, setWarning] = useState<WarningKey[]>([]);
  const [bottomFeeShow, setBottomFeeShow] = useState('-');

  const [selectedToContact, setSelectedToContact] = useState(toInfo); // to
  const [balance, setBalance] = useState<string>(assetInfo?.balance || '');
  const [ELFBalance, setELFBalance] = useState<string>('');

  const [sendNumber, setSendNumber] = useState<string>(''); // tokenNumber  like 100
  const [sendUsdNumber, setSendUsdNumber] = useState<string>(''); // tokenNumber  like 100
  const debounceSendNumber = useDebounce(sendNumber, 500);
  const [maxAmountSend, setMaxAmountSend] = useState<string>('0');
  const maxAmountSendUsd = useMemo(
    () => ZERO.plus(maxAmountSend).times(tokenPriceObject[assetInfo.symbol]).toFixed(2),
    [assetInfo.symbol, maxAmountSend, tokenPriceObject],
  );

  const [step, setStep] = useState<1 | 2>(isFixedToContact ? 2 : 1);
  const [isLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const checkManagerSyncState = useCheckManagerSyncState();
  const getCAContract = useGetCAContract();

  // get transfer fee
  const getTransferFee = useGetTransferFee();
  const getTransactionFee = useCallback(
    async (isCross: boolean, sendAmount?: string) => {
      if (!chainInfo) return;
      const caContract = await getCAContract(chainInfo.chainId);
      return getTransferFee({
        isCross,
        sendAmount: sendAmount ?? debounceSendNumber,
        decimals: assetInfo.decimals,
        symbol: assetInfo.symbol,
        caContract,
        tokenContractAddress: assetInfo.tokenContractAddress,
        toAddress: getEntireDIDAelfAddress(selectedToContact.address, undefined, assetInfo.chainId),
        chainId: assetInfo.chainId,
      });
    },
    [
      chainInfo,
      getTransferFee,
      debounceSendNumber,
      assetInfo.decimals,
      assetInfo.symbol,
      assetInfo.tokenContractAddress,
      assetInfo.chainId,
      selectedToContact.address,
      getCAContract,
    ],
  );

  const onGetMaxAmount = useLockCallback(async () => {
    if (!balance) return setMaxAmountSend('0');

    const balanceBN = divDecimals(balance, assetInfo.decimals);
    const balanceStr = balanceBN.toString();

    // balance 0
    if (divDecimals(balance, assetInfo.decimals).isEqualTo(0)) return setMaxAmountSend('0');

    // if other tokens
    if (assetInfo.symbol !== defaultToken.symbol)
      return setMaxAmountSend(divDecimals(balance, assetInfo.decimals || '0').toString());

    // elf <= maxFee proxy fee
    if (divDecimals(balance, assetInfo.decimals).isLessThanOrEqualTo(maxFee))
      return setMaxAmountSend(divDecimals(balance, assetInfo.decimals || '0').toString());

    const isAELFCross = !!(selectedToContact.chainId && selectedToContact.chainId !== assetInfo.chainId);
    let fee;
    try {
      fee = await getTransactionFee(isAELFCross, divDecimals(balance, assetInfo.decimals).toFixed());
    } catch (error) {
      fee = '0';
      console.log('FEE ERROR');
    }
    const etransferFee = await getEtransferMaxFee({ amount: balanceStr, toInfo, tokenInfo: assetInfo });

    const _max = fee
      ? balanceBN.minus(etransferFee)
      : ZERO.plus(divDecimals(balance, assetInfo.decimals)).minus(maxFee).minus(etransferFee);
    setMaxAmountSend(_max.gt(ZERO) ? _max.toString() : '0');
  }, [
    balance,
    assetInfo,
    defaultToken.symbol,
    maxFee,
    selectedToContact.chainId,
    getEtransferMaxFee,
    toInfo,
    getTransactionFee,
  ]);

  const onPressMax = useCallback(async () => {
    try {
      Loading.hide();
      // check is SYNCHRONIZING
      const _isManagerSynced = await checkManagerSyncState(chainInfo?.chainId || 'AELF');
      if (!_isManagerSynced) return CommonToast.warn(TransactionError.SYNCHRONIZING);

      setSendNumber(maxAmountSend);
      setSendUsdNumber(maxAmountSendUsd);
      setErrorMessage('');
    } catch (err) {
      console.log('max err!!', err);
    } finally {
      Loading.hide();
    }
  }, [checkManagerSyncState, chainInfo?.chainId, maxAmountSend, maxAmountSendUsd]);

  const getTokenViewContract = useGetTokenViewContract();
  const initBalance = useCallback(async () => {
    const caAddress = wallet?.[assetInfo.chainId]?.caAddress;
    if (!assetInfo || !caAddress) return;
    try {
      const tokenContract = await getTokenViewContract(assetInfo.chainId);
      const _balance = await getELFChainBalance(tokenContract, assetInfo.symbol, caAddress);

      setBalance(_balance);
    } catch (error) {
      console.log('initBalance', error);
    }
  }, [assetInfo, getTokenViewContract, wallet]);

  const initELFBalance = useCallback(async () => {
    const caAddress = wallet?.[assetInfo.chainId]?.caAddress;
    if (!assetInfo || !caAddress) return;
    try {
      const tokenContract = await getTokenViewContract(assetInfo.chainId);
      const _balance = await getELFChainBalance(tokenContract, defaultToken.symbol, caAddress);
      setELFBalance(_balance);
    } catch (error) {
      console.log('init ELF Balance', error);
    }
  }, [assetInfo, defaultToken.symbol, getTokenViewContract, wallet]);

  useEffectOnce(() => {
    initBalance();
    initELFBalance();
  });

  const selectTargetNetwork = useCallback((n: INetworkItem) => {
    setSelectedToContact(pre => ({ ...pre, network: n.network }));
    setTargetNetwork(n);
    setStep(2);
  }, []);

  const MainChainToNoAffixDom = useMemo(() => {
    return (
      <View style={GStyles.paddingArg(pTd(24), pTd(16))}>
        <CommonPromptCard
          type={PromptCardType.WARNING}
          description={WarningTips[WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF]}
        />
        <View style={GStyles.height(24)} />
        <SupportedExchangesCard />
        <View style={GStyles.height(24)} />
        <GeneralTips
          content={`If you're not sending to an exchange, no worries! You can continue, and we'll send your assets through the aelf MainChain.`}
        />
      </View>
    );
  }, []);

  const DappChainToNoAffixDom = useMemo(() => {
    return (
      <View style={GStyles.paddingArg(pTd(24), pTd(16))}>
        <TextTitle style={GStyles.marginBottom(pTd(16))}>Send to an exchange?</TextTitle>
        <CommonPromptCard
          type={PromptCardType.WARNING}
          description={WarningTips[WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF]}
        />
        <View style={GStyles.height(24)} />
        <SelectExchangeCard isSendToExchange={isSendToExchange} setIsSendToExchange={setIsSendToExchange} />
      </View>
    );
  }, [isSendToExchange]);

  const JustWarningOrErrorDom = useMemo(() => {
    return (
      <View style={GStyles.paddingArg(pTd(16), pTd(16))}>
        <CommonPromptCard
          type={warning1Arr.includes(warning[0]) ? PromptCardType.ERROR : PromptCardType.WARNING}
          description={WarningTips[warning[0]]}
        />
      </View>
    );
  }, [warning]);

  const ETransferOrEBridgeDom = useMemo(() => {
    return (
      <View style={GStyles.paddingArg(pTd(16), pTd(16))}>
        <CommonPromptCard type={PromptCardType.INFO} description={WarningTips[WarningKey.MAKE_SURE_SUPPORT_PLATFORM]} />
        <View style={GStyles.height(16)} />
        <SelectNetwork networkList={chainList} onSelect={selectTargetNetwork} />
      </View>
    );
  }, [chainList, selectTargetNetwork]);

  const Step1Dom = useMemo(() => {
    if (step === 2) return null;
    if (!warning[0]) return null;
    if (
      warning[0] === WarningKey.CROSS_CHAIN ||
      warning[0] === WarningKey.INVALID_ADDRESS ||
      warning[0] === WarningKey.SAME_ADDRESS
    )
      return JustWarningOrErrorDom;

    if (warning[0] === WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF && assetInfo.symbol === defaultToken.symbol)
      return DappChainToNoAffixDom;

    if (warning[0] === WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF && assetInfo.symbol === defaultToken.symbol)
      return MainChainToNoAffixDom;

    if (warning[0] === WarningKey.MAKE_SURE_SUPPORT_PLATFORM) return ETransferOrEBridgeDom;

    return null;
  }, [
    DappChainToNoAffixDom,
    ETransferOrEBridgeDom,
    JustWarningOrErrorDom,
    MainChainToNoAffixDom,
    assetInfo.symbol,
    defaultToken.symbol,
    step,
    warning,
  ]);

  // const isValidOtherChainAddress = useMemo(() => {
  //   const { address } = selectedToContact || {};
  //   return (
  //     checkIsValidEtransferAddress(address) &&
  //     !(isDIDAelfAddress(address) && isValidChainId(getAddressChainId(selectedToContact.address, assetInfo.chainId)))
  //   );
  // }, [assetInfo.chainId, isValidChainId, selectedToContact]);

  // const nextDisable = useMemo(() => {
  //   if (!selectedToContact?.address) return true;
  //   if (isValidOtherChainAddress && enableEtransfer) {
  //     setErrorMessage([]);
  //     return true;
  //   }
  //   return false;
  // }, [enableEtransfer, isValidOtherChainAddress, selectedToContact?.address]);

  const previewDisable = useMemo(() => {
    if (!selectedToContact?.address) return true;
    if (!isValidAmount(sendNumber)) return true;
    return false;
  }, [selectedToContact?.address, sendNumber]);

  const dappChainToNoAffixAddressAction = useCallback(() => {
    if (isSendToExchange && defaultToken.symbol === assetInfo.symbol) {
      // TODO: change style
      ActionSheet.alert({
        showInfoIcon: true,
        buttonGroupDirection: 'column',
        title: 'Unsupported: Direct Transfer from dAppChain to Exchange',
        message: t(
          'Currently, ELF tokens can only be transferred to an exchange via the aelf MainChain. Please transfer them to your MainChain address first before sending them to the exchange.',
        ),
        buttons: [
          {
            title: t('Send to my aelf MainChain'),
            type: 'primary',
            onPress: () => {
              setSelectedToContact(pre => ({
                ...pre,
                address: addressFormat(mainChainCaInfo?.caAddress || '', DefaultChainId),
                chainId: DefaultChainId,
              }));
              OverlayModal.hide();
              setStep(2);
            },
          },
          {
            title: t('Cancel'),
            type: 'outline',
          },
        ],
      });
      return setSelectedToContact(pre => ({ ...pre, chainId: DefaultChainId }));
    }
    // to dappChain Address
    setStep(2);
    setSelectedToContact(pre => ({ ...pre, chainId: DefaultChainId }));
  }, [assetInfo.symbol, defaultToken.symbol, isSendToExchange, mainChainCaInfo?.caAddress, t]);

  const mainChainToNoAffixAddressAction = useCallback(() => {
    setSelectedToContact(pre => ({ ...pre, chainId: DefaultChainId }));
    setStep(2);
  }, []);

  const nextStep = useCallback(() => {
    if (warning[0] === WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF) {
      return dappChainToNoAffixAddressAction();
    } else if (warning[0] === WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF) {
      return mainChainToNoAffixAddressAction();
    }
    setStep(2);
  }, [dappChainToNoAffixAddressAction, mainChainToNoAffixAddressAction, warning]);

  //when finish send  upDate balance
  const previewParamsWithoutFee = useMemo(
    () =>
      ({
        sendType,
        assetInfo,
        toInfo: selectedToContact,
        transactionFee: '0',
        sendNumber,
      } as IToSendPreviewParamsType),
    [assetInfo, selectedToContact, sendNumber, sendType],
  );

  const checkTransferLimitWithJump = useCheckTransferLimitWithJump();

  const checkCanPreview = useCallback(async () => {
    setErrorMessage('');

    if (!chainInfo) {
      return { status: false };
    }

    const assetBalanceBigNumber = ZERO.plus(balance);
    const isAELFCross = !!(selectedToContact.chainId && selectedToContact.chainId !== assetInfo.chainId);
    const sendBigNumber = timesDecimals(sendNumber, assetInfo.decimals || '0');
    // input check
    if (sendType === 'token') {
      // token
      if (assetInfo.symbol === defaultToken.symbol) {
        // ELF
        if (sendBigNumber.isGreaterThan(assetBalanceBigNumber)) {
          setErrorMessage(TransactionError.TOKEN_NOT_ENOUGH);
          return { status: false };
        }

        if (isAELFCross && sendBigNumber.isLessThanOrEqualTo(timesDecimals(crossFee, defaultToken.decimals))) {
          setErrorMessage(TransactionError.CROSS_NOT_ENOUGH);
          return { status: false };
        }
      } else {
        // other token
        if (sendBigNumber.isGreaterThan(assetBalanceBigNumber)) {
          setErrorMessage(TransferErrorMessage.BALANCE_NOT_ENOUGH);
          return { status: false };
        }
      }
    } else {
      // nft
      if (sendBigNumber.isGreaterThan(assetBalanceBigNumber)) {
        setErrorMessage(TransactionError.NFT_NOT_ENOUGH);
        return { status: false };
      }
    }
    Loading.show();
    try {
      // cross chain interception
      if (isAELFCross) {
        const sendChainId = selectedToContact.chainId || (getChainIdByAddress(selectedToContact.address) as ChainId);
        const interceptResult = await getAssetsEstimation({
          symbol: assetInfo.symbol,
          chainId: sendChainId,
          type: sendType,
        });
        if (!interceptResult) {
          ActionSheet.alert({
            showInfoIcon: true,
            title: 'Unsupported asset',
            message: t(
              'The asset does not exist on the target chain, so the transfer cannot be completed. Please check the asset and try again with a supported chain.',
            ),
            buttons: [
              {
                title: t('OK'),
                type: 'primary',
              },
            ],
          });
          return;
        }
      }
      // check is security safe
      const securitySafeResult = await securitySafeCheckAndToast(assetInfo.chainId);
      if (!securitySafeResult) {
        Loading.hide();
        return { status: false };
      }
    } catch (err) {
      CommonToast.failError(err);
      Loading.hide();
      return { status: false };
    }

    // checkTransferLimitResult
    let caContract: ContractBasic;
    try {
      caContract = await getCAContract(chainInfo.chainId);
    } catch (error) {
      Loading.hide();
      return { status: false };
    }
    try {
      const checkTransferLimitResult = await checkTransferLimitWithJump({
        caContract,
        symbol: assetInfo.symbol,
        decimals: assetInfo.decimals,
        amount: sendNumber,
        balance: balance,
        chainId: chainInfo.chainId,
        approveMultiLevelParams: {
          sendTransferPreviewApprove: {
            successNavigateName: 'SendPreview',
            params: previewParamsWithoutFee,
          },
        },
      });
      console.log('checkTransferLimitResult', checkTransferLimitResult);
      if (!checkTransferLimitResult) {
        Loading.hide();
        return { status: false };
      }
    } catch (error) {
      CommonToast.failError(error);
      Loading.hide();
      return { status: false };
    }

    // check is SYNCHRONIZING
    const _isManagerSynced = await checkManagerSyncState(chainInfo?.chainId || 'AELF');
    if (!_isManagerSynced) {
      Loading.hide();
      setErrorMessage(TransactionError.SYNCHRONIZING);
      return { status: false };
    }

    let networkFee: string | undefined;
    let networkFeeUnit: string | undefined;
    let transactionFee: string | undefined;
    let transactionUnit: string | undefined;
    let receiveAmount: string | undefined;
    let receiveAmountUsd: string | undefined;
    let transferType = TransferType.GENERAL_SAME_CHAIN;

    // isRecommendEtransfer(to evm) fee check
    if (
      warning[0] === WarningKey.MAKE_SURE_SUPPORT_PLATFORM &&
      recommendETransfer &&
      ZERO.plus(recommendETransfer?.maxAmount).isGreaterThan(sendNumber)
    ) {
      try {
        const { withdrawInfo } = await crossTransferByEtransfer.withdrawPreview({
          symbol: assetInfo.symbol,
          address: selectedToContact.address,
          chainId: assetInfo.chainId,
          amount: sendNumber,
          network: targetNetwork?.network || '',
        });
        console.log('withdrawInfo result', withdrawInfo);
        networkFee = withdrawInfo?.aelfTransactionFee;
        const maxAmount = Number(withdrawInfo?.maxAmount);
        const minAmount = Number(withdrawInfo?.minAmount);
        transactionFee = withdrawInfo.transactionFee;
        transactionUnit = withdrawInfo.transactionUnit;
        const isEtransferCrossInLimit = Number(sendNumber) >= minAmount && Number(sendNumber) <= maxAmount;
        // TODO: change it

        if (isEtransferCrossInLimit) {
          receiveAmount = withdrawInfo?.receiveAmount;
          receiveAmountUsd = withdrawInfo?.receiveAmountUsd;
          transferType = TransferType.E_TRANSFER;
          return {
            status: true,
            networkFee,
            networkFeeUnit,
            receiveAmount,
            receiveAmountUsd,
            transactionFee,
            transactionUnit,
            transferType,
            targetNetwork: targetNetwork,
          };
        } else {
          setErrorMessage(getLimitTips(assetInfo.symbol, minAmount, maxAmount));
          throw 'etansfer err';
        }
      } catch (error) {
        console.log('etansfer err', error);
        return { status: false };
      } finally {
        Loading.hide();
      }
    }

    // isRecommendEBridge(to evm) fee check
    if (warning[0] === WarningKey.MAKE_SURE_SUPPORT_PLATFORM && recommendEBridge) {
      try {
        const fromChainInfo = getAELFChainInfoConfig(assetInfo.chainId);
        const toChainInfo = getEVMChainInfoConfig(targetNetwork?.network || '');
        const tokenInfo = getTokenConfig(assetInfo.symbol);
        const bridge = new EBridge({
          fromChainInfo,
          toChainInfo,
          tokenInfo,
        });

        // fee
        const f = await bridge.getELFFee();
        console.log('f', f);
        setBottomFeeShow(f);

        const needElfBalance =
          assetInfo.symbol === defaultToken.symbol
            ? timesDecimals(sendNumber, defaultToken.decimals).plus(f).toString()
            : f;
        const elfBalance = ELFBalance;
        if (ZERO.plus(needElfBalance).isGreaterThan(elfBalance)) {
          setErrorMessage(TransferErrorMessage.FEE_NOT_ENOUGH);
          return { status: false };
        }

        receiveAmount = sendNumber;
        receiveAmountUsd = ZERO.plus(sendNumber).times(tokenPriceObject[assetInfo.symbol]).toString();

        // limit
        const limit = await bridge.getLimit();
        console.log('limit', f);
        const targetLimit = getSmallerValue(limit.remain, limit.currentCapacity);
        if (limit.isEnable && sendBigNumber.isGreaterThan(targetLimit)) {
          return setErrorMessage(getLimitTips(assetInfo.symbol, '0', formatAmountShow(targetLimit)));
        }
        transactionFee = divDecimals(f, defaultToken.decimals).toString();
        transactionUnit = 'ELF';
        transferType = TransferType.E_BRIDGE;

        await eBridgeActionSheet();

        return {
          status: true,
          networkFee,
          networkFeeUnit,
          transactionFee,
          transactionUnit,
          receiveAmount,
          receiveAmountUsd,
          transferType,
          targetNetwork,
        };
      } catch (error) {
        console.log('err', error);
        return { status: false };
      } finally {
        Loading.hide();
      }
    }

    // SameChain or CrossChain in aelf
    try {
      if (isAELFCross && isSupportCross) {
        const network = selectedToContact?.chainId || 'AELF';

        const { withdrawInfo } = await crossTransferByEtransfer.withdrawPreview({
          symbol: assetInfo.symbol,
          address: selectedToContact.address,
          chainId: assetInfo.chainId,
          amount: sendNumber,
          network,
        });

        transactionFee = withdrawInfo?.aelfTransactionFee;
        const maxAmount = Number(withdrawInfo?.maxAmount);
        const minAmount = Number(withdrawInfo?.minAmount);
        transactionFee = withdrawInfo.transactionFee;
        transactionUnit = withdrawInfo.transactionUnit;
        const isEtransferCrossInLimit = Number(sendNumber) >= minAmount && Number(sendNumber) <= maxAmount;
        if (isEtransferCrossInLimit) {
          receiveAmount = withdrawInfo?.receiveAmount;
          receiveAmountUsd = withdrawInfo?.receiveAmountUsd;
          transferType = TransferType.E_TRANSFER;
        } else {
          transferType = TransferType.GENERAL_CROSS_CHAIN;
          networkFee = await getTransactionFee(isAELFCross);
          networkFeeUnit = 'ELF';
        }
      } else {
        networkFee = await getTransactionFee(isAELFCross);
        networkFeeUnit = 'ELF';
        transferType = isAELFCross ? TransferType.GENERAL_CROSS_CHAIN : TransferType.GENERAL_SAME_CHAIN;
      }
    } catch (err: any) {
      if (err?.code === 500) {
        setErrorMessage(TransactionError.FEE_NOT_ENOUGH);
        Loading.hide();
        return { status: false };
      }
    } finally {
      Loading.hide();
    }

    return {
      status: true,
      networkFee,
      networkFeeUnit,
      receiveAmount,
      receiveAmountUsd,
      transactionFee,
      transactionUnit,
      transferType,
    };
  }, [
    chainInfo,
    balance,
    selectedToContact.chainId,
    selectedToContact.address,
    assetInfo.chainId,
    assetInfo.decimals,
    assetInfo.symbol,
    sendNumber,
    sendType,
    checkManagerSyncState,
    warning,
    recommendETransfer,
    recommendEBridge,
    defaultToken.symbol,
    defaultToken.decimals,
    crossFee,
    securitySafeCheckAndToast,
    t,
    getCAContract,
    checkTransferLimitWithJump,
    previewParamsWithoutFee,
    crossTransferByEtransfer,
    targetNetwork,
    getAELFChainInfoConfig,
    getEVMChainInfoConfig,
    getTokenConfig,
    tokenPriceObject,
    ELFBalance,
    isSupportCross,
    getTransactionFee,
  ]);

  const preview = useCallback(async () => {
    const result = await checkCanPreview();
    if (!result?.status) return;

    console.log('nav params', {
      ...previewParamsWithoutFee,
      transactionFee: result?.transactionFee || '0',
      transactionFeeUnit: result?.transactionUnit || '',
      networkFee: result?.networkFee || '0',
      networkFeeUnit: result?.networkFeeUnit || '',
      receiveAmount: result?.receiveAmount,
      receiveAmountUsd: result?.receiveAmountUsd,
      transferType: result?.transferType || TransferType.GENERAL_SAME_CHAIN,
      targetNetwork: result?.targetNetwork,
    });

    navigationService.navigate('SendPreview', {
      ...previewParamsWithoutFee,
      transactionFee: result?.transactionFee || '0',
      transactionFeeUnit: result?.transactionUnit || '',
      networkFee: result?.networkFee || '0',
      networkFeeUnit: result?.networkFeeUnit || '',
      receiveAmount: result?.receiveAmount,
      receiveAmountUsd: result?.receiveAmountUsd,
      transferType: result?.transferType || TransferType.GENERAL_SAME_CHAIN,
      targetNetwork: result?.targetNetwork,
    });
  }, [checkCanPreview, previewParamsWithoutFee]);

  const titleText = useMemo(() => {
    if (step === 2) return `Enter Amount`;
    return `${t('Send')}${sendType === 'token' ? ' ' + (assetInfo.label || assetInfo.symbol) : ''}`;
  }, [assetInfo.label, assetInfo.symbol, sendType, step, t]);

  const renderFeeErrDom = useCallback(() => {
    if (step === 1) return null;
    const feeShow = formatTokenAmountShowWithDecimals(bottomFeeShow, defaultToken.decimals);

    TransferErrorMessage.FEE_NOT_ENOUGH;
    return (
      <View style={GStyles.paddingArg(pTd(16))}>
        <CommonInfoRow
          isError={errorMessage === TransferErrorMessage.FEE_NOT_ENOUGH}
          label={{
            text: 'Transaction fee',
            tooltipProps: {
              title: 'Transaction fee',
              description: 'Fee applied by the cross-chain bridge to process your transaction on blockchains.',
            },
            textBelow: errorMessage === TransferErrorMessage.FEE_NOT_ENOUGH ? 'Not enough ELF' : '',
          }}
          value={{
            text: `${feeShow} ${defaultToken.symbol} `,
            textBelow: `${
              bottomFeeShow
                ? formatAmountUSDShow(
                    divDecimals(bottomFeeShow, defaultToken.decimals).times(tokenPriceObject[defaultToken.symbol]),
                  )
                : '-'
            }`,
          }}
        />
      </View>
    );
  }, [bottomFeeShow, defaultToken.decimals, defaultToken.symbol, errorMessage, step, tokenPriceObject]);

  const renderButtonUI = useCallback(() => {
    // hide token
    if (
      (!selectedToContact.address || !isCheckAddressFinish || warning[0] === WarningKey.MAKE_SURE_SUPPORT_PLATFORM) &&
      step === 1
    )
      return null;

    // text
    let btnText = 'Next';
    if (step === 1 && warning[0] === WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF) btnText = 'Confirm and continue';
    if (step === 2) btnText = 'Preview';

    // disable
    const disable =
      step === 1 ? warning[0] === WarningKey.INVALID_ADDRESS || warning[0] === WarningKey.SAME_ADDRESS : previewDisable;

    // action
    const action = step === 1 ? nextStep : preview;

    return (
      <View style={GStyles.paddingArg(pTd(16), pTd(16))}>
        <CommonButton loading={isLoading} disabled={disable} title={btnText} type="primary" onPress={action} />
      </View>
    );
  }, [isCheckAddressFinish, isLoading, nextStep, preview, previewDisable, selectedToContact.address, step, warning]);

  const renderBottomSection = useCallback(() => {
    return (
      <View style={styles.bottomWrapStyle}>
        {renderFeeErrDom()}
        {renderButtonUI()}
      </View>
    );
  }, [renderButtonUI, renderFeeErrDom, styles.bottomWrapStyle]);

  useEffect(() => {
    onGetMaxAmount();
  }, [onGetMaxAmount]);

  return (
    <PageContainer
      safeAreaColor={['black']}
      titleDom={titleText}
      rightDom={
        step === 2 ? (
          <Touchable
            onPress={async () => {
              await openOutLink(SEND_RECEIVE_HELP_URL);
            }}>
            <Svg icon="question" size={pTd(24)} color={defaultColors.font2} iconStyle={styles.iconStyle} />
          </Touchable>
        ) : null
      }
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <ToAddressInput
        step={step}
        warning={warning}
        checkFinish={isCheckAddressFinish}
        selectedToken={assetInfo}
        selectedToContact={selectedToContact}
        isFixedToContact={isFixedToContact}
        setStep={setStep}
        setWarning={setWarning}
        setSelectedToContact={setSelectedToContact}
        setChainList={setChainList}
        setCheckFinish={setIsCheckAddressFinish}
        setSendNumber={setSendNumber}
        setSendUSDNumber={setSendUsdNumber}
      />
      {Step1Dom}

      {/* Group 2 token */}
      {sendType === 'token' && step === 2 && (
        <View style={styles.group}>
          <TokenBalanceShow
            label={assetInfo?.label}
            symbol={assetInfo.symbol}
            balanceShow={formatTokenAmountShowWithDecimals(balance, assetInfo.decimals)}
            onPressMax={onPressMax}
            imageUrl={assetInfo.imageUrl}
          />
          <TokenAmountInput
            warningTip={errorMessage}
            value={sendNumber}
            usdValue={sendUsdNumber}
            label={assetInfo.label}
            symbol={assetInfo.symbol}
            decimals={assetInfo.decimals}
            setValue={setSendNumber}
            setUsdValue={setSendUsdNumber}
          />
        </View>
      )}

      {/* TODO: nft section */}
      {sendType === 'nft' && step === 2 && (
        <>
          <View style={styles.group}>
            <NFTInfo nftItem={assetInfo} />
          </View>
          <View style={styles.group}>
            <AmountNFT sendNumber={sendNumber} setSendNumber={setSendNumber} assetInfo={assetInfo} />
          </View>
        </>
      )}
      {/* <View style={styles.space} />
      {step === 1 && (
        <SelectContact
          chainId={assetInfo.chainId}
          onPress={(item: { address: string; name: string }) => {
            setSelectedToContact(item);
          }}
        />
      )} */}

      {renderBottomSection()}
    </PageContainer>
  );
};

export default memo(SendHome);
