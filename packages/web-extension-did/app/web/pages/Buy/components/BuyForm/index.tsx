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
import ExchangeRate from '../ExchangeRate';
import { useUpdateReceiveAndInterval } from 'pages/Buy/hooks';
import { useLoading } from 'store/Provider/hooks';
import { Button, message } from 'antd';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { SERVICE_UNAVAILABLE_TEXT } from '@portkey-wallet/constants/constants-ca/ramp';
import { useLocation, useNavigate } from 'react-router';
import { useFetchTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { generateRateText } from 'pages/Buy/utils';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { getBuyCrypto } from '@portkey-wallet/utils/ramp';

export default function BuyForm() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { state } = useLocation();

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

  // pay
  const [fiatAmount, setFiatAmount] = useState<string>(defaultFiatAmount);
  const fiatAmountRef = useRef<string>(defaultFiatAmount);
  const [fiatSelected, setFiatSelected] = useState<IRampFiatItem>({ ...filterFiatSelected[0] });
  const fiatSelectedRef = useRef<IRampFiatItem>({ ...filterFiatSelected[0] });

  // receive
  const [cryptoSelected, setCryptoSelected] = useState<IRampCryptoItem>({ ...filterCryptoSelected[0] });
  const cryptoSelectedRef = useRef<IRampCryptoItem>({ ...filterCryptoSelected[0] });

  // 15s interval
  const { receive, exchange, updateTime, errMsg, updateBuyReceive } = useUpdateReceiveAndInterval(RampType.BUY, {
    cryptoSelectedRef,
    fiatSelectedRef,
    fiatAmountRef,
  });

  const disabled = useMemo(() => !!errMsg || !fiatAmount, [errMsg, fiatAmount]);

  const showRateText = generateRateText(cryptoSelected.symbol, exchange, fiatSelected.symbol);

  const handleFiatChange = useCallback(
    async (v: string) => {
      fiatAmountRef.current = v;
      setFiatAmount(v);
      await updateBuyReceive();
    },
    [updateBuyReceive],
  );

  const handleFiatSelect = useCallback(
    async (v: IRampFiatItem) => {
      try {
        if (v.symbol && v.country) {
          setFiatSelected(v);
          fiatSelectedRef.current = v;

          // update crypto list and crypto default
          const { buyDefaultCrypto, buyCryptoList } = await getBuyCrypto({ fiat: v.symbol, country: v.country });
          const buyCryptoSelectedExit = buyCryptoList.filter(
            (item) =>
              item.symbol === cryptoSelectedRef.current.symbol && item.network === cryptoSelectedRef.current.network,
          );
          if (buyCryptoSelectedExit.length > 0) {
            // latest cryptoSelected - exit
            cryptoSelectedRef.current = buyCryptoSelectedExit[0];
          } else {
            // latest cryptoSelected - not exit
            const newDefaultCrypto = buyCryptoList.filter(
              (item) => item.symbol === buyDefaultCrypto.symbol && item.network === buyDefaultCrypto.network,
            );
            setCryptoSelected({ ...newDefaultCrypto[0] });
            cryptoSelectedRef.current = { ...newDefaultCrypto[0] };
          }

          await updateBuyReceive();
        }
      } catch (error) {
        message.error(handleErrorMessage(error));
      }
    },
    [updateBuyReceive],
  );

  const handleCryptoSelect = useCallback(
    async (v: IRampCryptoItem) => {
      try {
        if (v.symbol && v.network) {
          setCryptoSelected(v);
          cryptoSelectedRef.current = v;
          await updateBuyReceive();
        }
      } catch (error) {
        message.error(handleErrorMessage(error));
      }
    },
    [updateBuyReceive],
  );

  useEffectOnce(() => {
    updateBuyReceive();
  });

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
          amount: fiatAmountRef.current,
          side: RampType.BUY,
          tokenInfo: state ? state.tokenInfo : null,
        },
      });
    } catch (error) {
      message.error(handleErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [navigate, refreshRampShow, setLoading, state]);

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
            value={receive}
            curCrypto={cryptoSelected}
            readOnly={true}
            defaultFiat={defaultFiat}
            country={defaultCountry}
            onSelect={handleCryptoSelect}
            onKeyDown={handleKeyDown}
          />
        </div>
        {exchange !== '' && !errMsg && <ExchangeRate showRateText={showRateText} rateUpdateTime={updateTime} />}
      </div>
      <div className="ramp-footer">
        <Button type="primary" htmlType="submit" disabled={disabled} onClick={handleNext}>
          {t('Next')}
        </Button>
      </div>
    </>
  );
}
