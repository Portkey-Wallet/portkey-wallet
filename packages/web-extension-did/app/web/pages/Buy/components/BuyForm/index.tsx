import { useTranslation } from 'react-i18next';
import FiatInput from '../FiatInput';
import CryptoInput from '../CryptoInput';
import { IRampCryptoItem, IRampFiatItem, RampType } from '@portkey-wallet/ramp';
import {
  useBuyDefaultCryptoListState,
  useBuyDefaultCryptoState,
  useBuyDefaultFiatState,
  useBuyFiat,
  useBuyFiatListState,
} from '@portkey-wallet/hooks/hooks-ca/ramp';
import { useCallback, useMemo, useRef, useState } from 'react';
import { handleKeyDown } from 'utils/keyDown';
import ExchangeRate from '../ExchangeRate';
import { useUpdateReceiveAndInterval } from 'pages/Buy/hooks';
import { useLoading } from 'store/Provider/hooks';
import { Button } from 'antd';
import { SERVICE_UNAVAILABLE_TEXT } from '@portkey-wallet/constants/constants-ca/ramp';
import { useNavigate } from 'react-router';
import { generateRateText } from 'pages/Buy/utils';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { getBuyCrypto } from '@portkey-wallet/utils/ramp';
import singleMessage from 'utils/singleMessage';
import { useLocationState } from 'hooks/router';
import { TRampLocationState, TTokenDetailLocationState } from 'types/router';
import { useExtensionRampEntryShow } from 'hooks/ramp';

export interface IBuyFormProps {
  mainPageInfo?: {
    pageName: string;
    pageState?: any;
    newState: {
      fiat?: string;
      country?: string;
      crypto: string;
      network?: string;
      amount?: string;
      tokenInfo?: TTokenDetailLocationState;
    };
  };
}

export default function BuyForm(props: IBuyFormProps) {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { state: originState } = useLocationState<TRampLocationState>();
  const state = useMemo(
    () =>
      props?.mainPageInfo?.newState && props?.mainPageInfo?.pageName ? props?.mainPageInfo?.newState : originState,
    [originState, props?.mainPageInfo?.newState, props?.mainPageInfo?.pageName],
  );
  // get data
  const { refreshRampShow } = useExtensionRampEntryShow();
  const { symbol: defaultFiat, amount: defaultFiatAmount, country: defaultCountry } = useBuyDefaultFiatState();
  const { symbol: defaultCrypto, network: defaultNetwork } = useBuyDefaultCryptoState();
  const fiatList = useBuyFiatListState();
  const defaultCryptoList = useBuyDefaultCryptoListState();
  const [supportCryptoList, setSupportCryptoList] = useState<IRampCryptoItem[]>(defaultCryptoList);
  const filterFiatSelected = useMemo(() => {
    return fiatList.filter(
      (item) => item.symbol === (state?.fiat || defaultFiat) && item.country === (state?.country || defaultCountry),
    );
  }, [defaultCountry, defaultFiat, fiatList, state?.country, state?.fiat]);
  const filterCryptoSelected = useMemo(() => {
    return defaultCryptoList.filter(
      (item) => item.symbol === (state?.crypto || defaultCrypto) && item.network === (state?.network || defaultNetwork),
    );
  }, [defaultCrypto, defaultCryptoList, defaultNetwork, state?.crypto, state?.network]);

  // pay
  const [fiatAmount, setFiatAmount] = useState<string>(state?.amount || defaultFiatAmount);
  const fiatAmountRef = useRef<string>(state?.amount || defaultFiatAmount);
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

          setSupportCryptoList(buyCryptoList);

          await updateBuyReceive();
        }
      } catch (error) {
        console.log('handleFiatSelect error:', error);
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
        console.log('handleCryptoSelect error:', error);
      }
    },
    [updateBuyReceive],
  );

  const { getSpecifiedFiat } = useBuyFiat();
  const fetchSpecifiedFiat = useCallback(async () => {
    if (state?.crypto && state?.tokenInfo?.symbol) return;
    try {
      setLoading(true);
      const fiatResult = await getSpecifiedFiat({ crypto: state?.crypto || state?.tokenInfo?.symbol });
      if (fiatResult?.defaultFiat) {
        await handleFiatSelect(fiatResult?.defaultFiat);
        if (fiatResult?.defaultCrypto) {
          await handleCryptoSelect(fiatResult?.defaultCrypto);
        }
      }
    } catch (error) {
      console.log('fetchSpecifiedFiat error', error);
    } finally {
      setLoading(false);
    }
  }, [getSpecifiedFiat, handleCryptoSelect, handleFiatSelect, setLoading, state?.crypto, state?.tokenInfo?.symbol]);

  useEffectOnce(() => {
    fetchSpecifiedFiat();
    updateBuyReceive();
  });

  const handleNext = useCallback(async () => {
    try {
      setLoading(true);

      // Compatible with the situation where the function is turned off when the user is on the page.
      const { isBuySectionShow } = await refreshRampShow();
      setLoading(false);
      if (!isBuySectionShow) {
        singleMessage.error(SERVICE_UNAVAILABLE_TEXT);
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
          mainPageInfo: {
            pageName: props?.mainPageInfo?.pageName,
          },
        },
      });
    } catch (error) {
      console.log('go preview error:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate, props?.mainPageInfo?.pageName, refreshRampShow, setLoading, state]);

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
            supportList={supportCryptoList}
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
