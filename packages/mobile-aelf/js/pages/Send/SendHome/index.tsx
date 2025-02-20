import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import myEvents from 'utils/deviceEvent';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import {
  CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL,
  useCrossTransferByEtransfer,
} from '@portkey-wallet/hooks/hooks-eoa/useWithdrawByETransfer';
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
  TToInfo,
} from '@portkey-wallet/types/types-eoa/routeParams';

import { RouteProp, useRoute } from '@react-navigation/native';
import Loading from 'components/Loading';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';

import { TransactionError } from '@portkey-wallet/constants/constants-ca/send';
import Touchable from 'components/Touchable';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useGetTransferFee } from 'hooks/transfer';
import { usePin } from 'hooks/store';
import GStyles from 'assets/theme/GStyles';
import { TextTitle } from 'components/CommonText';
import { useEtransferFee } from 'hooks/etransfer';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { addressFormat, sleep } from '@portkey-wallet/utils';
import ToAddressInput, { IToAddressInputRef } from '../components/ToAddressInput';
import TokenBalanceShow from 'components/TokenBalanceShow';
import TokenAmountInput from 'components/TokenAmountInput';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-eoa/useTokensPrice';
import { TransferErrorMessage, warning1Arr, WarningKey, WarningTips } from '../constant';
import { CommonPromptCard, PromptCardType } from 'components/CommonPromptCard';
import SupportedExchangesCard from '../components/SupportedExchangesCard';
import SelectExchangeCard from '../components/SelectExchangeCard';
import SelectNetwork, { INetworkItem } from '../components/SelectNetwork';
import { DefaultChainId } from '@portkey-wallet/constants/constants-eoa/network';
import useGetEBridgeConfig from 'hooks/ebridge';
import { EBridge } from '@portkey-wallet/utils/eBridge';
import ActionSheet from 'components/ActionSheet';
import OverlayModal from 'components/OverlayModal';
import { eBridgeActionSheet, getLimitTips, getSendNetworkList, getSmallerValue, isValidAmount } from '../utils';
import { SEND_HELP_URL } from 'constants/common';
import { openOutLink } from 'utils/link';
import SelectAddressTab from '../components/SelectAddressTab';
import { useRecent } from '@portkey-wallet/hooks/hooks-eoa/recent';
import { useGetFilterContactList } from '@portkey-wallet/hooks/hooks-eoa/contact';
import { TFormattedRecentItem } from '@portkey-wallet/types/types-eoa/contact';
import { KeyboardSafeArea } from 'components/KeyboardSafeArea';
import { useKeyboardListener } from 'hooks/useKeyboardHeight';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useBalanceByContract } from 'hooks/balanceByContract';
import CommonToast from 'components/CommonToast';
import { useChainList } from '@portkey-wallet/hooks/hooks-eoa/network/chain';
import { IContactItemMyType } from 'components/ContactItemMy';

const SendHome: React.FC = () => {
  const {
    params: { sendType = 'token', toInfo, assetInfo },
  } = useRoute<RouteProp<{ params: IToSendHomeParamsType }>>();
  const { t } = useLanguage();
  const inputRef = useRef<IToAddressInputRef>(null);
  const currentAccount = useCurrentAccount();
  const styles = getStyles();
  useFetchTxFee();
  const defaultToken = useDefaultToken(assetInfo.chainId);
  const chainInfo = useCurrentChain(assetInfo?.chainId);
  const [tokenPriceObject] = useGetCurrentAccountTokenPrice();
  const [chainList, setChainList] = useState<INetworkItem[]>([]);
  const [targetNetwork, setTargetNetwork] = useState<INetworkItem>();
  const [recentList, setRecentList] = useState<TFormattedRecentItem[]>();
  const [savedList, setSavedList] = useState<TFormattedRecentItem[]>();
  const { getRecentList } = useRecent();
  const getFilterContactList = useGetFilterContactList();

  const recommendETransfer = useMemo(
    () => targetNetwork?.serviceList?.find(ele => ele?.serviceName?.toLocaleLowerCase()?.includes('transfer')),
    [targetNetwork?.serviceList],
  );

  const recommendEBridge = useMemo(
    () => targetNetwork?.serviceList?.find(ele => ele?.serviceName?.toLocaleLowerCase()?.includes('bridge')),
    [targetNetwork?.serviceList],
  );

  const isSupportCross = useMemo(
    () => CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(assetInfo.symbol),
    [assetInfo.symbol],
  );

  const [isSendToExchange, setIsSendToExchange] = useState(true);
  const [isCheckAddressFinish, setIsCheckAddressFinish] = useState(false);

  const isFixedToContact = useMemo(() => false, []);
  const { max: maxFee } = useGetTxFee(assetInfo?.chainId);
  const { getEtransferMaxFee } = useEtransferFee(assetInfo?.chainId);

  const pin = usePin();
  const crossTransferByEtransfer = useCrossTransferByEtransfer(pin);

  const { getTokenConfig, getAELFChainInfoConfig, getEVMChainInfoConfig } = useGetEBridgeConfig();

  const [warning, setWarning] = useState<WarningKey[]>([]);
  const { getTokenBalanceByContract } = useBalanceByContract();

  const [selectedToContact, setSelectedToContact] = useState(toInfo); // to
  const [balance, setBalance] = useState<string>(assetInfo?.balance || '');

  const [sendNumber, setSendNumber] = useState<string>(''); // tokenNumber  like 100
  const [sendUsdNumber, setSendUsdNumber] = useState<string>(''); // tokenNumber  like 100
  const debounceSendNumber = useDebounce(sendNumber, 500);
  const [maxAmountSend, setMaxAmountSend] = useState<string>('0');
  const getListFnRef = useRef<() => void>();
  const maxAmountSendUsd = useMemo(
    () => ZERO.plus(maxAmountSend).times(tokenPriceObject[assetInfo.symbol]).toFixed(2),
    [assetInfo.symbol, maxAmountSend, tokenPriceObject],
  );

  const [step, setStep] = useState<1 | 2>(isFixedToContact ? 2 : 1);
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isKeyboardShow, setKeyboardShow] = useState(false);

  useKeyboardListener({
    show: () => {
      setKeyboardShow(true);
    },
    hide: () => {
      setKeyboardShow(false);
    },
  });

  // get transfer fee
  const getTransferFee = useGetTransferFee();
  const getTransactionFee = useCallback(
    async (isAELFCross: boolean, sendAmount?: string) => {
      if (!chainInfo) {
        return;
      }

      return getTransferFee(isAELFCross, {
        sendAmount: sendAmount ?? debounceSendNumber,
        decimals: assetInfo.decimals,
        symbol: assetInfo.symbol,
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
      assetInfo.chainId,
      selectedToContact.address,
    ],
  );

  const onGetMaxAmount = useLockCallback(async () => {
    if (!balance) {
      return setMaxAmountSend('0');
    }

    const balanceBN = divDecimals(balance, assetInfo.decimals);
    const balanceStr = balanceBN.toString();

    // balance 0
    if (divDecimals(balance, assetInfo.decimals).isEqualTo(0)) {
      return setMaxAmountSend('0');
    }

    // if other tokens
    if (assetInfo.symbol !== defaultToken.symbol) {
      return setMaxAmountSend(divDecimals(balance, assetInfo.decimals || '0').toFixed());
    }

    // elf <= maxFee
    if (divDecimals(balance, assetInfo.decimals).isLessThanOrEqualTo(maxFee)) {
      return setMaxAmountSend(divDecimals(balance, assetInfo.decimals || '0').toFixed());
    }

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
    setMaxAmountSend(_max.gt(ZERO) ? _max.toFixed() : '0');
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

      setSendNumber(maxAmountSend);
      setSendUsdNumber(maxAmountSendUsd);
      setErrorMessage('');
    } catch (err) {
      console.log('max err!!', err);
    } finally {
      Loading.hide();
    }
  }, [maxAmountSend, maxAmountSendUsd]);

  const initBalance = useCallback(async () => {
    if (!assetInfo) {
      return;
    }
    try {
      const { balance: _balance } = await getTokenBalanceByContract(
        assetInfo.chainId,
        assetInfo.symbol || assetInfo.tokenId,
      );
      setBalance(_balance);
    } catch (error) {
      console.log('initBalance error', error);
    }
  }, [assetInfo, getTokenBalanceByContract]);

  useEffectOnce(() => {
    initBalance();
  });

  useEffect(() => {
    setSelectedToContact(toInfo);
  }, [toInfo]);

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
        <View style={GStyles.height(pTd(24))} />
        <SupportedExchangesCard />
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

  // const { getTransformedRecentList } = useRecent();

  // const getSavedList = useGetFilterContactList();

  // const initSavedList = useCallback(() => {
  //   const list = getSavedList({
  //     fromChainId: assetInfo.chainId,
  //     tokenId: assetInfo.symbol,
  //     isFt: sendType !== 'token',
  //   });
  //   setSavedList(list || []);
  // }, [assetInfo.chainId, assetInfo.symbol, getSavedList, sendType]);

  // const initBookList = useCallback(() => {
  //   const reList = getTransformedRecentList({
  //     fromChainId: assetInfo.chainId,
  //     tokenId: assetInfo.symbol,
  //     isFt: sendType === 'token',
  //   });
  //   setRecentList(reList || []);
  // }, [assetInfo.chainId, assetInfo.symbol, getTransformedRecentList, sendType]);

  // const initList = useCallback(() => {
  //   initBookList();
  //   initSavedList();
  // }, [initBookList, initSavedList]);
  // getListFnRef.current = initList;
  // useEffectOnce(() => {
  //   initList();
  // });
  useEffectOnce(() => {
    const listener = myEvents.updateSendAddressList.addListener(() => {
      getListFnRef.current?.();
    });
    return () => {
      listener.remove();
    };
  });

  const Step1Dom = useMemo(() => {
    if (step === 2) {
      return null;
    }
    if (!warning[0]) {
      return null;
    }
    if (
      warning[0] === WarningKey.CROSS_CHAIN ||
      warning[0] === WarningKey.INVALID_ADDRESS ||
      warning[0] === WarningKey.SAME_ADDRESS
    ) {
      return JustWarningOrErrorDom;
    }

    if (warning[0] === WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF && assetInfo.symbol === defaultToken.symbol) {
      return DappChainToNoAffixDom;
    }

    if (warning[0] === WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF && assetInfo.symbol === defaultToken.symbol) {
      return MainChainToNoAffixDom;
    }

    if (warning[0] === WarningKey.MAKE_SURE_SUPPORT_PLATFORM) {
      return ETransferOrEBridgeDom;
    }

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

  const previewDisable = useMemo(() => {
    if (!selectedToContact?.address) {
      return true;
    }
    if (!isValidAmount(sendNumber)) {
      return true;
    }
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
                address: addressFormat(currentAccount?.address || '', DefaultChainId),
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
      return;
    }

    // to dappChain Address
    setStep(2);
    setSelectedToContact(pre => ({ ...pre, chainId: assetInfo.chainId }));
  }, [assetInfo.chainId, assetInfo.symbol, currentAccount?.address, defaultToken.symbol, isSendToExchange, t]);

  const mainChainToNoAffixAddressAction = useCallback(() => {
    setSelectedToContact(pre => ({ ...pre, chainId: DefaultChainId }));
    setStep(2);
  }, []);

  const crossChainAction = useCallback(() => {
    if (assetInfo.chainId !== DefaultChainId && assetInfo.symbol === defaultToken.symbol) {
      return ActionSheet.alert({
        showInfoIcon: true,
        title: 'Confirm to proceed',
        message:
          'Direct transfers from dAppChain to exchanges are not supported and may result in asset loss. Use only non-exchange addresses.',
        buttons: [
          {
            title: 'Cancel',
            type: 'outline',
          },
          {
            title: 'Proceed',
            type: 'primary',
            onPress: () => setStep(2),
          },
        ],
      });
    }
    setStep(2);
  }, [assetInfo.chainId, assetInfo.symbol, defaultToken.symbol]);

  const nextStep = useCallback(async () => {
    Loading.show();
    await sleep(600);
    Loading.hide();

    if (warning[0] === WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF) {
      return dappChainToNoAffixAddressAction();
    } else if (warning[0] === WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF) {
      return mainChainToNoAffixAddressAction();
    } else if (warning[0] === WarningKey.CROSS_CHAIN) {
      return crossChainAction();
    }
    setStep(2);
  }, [crossChainAction, dappChainToNoAffixAddressAction, mainChainToNoAffixAddressAction, warning]);

  //when finish send  upDate balance
  const previewParamsWithoutFee = useMemo(
    () =>
      ({
        sendType,
        assetInfo,
        toInfo: selectedToContact,
        networkFee: '0',
        networkFeeUnit: defaultToken.symbol,
        sendNumber,
      } as unknown as IToSendPreviewParamsType),
    [assetInfo, defaultToken.symbol, selectedToContact, sendNumber, sendType],
  );

  const checkCanPreview = useCallback(async () => {
    setErrorMessage('');
    setLoading(true);

    if (!chainInfo) {
      console.log('checkCanPreview 1');
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
          console.log('checkCanPreview 2');
          return { status: false };
        }
      } else {
        // other token
        if (sendBigNumber.isGreaterThan(assetBalanceBigNumber)) {
          setErrorMessage(TransferErrorMessage.BALANCE_NOT_ENOUGH);
          console.log('checkCanPreview 4');
          return { status: false };
        }
      }
    } else {
      // nft

      if (sendBigNumber.isGreaterThan(assetBalanceBigNumber)) {
        setErrorMessage(TransactionError.NFT_NOT_ENOUGH);
        console.log('checkCanPreview 5');
        return { status: false };
      }
    }

    let networkFee: string | undefined;
    let networkFeeUnit: string | undefined;
    let transactionFee: string | undefined;
    let transactionUnit: string | undefined;
    let receiveAmount: string | undefined;
    let receiveAmountUsd: string | undefined;
    let transferType = TransferType.GENERAL_SAME_CHAIN;

    // isRecommendEtransfer fee check
    if (
      warning[0] === WarningKey.MAKE_SURE_SUPPORT_PLATFORM &&
      recommendETransfer &&
      ZERO.plus(recommendETransfer?.maxAmount).isGreaterThan(sendNumber)
    ) {
      try {
        const { withdrawInfo } = await crossTransferByEtransfer.withdrawPreview({
          currentAccountAddress: currentAccount?.address || '',
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
          console.log('checkCanPreview 13');
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
          setErrorMessage(getLimitTips(assetInfo.label || assetInfo.symbol, minAmount, maxAmount));
          throw 'etansfer err';
        }
      } catch (error) {
        console.log('etansfer err', error);
        console.log('checkCanPreview 14');
        return { status: false };
      } finally {
        Loading.hide();
      }
    }

    // isRecommendEBridge fee check
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

        receiveAmount = sendNumber;
        receiveAmountUsd = ZERO.plus(sendNumber).times(tokenPriceObject[assetInfo.symbol]).toString();

        // fee
        const f = await bridge.getELFFee();

        console.log('fff');

        // limit
        const limit = await bridge.getLimit();

        const targetLimit = getSmallerValue(limit.remain, limit.currentCapacity);
        if (limit.isEnable && sendBigNumber.isGreaterThan(targetLimit)) {
          console.log('checkCanPreview 16');
          return setErrorMessage(getLimitTips(assetInfo.symbol, '0', formatAmountShow(targetLimit)));
        }
        transactionFee = divDecimals(f, defaultToken.decimals).toString();
        transactionUnit = 'ELF';
        transferType = TransferType.E_BRIDGE;
        if (ZERO.plus(recommendEBridge.maxAmount).lt(sendNumber)) {
          await eBridgeActionSheet();
        }
        OverlayModal.hide();
        console.log('checkCanPreview 17');
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
        console.log('checkCanPreview 18');
        return { status: false };
      } finally {
        Loading.hide();
      }
    }

    // SameChain or CrossChain in aelf
    try {
      if (isAELFCross && isSupportCross) {
        const network = selectedToContact?.chainId || 'AELF';
        let isEtransferCrossInLimit = false;

        try {
          const { withdrawInfo } = await crossTransferByEtransfer.withdrawPreview({
            symbol: assetInfo.symbol,
            address: selectedToContact.address,
            chainId: assetInfo.chainId,
            amount: sendNumber,
            network,
            currentAccountAddress: currentAccount?.address || '',
          });

          transactionFee = withdrawInfo?.aelfTransactionFee;
          const maxAmount = Number(withdrawInfo?.maxAmount);
          const minAmount = Number(withdrawInfo?.minAmount);
          transactionFee = withdrawInfo.transactionFee;
          transactionUnit = withdrawInfo.transactionUnit;
          isEtransferCrossInLimit = Number(sendNumber) >= minAmount && Number(sendNumber) <= maxAmount;

          // eTransfer
          if (isEtransferCrossInLimit) {
            receiveAmount = withdrawInfo?.receiveAmount;
            receiveAmountUsd = withdrawInfo?.receiveAmountUsd;
            transferType = TransferType.E_TRANSFER;
          }
        } catch (error) {
          console.log('isEtransferCrossInLimit', error);
          isEtransferCrossInLimit = false;
        }
        // GENERAL_CROSS_CHAIN
        if (!isEtransferCrossInLimit) {
          transferType = TransferType.GENERAL_CROSS_CHAIN;
          networkFee = await getTransactionFee(isAELFCross, sendNumber);
          networkFeeUnit = 'ELF';
        }
      } else {
        console.log('fffff');
        networkFee = await getTransactionFee(isAELFCross, sendNumber);
        networkFeeUnit = 'ELF';
        transferType = isAELFCross ? TransferType.GENERAL_CROSS_CHAIN : TransferType.GENERAL_SAME_CHAIN;
      }
    } catch (err: any) {
      if (err?.code === 500) {
        setErrorMessage(TransactionError.FEE_NOT_ENOUGH);
        Loading.hide();
      }
      return { status: false };
    } finally {
      Loading.hide();
    }

    // // SameChain
    // try {
    //   networkFee = await getTransactionFee(,sendNumber);
    //   networkFeeUnit = 'ELF';
    //   transferType = TransferType.GENERAL_SAME_CHAIN;
    // } catch (err: any) {
    //   if (err?.code === 500) {
    //     setErrorMessage(TransactionError.FEE_NOT_ENOUGH);
    //     Loading.hide();
    //   }
    //   return { status: false };
    // } finally {
    //   Loading.hide();
    // }
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
    assetInfo.label,
    sendNumber,
    sendType,
    warning,
    recommendETransfer,
    recommendEBridge,
    defaultToken.symbol,
    defaultToken.decimals,
    crossTransferByEtransfer,
    currentAccount?.address,
    targetNetwork,
    getAELFChainInfoConfig,
    getEVMChainInfoConfig,
    getTokenConfig,
    tokenPriceObject,
    isSupportCross,
    getTransactionFee,
  ]);

  const preview = useCallback(async () => {
    const result = await checkCanPreview();
    setLoading(false);
    console.log('preview preview', result);

    if (!result?.status) {
      return;
    }

    console.log('navigationService SendPreview', {
      ...previewParamsWithoutFee,
      transactionFee: result?.transactionFee || '0',
      transactionFeeUnit: result?.transactionUnit || '',
      networkFee: result?.networkFee || '0',
      networkFeeUnit: result?.networkFeeUnit || 'ELF',
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
      networkFeeUnit: result?.networkFeeUnit || 'ELF',
      receiveAmount: result?.receiveAmount,
      receiveAmountUsd: result?.receiveAmountUsd,
      transferType: result?.transferType || TransferType.GENERAL_SAME_CHAIN,
      targetNetwork: result?.targetNetwork,
    });
  }, [checkCanPreview, previewParamsWithoutFee]);

  const titleText = useMemo(() => {
    if (step === 2) {
      return 'Enter Amount';
    }
    return `${t('Send')} ${sendType === 'token' ? assetInfo.label || assetInfo.symbol : 'NFT'}`;
  }, [assetInfo.label, assetInfo.symbol, sendType, step, t]);

  const renderButtonUI = useCallback(() => {
    // hide token
    if (
      (!selectedToContact.address || !isCheckAddressFinish || warning[0] === WarningKey.MAKE_SURE_SUPPORT_PLATFORM) &&
      step === 1
    ) {
      return null;
    }
    // text
    let btnText = 'Next';
    if (step === 1 && warning[0] === WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF) {
      btnText = 'Confirm and continue';
    }
    if (step === 2) {
      btnText = 'Preview';
    }
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
    return <View style={styles.bottomWrapStyle}>{renderButtonUI()}</View>;
  }, [renderButtonUI, styles.bottomWrapStyle]);

  useEffect(() => {
    // TODO: change it
    onGetMaxAmount();
  }, [onGetMaxAmount]);

  // const userInfo = useCurrentUserInfo();

  const aelfChainList = useChainList();
  const myAddressesList = useMemo((): IContactItemMyType[] => {
    const chainIdInfo = aelfChainList?.find(ele => ele.chainId !== assetInfo.chainId);
    const myOtherAddress = {
      address: currentAccount?.address || '',
      avatarImg: '',
      network: 'aelf',
      chainId: chainIdInfo?.chainId || 'AELF',
      addressInfo: {
        chainId: chainIdInfo?.chainId || 'AELF',
        network: 'aelf',
        address: currentAccount?.address || '',
      },
    };
    return [myOtherAddress];
  }, [aelfChainList, assetInfo.chainId, currentAccount?.address]);

  const onPressTabItem = useCallback(
    async (i: TFormattedRecentItem) => {
      console.log('onPressTabItem', i);
      try {
        if (i.addressInfo?.address === currentAccount?.address) {
          // anther chain address
          inputRef.current?.onInput(
            addressFormat(i.address || i.addressInfo?.address, i.chainId || i.addressInfo?.chainId),
          );
        } else if (i.network !== 'aelf' && i.addressInfo?.network !== 'aelf') {
          Loading.show();
          const { data } = await getSendNetworkList({
            symbol: assetInfo?.symbol || '',
            chainId: assetInfo?.chainId || 'AELF',
            toAddress: i?.address || i?.addressInfo?.address || '',
          });

          console.log('getSendNetworkList', data, i);
          const tmpNetwork = data?.networkList?.find(
            (ele: any) => ele.network === (i?.network || i.addressInfo?.network),
          );

          if (!tmpNetwork) {
            throw 'not supported';
          }
          console.log('tmpNetwork', tmpNetwork);
          setTargetNetwork(tmpNetwork);
          setChainList(data?.networkList);
          setSelectedToContact({ name: i?.name, address: i.address || i.addressInfo?.address } as TToInfo);
          setWarning([WarningKey.MAKE_SURE_SUPPORT_PLATFORM]);
          setStep(2);
        } else {
          inputRef.current?.onInput(
            i.addressInfo?.isExchange || !i.addressInfo
              ? i.address || i.addressInfo?.address || ''
              : addressFormat(i.address || i.addressInfo?.address || '', i.chainId || i.addressInfo?.chainId),
          );
        }
      } catch (error) {
        CommonToast.failError(error);
      } finally {
        Loading.hide();
      }
    },
    [assetInfo?.chainId, assetInfo?.symbol, currentAccount?.address],
  );

  useEffectOnce(() => {
    try {
      const _recentList = getRecentList();
      setRecentList(_recentList);
    } catch (error) {
      console.log('get recent err', error);
    }
  });

  useEffectOnce(() => {
    try {
      const _recentList = getFilterContactList({
        fromChainId: assetInfo.chainId,
        tokenId: assetInfo.symbol || assetInfo.tokenId,
        isFt: sendType !== 'token',
      });
      setSavedList(_recentList);
    } catch (error) {
      console.log('get recent err', error);
    }
  });

  return (
    <PageContainer
      safeAreaColor={['black']}
      titleDom={titleText}
      rightDom={
        step === 2 ? (
          <Touchable
            onPress={async () => {
              await openOutLink(SEND_HELP_URL);
            }}>
            <Svg icon="question" size={pTd(24)} color={defaultColors.font2} iconStyle={styles.iconStyle} />
          </Touchable>
        ) : null
      }
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={styles.mainWrap}>
        <ToAddressInput
          ref={inputRef}
          sendType={sendType}
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
              showErrorInput
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
              <NFTInfo nftItem={assetInfo} onMaxPress={onPressMax} />
            </View>
            <View style={styles.group}>
              <AmountNFT
                warningTip={errorMessage}
                sendNumber={sendNumber}
                setSendNumber={setSendNumber}
                assetInfo={assetInfo}
              />
            </View>
          </>
        )}
        {step === 1 && !selectedToContact.address && !isKeyboardShow && (
          <SelectAddressTab
            recentAddressList={recentList || []}
            savedAddressList={savedList || []}
            myAddressList={myAddressesList || []}
            chainId={assetInfo.chainId}
            onPress={onPressTabItem}
          />
        )}
      </View>

      <KeyboardSafeArea>{renderBottomSection()}</KeyboardSafeArea>
    </PageContainer>
  );
};

export default memo(SendHome);
