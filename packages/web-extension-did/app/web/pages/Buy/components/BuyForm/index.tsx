import { useTranslation } from 'react-i18next';
import FiatInput from '../FiatInput';
import CryptoInput from '../CryptoInput';
import { IRampCryptoItem, IRampFiatItem, RampType } from '@portkey-wallet/ramp';
import {
  useBuyDefaultCryptoListState,
  useBuyDefaultCryptoState,
  useBuyDefaultFiatState,
  useBuyFiatListState,
  useRampEntryShow,
} from '@portkey-wallet/hooks/hooks-ca/ramp';
import { useCallback, useMemo, useRef, useState } from 'react';
import { handleKeyDown } from 'utils/keyDown';
import { getBuyLimit, getBuyPrice } from '@portkey-wallet/utils/ramp';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import ExchangeRate from '../ExchangeRate';
import { useUpdateReceiveAndInterval } from 'pages/Buy/hooks';
import { useLoading } from 'store/Provider/hooks';
import { Button, message } from 'antd';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { SERVICE_UNAVAILABLE_TEXT } from '@portkey-wallet/constants/constants-ca/payment';
import { useNavigate } from 'react-router';
import { useFetchTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';

export default function BuyForm() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  // const { state } = useLocation();

  // get data
  const { refreshRampShow } = useRampEntryShow();
  const { symbol: defaultFiat, amount: defaultFiatAmount, country: defaultCountry } = useBuyDefaultFiatState();
  const { symbol: defaultCrypto, network: defaultNetwork } = useBuyDefaultCryptoState();
  const fiatList = useBuyFiatListState();
  const defaultCryptoList = useBuyDefaultCryptoListState();
  const filterFiatSelected = useMemo(
    () => fiatList.filter((item) => item.symbol === defaultFiat && item.country === defaultCountry),
    [defaultCountry, defaultFiat, fiatList],
  );
  const filterCryptoSelected = useMemo(
    () => defaultCryptoList.filter((item) => item.symbol === defaultCrypto && item.network === defaultNetwork),
    [defaultCrypto, defaultCryptoList, defaultNetwork],
  );
  useFetchTxFee(); // TODO

  // 15s interval
  const { exchange, updateTime, errMsg, buyErrMsgHandler } = useUpdateReceiveAndInterval(RampType.BUY);

  // pay
  const [fiatAmount, setFiatAmount] = useState<string>(defaultFiatAmount);
  const fiatAmountRef = useRef<string>(defaultFiatAmount);
  const [fiatSelected, setFiatSelected] = useState<IRampFiatItem>({ ...filterFiatSelected[0] });
  const fiatSelectedRef = useRef<IRampFiatItem>({ ...filterFiatSelected[0] });

  //receive
  const [cryptoAmount, setCryptoAmount] = useState<string>('');
  const cryptoAmountRef = useRef<string>('');
  const [cryptoSelected, setCryptoSelected] = useState<IRampCryptoItem>({ ...filterCryptoSelected[0] });
  const cryptoSelectedRef = useRef<IRampCryptoItem>({ ...filterCryptoSelected[0] });

  const minLimitRef = useRef<number>();
  const maxLimitRef = useRef<number>();
  const disabled = useMemo(() => !!errMsg || !fiatAmount, [errMsg, fiatAmount]);

  const handleFiatChange = useCallback(
    async (v: string) => {
      fiatAmountRef.current = v;
      setFiatAmount(v);

      const { cryptoAmount } = await getBuyPrice({
        fiat: fiatSelectedRef.current.symbol,
        country: fiatSelectedRef.current.country,
        fiatAmount: fiatAmountRef.current,
        network: cryptoSelectedRef.current.network,
        crypto: cryptoSelectedRef.current.symbol,
      });
      cryptoAmountRef.current = formatAmountShow(Number(cryptoAmount), 4);
      setCryptoAmount(cryptoAmountRef.current);

      // check min<amount<max
      const { minLimit, maxLimit } = await getBuyLimit({
        crypto: cryptoSelectedRef.current.symbol,
        network: cryptoSelectedRef.current.network,
        fiat: fiatSelectedRef.current.symbol,
        country: fiatSelectedRef.current.country,
      });
      minLimitRef.current = minLimit;
      maxLimitRef.current = maxLimit;
      buyErrMsgHandler({ fiat: fiatSelectedRef.current.symbol, fiatAmount: v, min: minLimit, max: maxLimit });
    },
    [buyErrMsgHandler],
  );

  const handleFiatSelect = useCallback(
    (v: IRampFiatItem) => {
      setFiatSelected(v);

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

  const handleCryptoSelect = useCallback(
    (v: IRampCryptoItem) => {
      setCryptoSelected(v);

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

  const showRateText = useMemo(
    () => `1 ${fiatSelected.symbol} ≈ ${formatAmountShow(exchange, 2)} ${cryptoSelected.symbol}`,
    [fiatSelected.symbol, exchange, cryptoSelected.symbol],
  );

  const handleNext = useCallback(async () => {
    try {
      setLoading(true);

      // Compatible with the situation where the function is turned off when the user is on the page.
      const { isBuySectionShow } = await refreshRampShow();
      setLoading(false);
      if (!isBuySectionShow) {
        message.error(SERVICE_UNAVAILABLE_TEXT);
        return navigate('/');
      }

      navigate('/buy/preview', {
        state: {
          crypto: cryptoSelectedRef.current.symbol,
          network: cryptoSelectedRef.current.network,
          fiat: fiatSelectedRef.current.symbol,
          country: fiatSelectedRef.current.country,
          amount: cryptoAmountRef.current,
          side: RampType.BUY,
          // tokenInfo: state ? state.tokenInfo : null, // TODO
        },
      });
    } catch (error) {
      message.error(handleErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [navigate, refreshRampShow, setLoading]);

  return (
    <>
      <div className="buy-form flex-column-center">
        <div className="buy-input">
          <div className="label">{`I want to pay`}</div>
          <FiatInput
            value={fiatAmount}
            readOnly={false}
            onChange={handleFiatChange}
            onSelect={handleFiatSelect}
            onKeyDown={handleKeyDown}
            curFiat={fiatSelected}
          />
          {!!errMsg && <div className="error-text">{t(errMsg)}</div>}
        </div>
        <div className="buy-input">
          <div className="label">{`I will receive≈`}</div>

          <CryptoInput
            value={cryptoAmount}
            curCrypto={cryptoSelected}
            readOnly={true}
            onSelect={handleCryptoSelect}
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
