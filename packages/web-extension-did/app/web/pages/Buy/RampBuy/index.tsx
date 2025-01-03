import { ErrorType, INIT_HAS_ERROR, INIT_NONE_ERROR } from '@portkey-wallet/constants/constants-ca/common';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useBuyCryptoList } from '@portkey-wallet/hooks/hooks-ca/ramp';
import { useReceive } from '@portkey-wallet/hooks/hooks-ca/ramp/useReceive';
import { IRampCryptoItem, IRampFiatItem, RampType } from '@portkey-wallet/ramp';
import { ChainId } from '@portkey-wallet/types';
import { isEqual } from '@portkey-wallet/utils';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { getBuyFiat, getBuyLimit } from '@portkey-wallet/utils/ramp';
import { isPotentialNumber } from '@portkey-wallet/utils/reg';
import { IRampLimit, RampBuyPureComponent, setLoading, singleMessage } from '@portkey/did-ui-react';
import { useExtensionRampEntryShow } from 'hooks/ramp';
import { useLocationState } from 'hooks/router';
import useDebounce from 'hooks/useDebounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

export default function RampBuy() {
  const { state: selectedCrypto } = useLocationState<{
    symbol: string;
    network: string;
    chainId: ChainId;
    icon?: string;
  }>();
  const navigate = useNavigate();
  const { symbol, network } = selectedCrypto;
  const textInputRef = useRef<HTMLInputElement>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { refreshRampShow } = useExtensionRampEntryShow();
  const { buyCryptoList } = useBuyCryptoList();
  const [fiatList, setFiatList] = useState<IRampFiatItem[]>([]);
  const [init, setInit] = useState(false);

  const [currency, setCurrency] = useState<{
    crypto?: IRampCryptoItem;
    fiat?: IRampFiatItem;
  }>({
    crypto: buyCryptoList.find((item) => item.symbol === symbol && item.network === network),
    fiat: undefined,
  });
  const currencyRef = useRef(currency);
  currencyRef.current = currency;
  const fiat = useMemo(() => currency.fiat, [currency]);
  const crypto = useMemo(() => currency.crypto, [currency]);

  const [amount, setAmount] = useState<string>('');
  const [amountLocalError, setAmountLocalError] = useState<ErrorType>(INIT_NONE_ERROR);
  const [openFiatModal, setOpenFiatModal] = useState<boolean>(false);

  const refreshList = useCallback(async () => {
    setLoading(true);
    try {
      const { fiatList: buyFiatList, defaultFiat: buyDefaultFiat } = await getBuyFiat({ crypto: symbol, network });
      setFiatList(buyFiatList);
      const _fiat = buyFiatList.find(
        (item) => item.symbol === buyDefaultFiat.symbol && item.country === buyDefaultFiat.country,
      );
      setCurrency((pre) => ({
        ...pre,
        fiat: _fiat,
      }));
    } catch (error) {
      console.log('buyForm refreshList error', error);
    } finally {
      setLoading(false);
      setInit(true);
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }
  }, [network, symbol]);
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
      const limitResult = await getBuyLimit({
        crypto: _crypto.symbol,
        network: _crypto.network,
        fiat: _fiat.symbol,
        country: _fiat.country,
      });
      if (isEqual(_fiat, currencyRef.current.fiat) && isEqual(_crypto, currencyRef.current.crypto)) {
        limitAmountRef.current = limitResult;
      }
    } catch (error) {
      console.log('Buy setLimitAmount', error);
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
    type: RampType.BUY,
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

  const receiveAmountText = useMemo(() => {
    if (receiveAmount === '') {
      return `0 ${crypto?.symbol}`;
    }
    return `≈ ${receiveAmount} ${crypto?.symbol}`;
  }, [receiveAmount, crypto]);

  const onFiatChange = useCallback(async (_fiat: IRampFiatItem) => {
    setCurrency((pre) => ({
      ...pre,
      fiat: _fiat,
    }));
  }, []);

  const onChooseChange = useCallback(async () => {
    isRefreshReceiveValid.current = false;
    setAmountLocalError(INIT_NONE_ERROR);
    await setLimitAmount();
    refreshReceiveRef.current?.();
  }, [setLimitAmount]);

  useEffect(() => {
    // only fiat||crypto change or init will trigger
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
    setAmount(text);
  }, []);

  const onNext = useCallback(async () => {
    if (!crypto || !fiat) {
      return;
    }
    if (!limitAmountRef.current || !refreshReceiveRef.current) {
      return;
    }
    const amountNum = Number(amount);
    const { minLimit, maxLimit } = limitAmountRef.current;
    if (amountNum < minLimit || amountNum > maxLimit) {
      setAmountLocalError({
        ...INIT_HAS_ERROR,
        errorMsg: `Buy limit: ${formatAmountShow(minLimit, 4)} to ${formatAmountShow(maxLimit, 4)} ${
          fiat?.symbol || ''
        }`,
      });
      return;
    }

    setButtonLoading(true);
    let isBuySectionShow = false;
    try {
      const result = await refreshRampShow();
      isBuySectionShow = result.isBuySectionShow;
    } catch (error) {
      console.log(error);
    }
    if (!isBuySectionShow) {
      singleMessage.error('Sorry, the service you are using is temporarily unavailable.');
      navigate('/');
      setButtonLoading(false);
      return;
    }

    // let _rate = rate;
    if (isRefreshReceiveValid.current === false) {
      const rst = await refreshReceiveRef.current();
      setButtonLoading(false);
      if (!rst) {
        return;
      }
      // _rate = rst.rate;
    }

    setButtonLoading(false);

    navigate('/buy/preview', {
      state: {
        crypto: crypto.symbol,
        network: crypto.network,
        fiat: fiat.symbol,
        country: fiat.country,
        amount: amount,
        side: RampType.BUY,
        // tokenInfo: state ? state.tokenInfo : null,
        // mainPageInfo: {
        //   pageName: props?.mainPageInfo?.pageName,
        // },
      },
    });
  }, [crypto, fiat, amount, navigate, refreshRampShow]);

  const onChangeCurrency = useCallback(() => {
    if (!fiatList.length) {
      return;
    }
    setOpenFiatModal(true);
  }, [fiatList]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const debounceSearchKeyword = useDebounce(searchKeyword, 800);
  const filteredList = useMemo(() => {
    if (debounceSearchKeyword.length <= 0) return fiatList;
    return fiatList.filter((item) =>
      `${item.countryName} (${item.symbol})`.toLowerCase().includes(debounceSearchKeyword.toLowerCase()),
    );
  }, [fiatList, debounceSearchKeyword]);
  const onSearchInputChange = useCallback(
    (text: string) => {
      setSearchKeyword(text.trim());
    },
    [setSearchKeyword],
  );
  const selectedItem = useMemo(() => currency.fiat || fiatList[0], [currency.fiat, fiatList]);

  return (
    <RampBuyPureComponent
      selectedCrypto={selectedCrypto as any}
      currency={currency}
      openFiatModal={openFiatModal}
      amount={amount}
      amountError={amountError}
      textInputRef={textInputRef}
      receiveAmountText={receiveAmountText}
      buttonLoading={buttonLoading}
      isAllowAmount={isAllowAmount}
      filteredList={filteredList}
      selectedItem={selectedItem}
      init={init}
      setOpenFiatModal={setOpenFiatModal}
      onBack={() => {
        navigate(-1);
      }}
      onChangeCurrency={onChangeCurrency}
      onAmountInput={onAmountInput}
      onNext={onNext}
      onSearchInputChange={onSearchInputChange}
      onFiatChange={onFiatChange}
    />
  );
}
