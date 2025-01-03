import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { ErrorType, INIT_HAS_ERROR, INIT_NONE_ERROR } from '@portkey-wallet/constants/constants-ca/common';
import { SERVICE_UNAVAILABLE_TEXT } from '@portkey-wallet/constants/constants-ca/ramp';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useGetChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useSellCryptoList } from '@portkey-wallet/hooks/hooks-ca/ramp';
import { useReceive } from '@portkey-wallet/hooks/hooks-ca/ramp/useReceive';
import { useFetchTxFee, useGetOneTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { IRampCryptoItem, IRampFiatItem, RampType } from '@portkey-wallet/ramp';
import { ChainId } from '@portkey-wallet/types';
import { isEqual } from '@portkey-wallet/utils';
import { getSellFiat, getSellLimit } from '@portkey-wallet/utils/ramp';
import { isPotentialNumber } from '@portkey-wallet/utils/reg';
import { IRampLimit, RampSellPureComponent, setLoading, singleMessage } from '@portkey/did-ui-react';
import { useExtensionRampEntryShow } from 'hooks/ramp';
import { useLocationState } from 'hooks/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useUpdateReceiveAndInterval } from '../hooks';
import { useCheckLimit, useCheckSecurity } from 'hooks/useSecurity';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { ZERO } from '@portkey-wallet/constants/misc';
import { divDecimals, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { ICheckLimitBusiness } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { TRampLocationState } from 'types/router';
import { useCommonState } from 'store/Provider/hooks';
import InternalMessage from 'messages/InternalMessage';
import { PortkeyMessageTypes } from 'messages/InternalMessageTypes';
import { GuardianItem } from 'types/guardians';
import useDebounce from 'hooks/useDebounce';

export default function RampSell() {
  const { state: selectedCrypto } = useLocationState<{
    symbol: string;
    network: string;
    chainId: ChainId;
    icon: string;
    address: string;
    decimals: number;
  }>();
  const { symbol: routerSymbol, network: routerNetwork } = selectedCrypto;
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();
  const originChainId = useOriginChainId();
  const textInputRef = useRef<HTMLInputElement>(null);
  const { sellCryptoList } = useSellCryptoList();
  const { refreshRampShow } = useExtensionRampEntryShow();
  const [fiatList, setFiatList] = useState<IRampFiatItem[]>([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [currency, setCurrency] = useState<{
    crypto?: IRampCryptoItem;
    fiat?: IRampFiatItem;
  }>({
    crypto: sellCryptoList.find((item) => item.symbol === routerSymbol && item.network === routerNetwork),
    fiat: undefined,
  });
  const currencyRef = useRef(currency);
  currencyRef.current = currency;
  const crypto = useMemo(() => currency.crypto, [currency]);
  const fiat = useMemo(() => currency.fiat, [currency]);
  // const checkManagerSyncState = useCheckManagerSyncState();
  useFetchTxFee();
  const { ach: achFee } = useGetTxFee(MAIN_CHAIN_ID);
  const [amount, setAmount] = useState<string>('');
  const [amountLocalError, setAmountLocalError] = useState<ErrorType>(INIT_NONE_ERROR);
  const [init, setInit] = useState(false);

  // const chainInfo = useCurrentChain(MAIN_CHAIN_ID);
  // const pin = usePin();
  const wallet = useCurrentWalletInfo();
  const { accountTokenList } = useAccountTokenInfo();
  const tokenInfo = useMemo(() => {
    const tokenSection = accountTokenList.find((item) => item.symbol === routerSymbol);
    return tokenSection?.tokens?.find((item) => item.chainId === routerNetwork);
  }, [accountTokenList, routerSymbol, routerNetwork]);
  const refreshList = useCallback(async () => {
    setLoading(true);
    try {
      const { sellFiatList, sellDefaultFiat } = await getSellFiat({
        crypto: routerSymbol || '',
        network: routerNetwork || '',
      });

      setFiatList(sellFiatList);
      const _fiat = sellFiatList.find(
        (item) => item.symbol === sellDefaultFiat.symbol && item.country === sellDefaultFiat.country,
      );

      setCurrency((pre) => ({
        ...pre,
        fiat: _fiat,
      }));
    } catch (error) {
      console.log('sellForm refreshList error', error);
    } finally {
      setLoading(false);
      setInit(true);
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }
  }, [routerNetwork, routerSymbol]);
  useEffectOnce(() => {
    refreshList();
  });
  const limitAmountRef = useRef<IRampLimit>();
  const isRefreshReceiveValid = useRef<boolean>(false);

  const setLimitAmount = useCallback(async () => {
    limitAmountRef.current = undefined;
    const { fiat: _fiat, crypto: _crypto } = currency;
    if (_fiat === undefined || _crypto === undefined) {
      return;
    }

    setLoading(true);
    try {
      const limitResult = await getSellLimit({
        crypto: _crypto.symbol,
        network: _crypto.network,
        fiat: _fiat.symbol,
        country: _fiat.country,
      });
      if (isEqual(_fiat, currencyRef.current.fiat) && isEqual(_crypto, currencyRef.current.crypto)) {
        limitAmountRef.current = limitResult;
      }
    } catch (error) {
      console.log('Sell setLimitAmount', error);
    }
    setLoading(false);
  }, [currency]);

  const {
    receiveAmount,
    // rate,
    refreshReceive,
    amountError: amountFetchError,
    isAllowAmount,
  } = useReceive({
    type: RampType.SELL,
    amount,
    fiat,
    crypto,
    initialReceiveAmount: '',
    initialRate: '',
    limitAmountRef,
    isRefreshReceiveValid,
  });
  const refreshReceiveRef = useRef<typeof refreshReceive>();
  refreshReceiveRef.current = refreshReceive;

  const amountError = useMemo(() => {
    if (amountFetchError.isError && amountFetchError.errorMsg !== '') {
      return amountFetchError;
    }
    return amountLocalError;
  }, [amountFetchError, amountLocalError]);

  const onFiatChange = useCallback((_fiat: IRampFiatItem) => {
    setCurrency((pre) => ({ ...pre, fiat: _fiat }));
  }, []);

  const onChooseChange = useCallback(async () => {
    isRefreshReceiveValid.current = false;
    setAmountLocalError(INIT_NONE_ERROR);
    await setLimitAmount();
    refreshReceiveRef.current?.();
  }, [setLimitAmount]);

  useEffect(() => {
    // only fiat||token change or init will trigger
    onChooseChange();
  }, [onChooseChange]);

  const onAmountInput = useCallback((text: string) => {
    isRefreshReceiveValid.current = false;
    setAmountLocalError(INIT_NONE_ERROR);

    if (text === '') {
      setAmount('');
      return;
    }
    if (!isPotentialNumber(text)) {
      return;
    }
    const arr = text.split('.');
    if (arr[1]?.length > 8) {
      return;
    }
    if (arr.join('').length > 13) {
      return;
    }
    setAmount(text);
  }, []);
  const cryptoSelectedRef = useRef(currency.crypto);
  cryptoSelectedRef.current = currency.crypto;
  const fiatSelectedRef = useRef(currency.fiat);
  fiatSelectedRef.current = currency.fiat;
  const cryptoAmountRef = useRef(amount);
  cryptoAmountRef.current = amount;
  const [openFiatModal, setOpenFiatModal] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const debounceSearchKeyword = useDebounce(searchKeyword, 800);
  // 15s interval
  const {
    // receive,
    // exchange,
    // updateTime,
    // errMsg,
    // warningMsg,
    // updateSellReceive,
    // resetTimer,
    // setInsufficientFundsMsg,
    checkManagerSynced,
  } = useUpdateReceiveAndInterval(RampType.SELL, {
    cryptoSelectedRef,
    fiatSelectedRef,
    cryptoAmountRef,
  });
  // console.log('exchange is:', exchange);
  const getCurrentChain = useGetChain();
  const checkSecurity = useCheckSecurity();
  const currentNetwork = useCurrentNetworkInfo();
  const getOneTxFee = useGetOneTxFee();
  const checkLimit = useCheckLimit(cryptoSelectedRef.current?.chainId || 'AELF'); // TODO change => callback params
  const [approvalVisible, setApprovalVisible] = useState<boolean>(false);
  const handleOneTimeApproval = useCallback(() => {
    if (isPrompt) return setApprovalVisible(true);
    if (!cryptoSelectedRef.current || !fiatSelectedRef.current) {
      return;
    }
    const params: TRampLocationState = {
      crypto: cryptoSelectedRef.current.symbol,
      network: cryptoSelectedRef.current.network,
      fiat: fiatSelectedRef.current.symbol,
      country: fiatSelectedRef.current.country,
      amount: cryptoAmountRef.current,
      side: RampType.SELL,
      tokenInfo: selectedCrypto as any,
      openGuardiansApprove: true,
    };
    InternalMessage.payload(PortkeyMessageTypes.RAMP, JSON.stringify(params)).send();
  }, [isPrompt, selectedCrypto]);
  const goPreview = useCallback(
    (approveList?: GuardianItem[]) => {
      if (!cryptoSelectedRef.current || !fiatSelectedRef.current) {
        return;
      }
      navigate('/buy/preview', {
        state: {
          crypto: cryptoSelectedRef.current.symbol,
          network: cryptoSelectedRef.current.network,
          fiat: fiatSelectedRef.current.symbol,
          country: fiatSelectedRef.current.country,
          amount: cryptoAmountRef.current,
          side: RampType.SELL,
          tokenInfo: selectedCrypto as any,
          approveList,
        },
      });
    },
    [navigate, selectedCrypto],
  );
  const handleNext = useCallback(async () => {
    try {
      setButtonLoading(true);
      if (!cryptoSelectedRef.current || !fiatSelectedRef.current) {
        return;
      }
      // CHECK 1: is show buy\sell
      // Compatible with the situation where the function is turned off when the user is on the page.
      const { isSellSectionShow } = await refreshRampShow();
      if (!isSellSectionShow) {
        setButtonLoading(false);
        singleMessage.error(SERVICE_UNAVAILABLE_TEXT);
        return navigate('/');
      }

      // CHECK 2: manager sync
      const _isManagerSynced = await checkManagerSynced();
      if (!_isManagerSynced) return setButtonLoading(false);

      // CHECK 3: account security
      const securityRes = await checkSecurity(cryptoSelectedRef.current.chainId);
      if (!securityRes) return setButtonLoading(false);

      // CHECK 4: balance and tx fee
      const chainId = cryptoSelectedRef.current.chainId;
      const currentChain = getCurrentChain(chainId);
      if (!currentChain) return setButtonLoading(false);
      const _address = accountTokenList[0]?.tokens?.find((ele) => ele.chainId === chainId)?.tokenContractAddress;
      // search balance from contract
      const result = await getBalance({
        rpcUrl: currentChain.endPoint,
        address: _address || '',
        chainType: currentNetwork.walletType,
        paramsOption: {
          owner: wallet[chainId as ChainId]?.caAddress || '',
          symbol: currentChain.defaultToken.symbol,
        },
      });
      setButtonLoading(false);
      const balance = result.result.balance;
      const achFee = getOneTxFee(chainId, 'MAINNET');
      if (
        ZERO.plus(divDecimals(balance, currentChain.defaultToken.decimals)).isLessThanOrEqualTo(
          ZERO.plus(achFee.ach).plus(cryptoAmountRef.current),
        )
      ) {
        throw new Error('Insufficient funds');
      }

      // CHECK 5: transfer limit
      const limitRes = await checkLimit({
        chainId: cryptoSelectedRef.current.chainId,
        symbol: cryptoSelectedRef.current.symbol,
        amount: amount,
        decimals: cryptoSelectedRef.current.decimals,
        from: ICheckLimitBusiness.RAMP_SELL,
        balance,
        extra: {
          side: RampType.SELL,
          country: fiatSelectedRef.current.country,
          fiat: fiatSelectedRef.current.symbol,
          crypto: cryptoSelectedRef.current.symbol,
          network: cryptoSelectedRef.current.network,
          amount: cryptoAmountRef.current,
        },
        onOneTimeApproval: handleOneTimeApproval,
      });
      if (!limitRes) return setButtonLoading(false);
      goPreview();
    } catch (error: any) {
      setAmountLocalError({ ...INIT_HAS_ERROR, errorMsg: error?.message || error });
    } finally {
      setButtonLoading(false);
    }
  }, [
    accountTokenList,
    amount,
    checkLimit,
    checkManagerSynced,
    checkSecurity,
    currentNetwork.walletType,
    getCurrentChain,
    getOneTxFee,
    goPreview,
    handleOneTimeApproval,
    navigate,
    refreshRampShow,
    wallet,
  ]);
  const onChangeCurrency = useCallback(() => {
    if (!fiatList.length) {
      return;
    }
    setOpenFiatModal(true);
  }, [fiatList]);
  const onSearchInputChange = useCallback(
    (text: string) => {
      setSearchKeyword(text.trim());
    },
    [setSearchKeyword],
  );
  const filteredList = useMemo(() => {
    if (debounceSearchKeyword.length <= 0) return fiatList;
    return fiatList.filter((item) =>
      `${item.countryName} (${item.symbol})`.toLowerCase().includes(debounceSearchKeyword.toLowerCase()),
    );
  }, [fiatList, debounceSearchKeyword]);
  const maxAmount = useMemo(() => {
    return formatTokenAmountShowWithDecimals(tokenInfo?.balance, tokenInfo?.decimals);
  }, [tokenInfo]);

  const onMaxPress = useCallback(() => {
    const maxAmountNumber = Number(maxAmount);
    if (Number.isNaN(maxAmountNumber)) {
      return;
    }
    if (ZERO.plus(maxAmountNumber).isLessThanOrEqualTo(achFee)) {
      singleMessage.error('Insufficient funds');
      return;
    }
    onAmountInput(`${maxAmountNumber - achFee}`);
  }, [maxAmount, achFee, onAmountInput]);
  const receiveAmountText = useMemo(() => {
    if (!currency?.fiat?.symbol) {
      return '';
    }
    if (receiveAmount === '') {
      return `0 ${currency.fiat.symbol}`;
    }
    return `≈ ${receiveAmount} ${currency.fiat.symbol}`;
  }, [receiveAmount, currency]);
  const selectedItem = useMemo(() => currency.fiat || fiatList[0], [currency.fiat, fiatList]);
  const onApprovalSuccess = useCallback(
    (approveList: any[]) => {
      try {
        if (Array.isArray(approveList) && approveList.length > 0) {
          setApprovalVisible(false);
          goPreview(approveList);
        } else {
          console.log('getApprove error: approveList empty');
        }
      } catch (error) {
        console.log('getApprove error: set list error');
      }
    },
    [goPreview],
  );
  return (
    <RampSellPureComponent
      selectedCrypto={selectedCrypto}
      currency={currency}
      maxAmount={maxAmount}
      amount={amount}
      amountError={amountError}
      textInputRef={textInputRef}
      receiveAmountText={receiveAmountText}
      buttonLoading={buttonLoading}
      isAllowAmount={isAllowAmount}
      approvalVisible={approvalVisible}
      networkType={currentNetwork.networkType}
      caHash={wallet.caHash || ''}
      originChainId={originChainId}
      openFiatModal={openFiatModal}
      filteredList={filteredList}
      selectedItem={selectedItem}
      init={init}
      onBack={() => {
        navigate(-1);
      }}
      onChangeCurrency={onChangeCurrency}
      onMaxPress={onMaxPress}
      onAmountInput={onAmountInput}
      handleNext={handleNext}
      setApprovalVisible={setApprovalVisible}
      onApprovalSuccess={onApprovalSuccess}
      setOpenFiatModal={setOpenFiatModal}
      onSearchInputChange={onSearchInputChange}
      onFiatChange={onFiatChange}
    />
  );
}
