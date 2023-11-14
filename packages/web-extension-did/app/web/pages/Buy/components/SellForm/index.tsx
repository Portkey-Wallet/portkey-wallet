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
import { divDecimals } from '@portkey-wallet/utils/converter';
import ExchangeRate from '../ExchangeRate';
import { useUpdateReceiveAndInterval } from 'pages/Buy/hooks';
import { useLoading } from 'store/Provider/hooks';
import { useEffectOnce } from 'react-use';
import { Button, message } from 'antd';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { SERVICE_UNAVAILABLE_TEXT } from '@portkey-wallet/constants/constants-ca/ramp';
import { useLocation, useNavigate } from 'react-router';
import { useAssets } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { generateRateText } from 'pages/Buy/utils';
import { getSellFiat } from '@portkey-wallet/utils/ramp';

export default function SellFrom() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { state } = useLocation();

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

  // pay
  const [cryptoAmount, setCryptoAmount] = useState<string>(defaultCryptoAmount);
  const cryptoAmountRef = useRef<string>(defaultCryptoAmount);
  const [cryptoSelected, setCryptoSelected] = useState<IRampCryptoItem>({ ...filterCryptoSelected[0] });
  const cryptoSelectedRef = useRef<IRampCryptoItem>({ ...filterCryptoSelected[0] });

  // receive
  const [fiatSelected, setFiatSelected] = useState<IRampFiatItem>({ ...filterFiatSelected[0] });
  const fiatSelectedRef = useRef<IRampFiatItem>({ ...filterFiatSelected[0] });

  // 15s interval
  const {
    receive,
    exchange,
    updateTime,
    errMsg,
    warningMsg,
    updateSellReceive,
    setInsufficientFundsMsg,
    checkManagerSynced,
  } = useUpdateReceiveAndInterval(RampType.SELL, {
    cryptoSelectedRef,
    fiatSelectedRef,
    cryptoAmountRef,
  });

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

      await updateSellReceive();
    },
    [updateSellReceive],
  );

  const handleCryptoSelect = useCallback(
    async (v: IRampCryptoItem) => {
      try {
        if (v.symbol && v.network) {
          setCryptoSelected(v);
          cryptoSelectedRef.current = v;

          // update fiat list and fiat default
          const { sellDefaultFiat, sellFiatList } = await getSellFiat({ crypto: v.symbol, network: v.network });
          const sellFiatSelectedExit = sellFiatList.filter(
            (item) =>
              item.symbol === fiatSelectedRef.current.symbol && item.country === fiatSelectedRef.current.country,
          );
          if (sellFiatSelectedExit.length > 0) {
            // latest fiatSelected - exit
            fiatSelectedRef.current = sellFiatSelectedExit[0];
          } else {
            // latest fiatSelected - not exit
            const newDefaultFiat = sellFiatList.filter(
              (item) => item.symbol === sellDefaultFiat.symbol && item.country === sellDefaultFiat.country,
            );
            setFiatSelected({ ...newDefaultFiat[0] });
            fiatSelectedRef.current = { ...newDefaultFiat[0] };
          }

          await updateSellReceive();
        }
      } catch (error) {
        message.error(handleErrorMessage(error));
      }
    },
    [updateSellReceive],
  );

  const handleFiatSelect = useCallback(
    async (v: IRampFiatItem) => {
      try {
        if (v.symbol && v.country) {
          setFiatSelected(v);
          fiatSelectedRef.current = v;
          await updateSellReceive();
        }
      } catch (error) {
        message.error(handleErrorMessage(error));
      }
    },
    [updateSellReceive],
  );

  const showRateText = generateRateText(cryptoSelected.symbol, exchange, fiatSelected.symbol);

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
          tokenInfo: state ? state.tokenInfo : null,
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
    state,
    wallet,
  ]);

  useEffectOnce(() => {
    updateSellReceive();
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
            value={receive}
            readOnly={true}
            curFiat={fiatSelected}
            defaultCrypto={defaultCrypto}
            network={defaultNetwork}
            onSelect={handleFiatSelect}
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
