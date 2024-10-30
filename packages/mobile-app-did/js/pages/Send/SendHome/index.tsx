import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard, Linking, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { getOtherChainWarningStyle, getStyles } from './style';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { ZERO } from '@portkey-wallet/constants/misc';
import { getAelfAddress, getEntireDIDAelfAddress, isCrossChain, isDIDAelfAddress } from '@portkey-wallet/utils/aelf';
import useDebounce from 'hooks/useDebounce';
import { useLanguage } from 'i18n/hooks';
import AmountNFT from '../AmountNFT';
import NFTInfo from '../NFTInfo';
import CommonButton from 'components/CommonButton';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentChain, useDefaultToken, useIsValidSuffix } from '@portkey-wallet/hooks/hooks-ca/chainList';
import {
  CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL,
  useCrossTransferByEtransfer,
} from '@portkey-wallet/hooks/hooks-ca/useWithdrawByETransfer';
import {
  divDecimals,
  formatAmountShow,
  formatTokenAmountShowWithDecimals,
  timesDecimals,
} from '@portkey-wallet/utils/converter';
import {
  IToSendHomeParamsType,
  IToSendPreviewParamsType,
  TransferType,
} from '@portkey-wallet/types/types-ca/routeParams';

import { getELFChainBalance } from '@portkey-wallet/utils/balance';
import { FontStyles } from 'assets/theme/styles';
import { RouteProp, useRoute } from '@react-navigation/native';
import Loading from 'components/Loading';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';

import { TransactionError, AddressError } from '@portkey-wallet/constants/constants-ca/send';
import { getAddressChainId, isSameAddresses } from '@portkey-wallet/utils';
import { useCheckManagerSyncState } from 'hooks/wallet';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { useCheckTransferLimitWithJump, useSecuritySafeCheckAndToast } from 'hooks/security';
import CommonToast from 'components/CommonToast';
import Touchable from 'components/Touchable';
import { useGetCAContract, useGetTokenViewContract } from 'hooks/contract';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useGetTransferFee } from 'hooks/transfer';
import { checkEnabledFunctionalTypes } from '@portkey-wallet/utils/compass';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { useAppETransShow } from 'hooks/cms';
import { usePin } from 'hooks/store';
import GStyles from 'assets/theme/GStyles';
import { TextXXL } from 'components/CommonText';
import { checkIsValidEtransferAddress } from '@portkey-wallet/utils/check';
import { useOnDisclaimerModalPress } from 'hooks/deposit';
import { stringifyETrans } from '@portkey-wallet/utils/dapp/url';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useEtransferFee } from 'hooks/etransfer';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { getAssetsEstimation } from '@portkey-wallet/store/store-ca/assets/api';
import { getChainIdByAddress } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import ToAddressInput from '../components/ToAddressInput';
import TokenBalanceShow from 'components/TokenBalanceShow';
import TokenAmountInput from 'components/TokenAmountInput';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { HELP_URL, TransferErrorMessage, warning1Arr, WarningKey, WarningTips } from '../constant';
import { CommonPromptCard, PromptCardType } from 'components/CommonPromptCard';
import SupportedExchangesCard from '../components/SupportedExchangesCard';
import GeneralTips from '../components/GeneralTips';
import SelectExchangeCard from '../components/SelectExchangeCard';
import SelectNetwork, { INetworkItem, INetworkServiceItem } from '../components/SelectNetwork';
import { useShowDialog } from '../hooks';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network-mainnet-v2';
import useGetEBridgeConfig from 'hooks/ebridge';
import { EBridge } from '@portkey-wallet/utils/eBridge';
import ActionSheet from 'components/ActionSheet';
import OverlayModal from 'components/OverlayModal';
import { getLimitTips, getSmallerValue, openOutLink } from '../utils';

const SendHome: React.FC = () => {
  const {
    params: { sendType = 'token', toInfo, assetInfo, imTransferInfo },
  } = useRoute<RouteProp<{ params: IToSendHomeParamsType }>>();
  const { t } = useLanguage();
  const styles = getStyles();
  const otherChainWarningStyle = getOtherChainWarningStyle();
  useFetchTxFee();
  const isValidChainId = useIsValidSuffix();
  const defaultToken = useDefaultToken();

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
  const showDialog = useShowDialog();

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
  const { isETransDepositShow } = useAppETransShow();
  const onDisclaimerModalPress = useOnDisclaimerModalPress();
  const { eTransferUrl = '' } = useCurrentNetworkInfo();

  useEffect(() => {
    setSelectedToContact(toInfo);
  }, [toInfo]);

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

    const isCross = isCrossChain(selectedToContact.address, assetInfo.chainId || 'AELF');
    let fee;
    try {
      fee = await getTransactionFee(isCross, divDecimals(balance, assetInfo.decimals).toFixed());
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
    getTransactionFee,
    getEtransferMaxFee,
    toInfo,
    selectedToContact.address,
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
        <TextXXL style={GStyles.marginBottom(pTd(16))}>Send to an exchange?</TextXXL>
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
      <View style={GStyles.paddingArg(pTd(24), pTd(16))}>
        <CommonPromptCard
          type={warning1Arr.includes(warning[0]) ? PromptCardType.ERROR : PromptCardType.WARNING}
          description={WarningTips[warning[0]]}
        />
      </View>
    );
  }, [warning]);

  const ETransferOrEBridgeDom = useMemo(() => {
    return (
      <View style={GStyles.paddingArg(pTd(24), pTd(16))}>
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

  const enableEtransfer = useMemo(() => {
    const { symbol, chainId } = assetInfo;
    const { withdraw } = checkEnabledFunctionalTypes(symbol, chainId === MAIN_CHAIN_ID);
    return isETransDepositShow && withdraw;
  }, [assetInfo, isETransDepositShow]);

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
    if (sendNumber === '0' || !sendNumber) return true;
    return false;
  }, [selectedToContact?.address, sendNumber]);

  const dappChainToNoAffixAddressAction = useCallback(() => {
    if (isSendToExchange) {
      // TODO: change style
      ActionSheet.alert({
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
    setSelectedToContact(pre => ({ ...pre, chainId: assetInfo.chainId }));
  }, [assetInfo.chainId, isSendToExchange, t]);

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
      if (isCrossChain(selectedToContact.address, assetInfo.chainId)) {
        const sendChainId = selectedToContact.chainId || (getChainIdByAddress(selectedToContact.address) as ChainId);
        const interceptResult = await getAssetsEstimation({
          symbol: assetInfo.symbol,
          chainId: sendChainId,
          type: sendType,
        });
        if (!interceptResult) {
          // TODO: change style
          ActionSheet.alert({
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
    if (warning[0] === WarningKey.MAKE_SURE_SUPPORT_PLATFORM && recommendETransfer) {
      try {
        const { withdrawInfo } = await crossTransferByEtransfer.withdrawPreview({
          symbol: assetInfo.symbol,
          address: selectedToContact.address,
          chainId: assetInfo.chainId,
          amount: sendNumber,
          network: targetNetwork?.network || '',
        });
        transactionFee = withdrawInfo?.aelfTransactionFee;
        const maxAmount = Number(withdrawInfo?.maxAmount);
        const minAmount = Number(withdrawInfo?.minAmount);
        transactionFee = withdrawInfo.transactionFee;
        transactionUnit = withdrawInfo.transactionUnit;
        const isEtransferCrossInLimit = Number(sendNumber) >= minAmount && Number(sendNumber) <= maxAmount;
        // TODO: change it
        if (isEtransferCrossInLimit) {
          transferType = TransferType.E_TRANSFER;
          Loading.hide();
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
        }
      } catch (error) {
        console.log('err', error);
        return { status: false };
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
        const f = await bridge.getELFFee();
        if (assetInfo.symbol === defaultToken.symbol) {
          // ELF
          if (sendBigNumber.plus(f).isGreaterThan(ELFBalance)) {
            setErrorMessage(TransferErrorMessage.FEE_NOT_ENOUGH);
            return { status: false };
          }
        } else {
          if (ZERO.plus(f).isGreaterThan(ELFBalance)) {
            setErrorMessage(TransferErrorMessage.FEE_NOT_ENOUGH);
            return { status: false };
          }
        }

        const limit = await bridge.getLimit();
        // TODO： change it
        const targetLimit = getSmallerValue(limit.remain, limit.currentCapacity);
        if (limit.isEnable && sendBigNumber.isGreaterThan(targetLimit)) {
          setErrorMessage(getLimitTips(assetInfo.symbol, '0', formatAmountShow(targetLimit)));
        }
        transactionFee = divDecimals(f?.result, defaultToken.decimals).toString();
        transactionUnit = 'ELF';
        console.log('MAKE_SURE_SUPPORT_PLATFORM fee', f);
        transferType = TransferType.E_BRIDGE;

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
      } finally {
        Loading.hide();
      }
    }

    // SameChain or CrossChain in aelf
    try {
      if (isAELFCross && isSupportCross) {
        const network = selectedToContact.chainId || 'AELF';
        const { withdrawInfo } = await crossTransferByEtransfer.withdrawPreview({
          symbol: assetInfo.symbol,
          address: selectedToContact.address,
          chainId: assetInfo.chainId,
          amount: sendNumber,
          network,
        });
        console.log('withdrawInfo', withdrawInfo);
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
        transferType = TransferType.GENERAL_SAME_CHAIN;
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
    ELFBalance,
    isSupportCross,
    getTransactionFee,
  ]);

  const preview = useCallback(async () => {
    const result = await checkCanPreview();
    if (!result?.status) return;

    navigationService.navigate('SendPreview', {
      ...previewParamsWithoutFee,
      transactionFee: result?.transactionFee || '0',
      transactionFeeUnit: result?.transactionUnit || '',
      networkFee: result?.networkFee || '0',
      networkFeeUnit: result?.networkFeeUnit || '',
      receiveAmount: result?.receiveAmount,
      receiveAmountUsd: result?.receiveAmountUsd,
      // crossChainFee: result?.transactionFee || crossFee,
      // crossChainFeeUnit: result?.transactionUnit || '',
      transferType: result?.transferType || TransferType.GENERAL_SAME_CHAIN,
      targetNetwork: result?.targetNetwork,
    });
  }, [checkCanPreview, previewParamsWithoutFee]);

  const titleText = useMemo(() => {
    if (step === 2) return `Enter Amount`;
    return `${t('Send')}${sendType === 'token' ? ' ' + (assetInfo.label || assetInfo.symbol) : ''}`;
  }, [assetInfo.label, assetInfo.symbol, sendType, step, t]);

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
      <View style={styles.buttonWrapStyle}>
        <CommonButton loading={isLoading} disabled={disable} title={btnText} type="primary" onPress={action} />
      </View>
    );
  }, [
    isCheckAddressFinish,
    isLoading,
    nextStep,
    preview,
    previewDisable,
    selectedToContact.address,
    step,
    styles.buttonWrapStyle,
    warning,
  ]);

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
              await openOutLink(HELP_URL);
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
          />
          <TokenAmountInput
            warningTip={errorMessage}
            value={sendNumber}
            usdValue={sendUsdNumber}
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
      {renderButtonUI()}
    </PageContainer>
  );
};

export default memo(SendHome);
