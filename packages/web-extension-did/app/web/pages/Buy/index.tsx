import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Radio, RadioChangeEvent, message } from 'antd';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useLocation, useNavigate } from 'react-router';
import { handleKeyDown } from 'utils/keyDown';
import { getOrderQuote, getCryptoInfo } from '@portkey-wallet/api/api-did/payment/util';
import { ZERO } from '@portkey-wallet/constants/misc';
import {
  DrawerType,
  initCrypto,
  initCurrency,
  initFiat,
  initToken,
  initValueSave,
  MAX_UPDATE_TIME,
  PartialFiatType,
} from './const';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import './index.less';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import { useAssets } from '@portkey-wallet/hooks/hooks-ca/assets';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { DEFAULT_FEE } from '@portkey-wallet/constants/constants-ca/wallet';
import BuyFrom from './components/BuyFrom';
import SellFrom from './components/SellFrom';
import { useEffectOnce } from 'react-use';
import { PaymentTypeEnum } from '@portkey-wallet/types/types-ca/payment';
import BigNumber from 'bignumber.js';

export default function Buy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isPrompt } = useCommonState();
  const updateTimeRef = useRef(MAX_UPDATE_TIME);
  const updateTimerRef = useRef<NodeJS.Timer | number>();
  const valueSaveRef = useRef({ ...initValueSave });
  const [errMsg, setErrMsg] = useState<string>('');
  const [page, setPage] = useState<PaymentTypeEnum>(PaymentTypeEnum.BUY);
  const [rate, setRate] = useState('');
  const [amount, setAmount] = useState(initCurrency);
  const [receive, setReceive] = useState('');
  const [curToken, setCurToken] = useState(initToken);
  const { setLoading } = useLoading();
  const [curFiat, setCurFiat] = useState<PartialFiatType>(initFiat);
  const [rateUpdateTime, setRateUpdateTime] = useState(MAX_UPDATE_TIME);

  const disabled = useMemo(() => !!errMsg || !amount, [errMsg, amount]);
  const showRateText = useMemo(
    () => `1 ${curToken.crypto} ≈ ${formatAmountShow(rate, 2)} ${curFiat.currency}`,
    [curFiat, curToken, rate],
  );

  useEffectOnce(() => {
    if (state && state.amount !== undefined) {
      const { amount, country, fiat, crypto, network, side } = state;
      setAmount(amount);
      setCurFiat({ country, currency: fiat });
      setCurToken({ crypto, network });
      setPage(side);
      valueSaveRef.current = {
        amount,
        currency: fiat,
        country,
        crypto,
        network,
        max: null,
        min: null,
        side,
      };
      updateReceive({
        crypto,
        network,
        fiat,
        country,
        amount,
        side,
      });
      updateCrypto(fiat);
    } else {
      updateCrypto();
      updateReceive();
    }
    return () => {
      clearInterval(updateTimerRef.current);
    };
  });

  const showLimitText = useCallback(
    (min: string | number, max: string | number, fiat = 'USD') =>
      `Limit Amount ${formatAmountShow(min, 4, BigNumber.ROUND_CEIL)}-${formatAmountShow(max)} ${fiat} `,
    [],
  );

  const isValidValue = useCallback(
    ({ amount, min, max }: { amount: string; min: string | number; max: string | number }) => {
      return (
        ZERO.plus(amount).isGreaterThanOrEqualTo(ZERO.plus(min)) &&
        ZERO.plus(amount).isLessThanOrEqualTo(ZERO.plus(max))
      );
    },
    [],
  );

  const setReceiveCase = useCallback(
    ({
      fiatQuantity,
      rampFee,
      cryptoQuantity,
    }: {
      fiatQuantity?: string;
      rampFee: string;
      cryptoQuantity?: string;
    }) => {
      if (valueSaveRef.current.side === PaymentTypeEnum.SELL && fiatQuantity && rampFee) {
        const receive = Number(fiatQuantity) - Number(rampFee);
        setReceive(formatAmountShow(receive, 4));
      }
      if (valueSaveRef.current.side === PaymentTypeEnum.BUY) {
        setReceive(formatAmountShow(cryptoQuantity || '', 4));
      }
    },
    [],
  );

  const setErrMsgCase = useCallback(() => {
    const { min, max, currency, crypto, side } = valueSaveRef.current;
    if (min !== null && max !== null) {
      clearInterval(updateTimerRef.current);
      if (side === PaymentTypeEnum.SELL) {
        setErrMsg(showLimitText(min, max, crypto));
      }
      if (side === PaymentTypeEnum.BUY) {
        setErrMsg(showLimitText(min, max, currency));
      }
    }
  }, [showLimitText]);

  const { updateReceive, handleSetTimer } = useMemo(() => {
    const updateReceive = async (
      params = {
        crypto: valueSaveRef.current.crypto,
        network: valueSaveRef.current.network,
        fiat: valueSaveRef.current.currency,
        country: valueSaveRef.current.country,
        amount: valueSaveRef.current.amount,
        side: valueSaveRef.current.side,
      },
    ) => {
      clearInterval(updateTimerRef.current);
      try {
        const rst = await getOrderQuote(params);
        if (params.amount !== valueSaveRef.current.amount) return;

        const { cryptoPrice, cryptoQuantity, fiatQuantity, rampFee } = rst;
        setReceiveCase({ fiatQuantity, rampFee, cryptoQuantity });
        setRate(cryptoPrice);
        setErrMsg('');
        handleSetTimer();
      } catch (error) {
        setReceive('');
        setRate('');
        setErrMsgCase();
        setRateUpdateTime(MAX_UPDATE_TIME);
        updateTimeRef.current = MAX_UPDATE_TIME;
        console.log('error', error);
      }
    };

    const handleSetTimer = () => {
      const timer = setInterval(() => {
        --updateTimeRef.current;
        if (updateTimeRef.current === 0) {
          updateReceive();
          updateTimeRef.current = MAX_UPDATE_TIME;
        }
        updateTimerRef.current = timer;
        setRateUpdateTime(updateTimeRef.current);
      }, 1000);
    };
    return { updateReceive, handleSetTimer };
  }, [setErrMsgCase, setReceiveCase]);

  const updateCrypto = useCallback(
    async (fiat = curFiat.currency || 'USD') => {
      const { crypto, network, side } = valueSaveRef.current;
      const data = await getCryptoInfo({ fiat }, crypto, network, side);
      if (side === PaymentTypeEnum.BUY) {
        if (data && data.maxPurchaseAmount !== null && data.minPurchaseAmount !== null) {
          valueSaveRef.current.max = data.maxPurchaseAmount;
          valueSaveRef.current.min = data.minPurchaseAmount;
        }
      } else {
        if (data && data.maxSellAmount !== null && data.minSellAmount !== null) {
          valueSaveRef.current.max = data.maxSellAmount;
          valueSaveRef.current.min = data.minSellAmount;
        }
      }
    },
    [curFiat.currency],
  );

  const handleInputChange = useCallback(
    (v: string) => {
      setAmount(v);
      valueSaveRef.current.amount = v;
      const { min, max } = valueSaveRef.current;
      if (max !== null && min !== null) {
        if (!isValidValue({ amount: v, min, max })) {
          setErrMsgCase();
          clearInterval(updateTimerRef.current);
          setRateUpdateTime(MAX_UPDATE_TIME);
          updateTimeRef.current = MAX_UPDATE_TIME;
          setReceive('');
          setRate('');
          return;
        }
      }
      const { crypto, network, country, currency, side } = valueSaveRef.current;
      updateReceive({
        crypto,
        network,
        fiat: currency,
        country,
        amount: v,
        side,
      });
    },
    [isValidValue, setErrMsgCase, updateReceive],
  );

  const getQuoteAndSetData = useCallback(async () => {
    const { crypto, currency, country, network, amount, side } = valueSaveRef.current;
    const rst = await getOrderQuote({
      crypto,
      network,
      fiat: currency,
      country,
      amount,
      side,
    });
    const { cryptoPrice, cryptoQuantity, fiatQuantity, rampFee } = rst;
    setReceiveCase({ fiatQuantity, rampFee, cryptoQuantity });
    setRate(cryptoPrice);
    setRateUpdateTime(MAX_UPDATE_TIME);
    updateTimeRef.current = MAX_UPDATE_TIME;
    handleSetTimer();
  }, [handleSetTimer, setReceiveCase]);

  const handlePageChange = useCallback(
    async (e: RadioChangeEvent) => {
      clearInterval(updateTimerRef.current);
      setPage(e.target.value);
      // BUY
      valueSaveRef.current = initValueSave;
      valueSaveRef.current.side = e.target.value;
      setAmount(initCurrency);
      // SELL
      if (e.target.value === PaymentTypeEnum.SELL) {
        setAmount(initCrypto);
        valueSaveRef.current.amount = initCrypto;
      }

      setCurFiat(initFiat);
      setErrMsg('');
      setReceive('');
      setRate('');
      try {
        setLoading(true);
        await getQuoteAndSetData();
        await updateCrypto();

        handleInputChange(valueSaveRef.current.amount);
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    },
    [getQuoteAndSetData, handleInputChange, setLoading, updateCrypto],
  );

  const handleSelect = useCallback(
    async (v: PartialFiatType, drawerType: DrawerType) => {
      if (drawerType === DrawerType.token) {
        // setCurToken(v);
      } else {
        if (v.currency && v.country) {
          setCurFiat(v);
          valueSaveRef.current.currency = v.currency;
          valueSaveRef.current.country = v.country;
        } else {
          return;
        }
        if (v.currency === curFiat.currency) return;
        try {
          clearInterval(updateTimerRef.current);
          setErrMsg('');
          setReceive('');
          setRate('');
          setLoading(true);
          const { crypto, network, amount, side } = valueSaveRef.current;
          const data = await getCryptoInfo({ fiat: v.currency }, crypto, network, side);
          if (side === PaymentTypeEnum.BUY) {
            if (data && data.maxPurchaseAmount !== null && data.minPurchaseAmount !== null) {
              valueSaveRef.current.max = data.maxPurchaseAmount;
              valueSaveRef.current.min = data.minPurchaseAmount;

              if (isValidValue({ amount, min: data.minPurchaseAmount, max: data.maxPurchaseAmount })) {
                await getQuoteAndSetData();
                setErrMsg('');
              } else {
                setErrMsgCase();
                setReceive('');
                setRate('');
              }
            } else {
              // not maxPurchaseAmount and minPurchaseAmount
              setErrMsg('');
              setReceive('');
              setRate('');
            }
          } else {
            if (data && data.maxSellAmount !== null && data.minSellAmount !== null) {
              valueSaveRef.current.max = data.maxSellAmount;
              valueSaveRef.current.min = data.minSellAmount;
              // setErrMsgCase();

              if (isValidValue({ amount, max: data.maxSellAmount, min: data.minSellAmount })) {
                await getQuoteAndSetData();
                setErrMsg('');
              } else {
                setErrMsgCase();
                setReceive('');
                setRate('');
              }
            } else {
              // not maxSellAmount and minSellAmount
              setErrMsg('');
              setReceive('');
              setRate('');
            }
          }
        } catch (error) {
          console.log('error', error);
          setErrMsg('');
          setReceive('');
          setRate('');
        } finally {
          setLoading(false);
        }
      }
    },
    [curFiat.currency, getQuoteAndSetData, isValidValue, setErrMsgCase, setLoading],
  );

  const {
    accountToken: { accountTokenList },
  } = useAssets();
  const currentChain = useCurrentChain('AELF');
  const currentNetwork = useCurrentNetworkInfo();
  const wallet = useCurrentWalletInfo();

  const handleNext = useCallback(async () => {
    if (valueSaveRef.current.side === PaymentTypeEnum.SELL) {
      if (!currentChain) return;
      // search balance from contract
      const result = await getBalance({
        rpcUrl: currentChain.endPoint,
        address: accountTokenList[0].tokenContractAddress || '',
        chainType: currentNetwork.walletType,
        paramsOption: {
          owner: wallet['AELF']?.caAddress || '',
          symbol: 'ELF',
        },
      });
      const balance = result.result.balance;

      if (
        ZERO.plus(divDecimals(balance, 8)).isLessThanOrEqualTo(ZERO.plus(DEFAULT_FEE).plus(valueSaveRef.current.amount))
      ) {
        return message.error('balance is not enough'); // TODO SELL
      }
    }

    const { amount, currency, country, crypto, network, side } = valueSaveRef.current;
    navigate('/buy/preview', {
      state: {
        crypto,
        network,
        fiat: currency,
        country,
        amount,
        side,
        tokenInfo: state ? state.tokenInfo : null,
      },
    });
  }, [accountTokenList, currentChain, currentNetwork.walletType, navigate, state, wallet]);

  const handleBack = useCallback(() => {
    if (state && state.tokenInfo) {
      navigate('/token-detail', {
        state: state.tokenInfo,
      });
    } else {
      navigate('/');
    }
  }, [navigate, state]);

  const renderRate = useMemo(
    () => (
      <div className="buy-rate flex-between-center">
        <div>{showRateText}</div>
        <div className="timer flex-center">
          <CustomSvg type="Timer" />
          <div className="timestamp">{rateUpdateTime}s</div>
        </div>
      </div>
    ),
    [rateUpdateTime, showRateText],
  );

  const mainContent = useMemo(
    () => (
      <div className={clsx(['buy-frame flex-column', isPrompt ? 'detail-page-prompt' : ''])}>
        <div className="buy-title">
          <BackHeader
            title={t('Buy')}
            leftCallBack={handleBack}
            rightElement={<CustomSvg type="Close2" onClick={handleBack} />}
          />
        </div>
        <div className="buy-content flex-column-center">
          <div className="buy-radio">
            <Radio.Group
              defaultValue={PaymentTypeEnum.BUY}
              buttonStyle="solid"
              value={page}
              onChange={handlePageChange}>
              <Radio.Button value={PaymentTypeEnum.BUY}>{t('Buy')}</Radio.Button>
              <Radio.Button value={PaymentTypeEnum.SELL}>{t('Sell')}</Radio.Button>
            </Radio.Group>
          </div>
          {page === PaymentTypeEnum.BUY && (
            <BuyFrom
              currencyVal={amount}
              handleCurrencyChange={handleInputChange}
              handleCurrencyKeyDown={handleKeyDown}
              handleCurrencySelect={(v) => handleSelect(v, DrawerType.currency)}
              curFiat={curFiat}
              tokenVal={receive}
              handleTokenChange={handleInputChange}
              handleTokenKeyDown={handleKeyDown}
              handleTokenSelect={(v) => handleSelect(v, DrawerType.token)}
              curToken={curToken}
              errMsg={errMsg}
            />
          )}
          {page === PaymentTypeEnum.SELL && (
            <SellFrom
              tokenVal={amount}
              handleTokenChange={handleInputChange}
              handleTokenKeyDown={handleKeyDown}
              handleTokenSelect={(v) => handleSelect(v, DrawerType.token)}
              curToken={curToken}
              currencyVal={receive}
              handleCurrencyChange={handleInputChange}
              handleCurrencyKeyDown={handleKeyDown}
              handleCurrencySelect={(v) => handleSelect(v, DrawerType.currency)}
              curFiat={curFiat}
              errMsg={errMsg}
            />
          )}
          {rate !== '' && renderRate}
        </div>
        <div className="buy-footer">
          <Button type="primary" htmlType="submit" disabled={disabled} onClick={handleNext}>
            {t('Next')}
          </Button>
        </div>
        {isPrompt ? <PromptEmptyElement /> : null}
      </div>
    ),
    [
      amount,
      curFiat,
      curToken,
      disabled,
      errMsg,
      handleBack,
      handleInputChange,
      handleNext,
      handlePageChange,
      handleSelect,
      isPrompt,
      page,
      rate,
      receive,
      renderRate,
      t,
    ],
  );

  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
