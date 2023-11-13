import { useTranslation } from 'react-i18next';
import FiatInput from '../FiatInput';
import CryptoInput from '../CryptoInput';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  useRampEntryShow,
  useSellCryptoListState,
  useSellDefaultCryptoState,
  useSellDefaultFiatListState,
  useSellDefaultFiatState,
} from '@portkey-wallet/hooks/hooks-ca/ramp';
import { IRampCryptoItem, IRampFiatItem, RampType } from '@portkey-wallet/ramp';
import { handleKeyDown } from 'utils/keyDown';
import { getSellLimit, getSellPrice } from '@portkey-wallet/utils/ramp';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import ExchangeRate from '../ExchangeRate';
import { useUpdateReceiveAndInterval } from 'pages/Buy/hooks';
import { useLoading } from 'store/Provider/hooks';
import { useEffectOnce } from 'react-use';
import { Button, message } from 'antd';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { SERVICE_UNAVAILABLE_TEXT } from '@portkey-wallet/constants/constants-ca/payment';
import { useNavigate } from 'react-router';
import { useAssets } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';

export default function SellFrom() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  // const { state } = useLocation();

  // get data
  const { refreshRampShow } = useRampEntryShow();
  const { symbol: defaultCrypto, network: defaultNetwork, amount: defaultCryptoAmount } = useSellDefaultCryptoState();
  const { symbol: defaultFiat, country: defaultCountry } = useSellDefaultFiatState();
  const cryptoList = useSellCryptoListState();
  const defaultFiatList = useSellDefaultFiatListState();
  const filterCryptoSelected = useMemo(
    () => cryptoList.filter((item) => item.symbol === defaultCrypto && item.network === defaultNetwork),
    [cryptoList, defaultCrypto, defaultNetwork],
  );
  const filterFiatSelected = useMemo(
    () => defaultFiatList.filter((item) => item.symbol === defaultFiat && item.country === defaultCountry),
    [defaultCountry, defaultFiat, defaultFiatList],
  );
  useFetchTxFee(); // TODO

  // 15s interval
  const {
    exchange,
    updateTime,
    errMsg,
    warningMsg,
    updateSellReceive,
    sellErrMsgHandler,
    setInsufficientFundsMsg,
    checkManagerSynced,
  } = useUpdateReceiveAndInterval(RampType.SELL);

  // pay
  const [cryptoAmount, setCryptoAmount] = useState<string>(defaultCryptoAmount);
  const cryptoAmountRef = useRef<string>('');
  const [cryptoSelected, setCryptoSelected] = useState<IRampCryptoItem>({ ...filterCryptoSelected[0] });
  const cryptoSelectedRef = useRef<IRampCryptoItem>({ ...filterCryptoSelected[0] });

  // receive
  const [fiatAmount, setFiatAmount] = useState('');
  const fiatAmountRef = useRef<string>('');
  const [fiatSelected, setFiatSelected] = useState<IRampFiatItem>({ ...filterFiatSelected[0] });
  const fiatSelectedRef = useRef<IRampFiatItem>({ ...filterFiatSelected[0] });

  const minLimitRef = useRef<number>();
  const maxLimitRef = useRef<number>();
  const disabled = useMemo(() => !!errMsg || !cryptoAmount, [cryptoAmount, errMsg]);

  // change handler
  const onCryptoChange = (val: string) => {
    const arr = val.split('.');
    // No more than eight digits after the decimal point
    if (arr[1]?.length > 8) return;
    // The total number does not exceed 13 digits, not include decimal point
    if (arr.join('').length > 13) return;

    handleCryptoChange(val);
  };

  const handleCryptoChange = useCallback(
    async (v: string) => {
      setCryptoAmount(v);
      cryptoAmountRef.current = v;

      const { fiatAmount } = await getSellPrice({
        network: cryptoSelectedRef.current.network,
        crypto: cryptoSelectedRef.current.symbol,
        cryptoAmount: cryptoAmountRef.current,
        fiat: fiatSelectedRef.current.symbol,
        country: fiatSelectedRef.current.country,
      });

      fiatAmountRef.current = formatAmountShow(Number(fiatAmount), 4);
      setFiatAmount(fiatAmountRef.current);

      // check min<amount<max
      const { minLimit, maxLimit } = await getSellLimit({
        crypto: cryptoSelectedRef.current.symbol,
        network: cryptoSelectedRef.current.network,
        fiat: fiatSelectedRef.current.symbol,
        country: fiatSelectedRef.current.country,
      });
      minLimitRef.current = minLimit;
      maxLimitRef.current = maxLimit;
      sellErrMsgHandler({ crypto: cryptoSelectedRef.current.symbol, cryptoAmount: v, min: minLimit, max: maxLimit });
    },
    [sellErrMsgHandler],
  );

  const handleCryptoSelect = useCallback(
    (v: IRampCryptoItem) => {
      if (v.symbol && v.network) {
        setCryptoSelected(v);
        // valueSaveRef.current.fiat = v.symbol;
        // valueSaveRef.current.country = v.country;
      } else {
        return;
      }

      try {
        setLoading(true);
        // TODO update receive
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading],
  );

  const handleFiatSelect = useCallback(
    (v: IRampFiatItem) => {
      if (v.symbol && v.country) {
        setFiatSelected(v);
        // valueSaveRef.current.fiat = v.symbol;
        // valueSaveRef.current.country = v.country;
      } else {
        return;
      }

      try {
        setLoading(true);
        // TODO update receive
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading],
  );

  const showRateText = useMemo(
    () => `1 ${cryptoSelected.symbol} ≈ ${formatAmountShow(exchange, 2)} ${fiatSelected.symbol}`,
    [fiatSelected.symbol, exchange, cryptoSelected.symbol],
  );

  const {
    accountToken: { accountTokenList },
  } = useAssets();
  const currentChain = useCurrentChain('AELF'); // TODO
  const currentNetwork = useCurrentNetworkInfo();
  const defaultToken = useDefaultToken('AELF'); // TODO
  const wallet = useCurrentWalletInfo();
  const { ach: achFee } = useGetTxFee('AELF');

  const handleNext = useCallback(async () => {
    try {
      setLoading(true);

      // Compatible with the situation where the function is turned off when the user is on the page.
      const { isSellSectionShow } = await refreshRampShow();
      if (!isSellSectionShow) {
        setLoading(false);
        message.error(SERVICE_UNAVAILABLE_TEXT);
        return navigate('/');
      }

      if (!currentChain) return setLoading(false);

      const _isManagerSynced = await checkManagerSynced();
      if (!_isManagerSynced) return setLoading(false);

      // search balance from contract
      const result = await getBalance({
        rpcUrl: currentChain.endPoint,
        address: accountTokenList[0].tokenContractAddress || '',
        chainType: currentNetwork.walletType,
        paramsOption: {
          owner: wallet['AELF']?.caAddress || '',
          symbol: defaultToken.symbol,
        },
      });
      setLoading(false);
      const balance = result.result.balance;

      if (
        ZERO.plus(divDecimals(balance, defaultToken.decimals)).isLessThanOrEqualTo(
          ZERO.plus(achFee).plus(cryptoAmountRef.current),
        )
      ) {
        setInsufficientFundsMsg();
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
          // tokenInfo: state ? state.tokenInfo : null, // TODO
        },
      });
    } catch (error) {
      message.error(handleErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [
    accountTokenList,
    achFee,
    checkManagerSynced,
    currentChain,
    currentNetwork.walletType,
    defaultToken.decimals,
    defaultToken.symbol,
    navigate,
    refreshRampShow,
    setInsufficientFundsMsg,
    setLoading,
    wallet,
  ]);

  useEffectOnce(() => {
    updateSellReceive({
      network: cryptoSelectedRef.current.network,
      crypto: cryptoSelectedRef.current.symbol,
      cryptoAmount: cryptoAmountRef.current,
      fiat: fiatSelectedRef.current.symbol,
      country: fiatSelectedRef.current.country,
      fiatAmount: '',
    });
  });

  return (
    <>
      <div className="sell-form flex-column-center">
        <div className="sell-input">
          <div className="label">{`I want to sell`}</div>
          <CryptoInput
            value={cryptoAmount}
            readOnly={false}
            curCrypto={cryptoSelected}
            onChange={onCryptoChange}
            onSelect={handleCryptoSelect}
            onKeyDown={handleKeyDown}
          />
          {!!errMsg && <div className="error-text">{t(errMsg)}</div>}
          {!!warningMsg && <div className="warning-text">{t(warningMsg)}</div>}
        </div>
        <div className="sell-input">
          <div className="label">{`I will receive≈`}</div>
          <FiatInput
            value={fiatAmount}
            readOnly={true}
            curFiat={fiatSelected}
            onSelect={handleFiatSelect}
            onKeyDown={handleKeyDown}
          />
        </div>
        {exchange !== '' && <ExchangeRate showRateText={showRateText} rateUpdateTime={updateTime} />}
      </div>
      <div className="ramp-footer">
        <Button type="primary" htmlType="submit" disabled={disabled} onClick={handleNext}>
          {t('Next')}
        </Button>
      </div>
    </>
  );
}
