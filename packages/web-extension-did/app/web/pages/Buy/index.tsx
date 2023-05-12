import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Radio, RadioChangeEvent } from 'antd';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useLocation, useNavigate } from 'react-router';
import CustomDrawer from './components/CustomDrawer';
import { handleKeyDown } from 'utils/keyDown';
import { getOrderQuote, getCryptoInfo } from '@portkey-wallet/api/api-did/payment/util';
import { ZERO } from '@portkey-wallet/constants/misc';
import { countryCodeMap } from '@portkey-wallet/constants/constants-ca/payment';
import {
  DrawerType,
  initCrypto,
  initCurrency,
  initFiat,
  initLimit,
  initToken,
  initValueSave,
  Limit,
  MAX_UPDATE_TIME,
  PageType,
  PartialFiatType,
  sellSoonText,
} from './const';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import CustomModal from './components/CustomModal';
import CustomTipModal from 'pages/components/CustomModal';
import './index.less';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';

export default function Buy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isPrompt } = useCommonState();
  const updateTimeRef = useRef(MAX_UPDATE_TIME);
  const updateTimerRef = useRef<NodeJS.Timer | number>();
  const valueSaveRef = useRef({ ...initValueSave });
  const [errMsg, setErrMsg] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<PageType>(PageType.buy);
  const [rate, setRate] = useState('');
  const [amount, setAmount] = useState(initCurrency);
  const [receive, setReceive] = useState('');
  const [curToken, setCurToken] = useState(initToken);
  const [limit, setLimit] = useState<Limit>(initLimit);
  const { setLoading } = useLoading();
  const [curFiat, setCurFiat] = useState<PartialFiatType>(initFiat);
  const [drawerType, setDrawerType] = useState<DrawerType>(DrawerType.currency);
  const [rateUpdateTime, setRateUpdateTime] = useState(MAX_UPDATE_TIME);

  const disabled = useMemo(() => !!errMsg || !amount, [errMsg, amount]);
  const showRateText = useMemo(
    () => `1 ${curToken.crypto} ≈ ${formatAmountShow(rate, 2)} ${curFiat.currency}`,
    [curFiat, curToken, rate],
  );

  useEffect(() => {
    if (state && state.amount !== undefined) {
      const { amount, country, fiat, crypto, network, side } = state;
      setAmount(amount);
      setCurFiat({ country, currency: fiat });
      setCurToken({ crypto, network });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showLimitText = useCallback(
    (min: string | number, max: string | number, fiat = 'USD') =>
      `Limit Amount ${formatAmountShow(min)}-${formatAmountShow(max)} ${fiat} `,
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
        const { cryptoPrice, cryptoQuantity } = rst;
        setReceive(formatAmountShow(cryptoQuantity || '', 4));
        setRate(cryptoPrice);
        setErrMsg('');
        handleSetTimer();
      } catch (error) {
        setReceive('');
        setRate('');
        const { min, max, currency } = valueSaveRef.current;
        if (min !== null && max !== null) {
          setErrMsg(showLimitText(min, max, currency));
        }
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
  }, [showLimitText]);

  const updateCrypto = useCallback(
    async (fiat = curFiat.currency || 'USD') => {
      const { crypto, network } = valueSaveRef.current;
      const data = await getCryptoInfo({ fiat }, crypto, network);
      if (page === PageType.buy) {
        if (data && data.maxPurchaseAmount !== null && data.minPurchaseAmount !== null) {
          setLimit({ max: data.maxPurchaseAmount, min: data.minPurchaseAmount });
          valueSaveRef.current.max = data.maxPurchaseAmount;
          valueSaveRef.current.min = data.minPurchaseAmount;
        }
      } else {
        if (data && data.maxSellAmount !== null && data.minSellAmount !== null) {
          setLimit({ max: data.maxSellAmount, min: data.minSellAmount });
          valueSaveRef.current.max = data.maxSellAmount;
          valueSaveRef.current.min = data.minSellAmount;
        }
      }
    },
    [curFiat.currency, page],
  );

  const handleInputChange = useCallback(
    (v: string) => {
      setAmount(v);
      valueSaveRef.current.amount = v;
      const { min, max } = limit;
      if (max !== null && min !== null) {
        if (!isValidValue({ amount: v, min, max })) {
          setErrMsg(showLimitText(min, max, curFiat.currency));
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
    [curFiat, isValidValue, limit, showLimitText, updateReceive],
  );

  const handlePageChange = useCallback(
    async (e: RadioChangeEvent) => {
      if (e.target.value === PageType.sell) {
        CustomTipModal({
          content: sellSoonText,
        });
        return;
      }
      clearInterval(updateTimerRef.current);
      valueSaveRef.current = initValueSave;
      setPage(e.target.value);
      setCurFiat(initFiat);
      setAmount(initCurrency);
      setErrMsg('');
      if (e.target.value === PageType.sell) {
        setAmount(initCrypto);
        valueSaveRef.current.amount = initCrypto;
        valueSaveRef.current.side = 'SELL';
      }
      try {
        setLoading(true);
        console.log('valueSaveRef', valueSaveRef.current);
        const { country, crypto, currency, network, amount, side } = valueSaveRef.current;
        const rst = await getOrderQuote({
          crypto,
          network,
          fiat: currency,
          country,
          amount,
          side,
        });
        const { cryptoPrice, cryptoQuantity } = rst;
        setReceive(formatAmountShow(cryptoQuantity || '', 4));
        setRate(cryptoPrice);
        setRateUpdateTime(MAX_UPDATE_TIME);
        updateTimeRef.current = MAX_UPDATE_TIME;
        handleSetTimer();
        await updateCrypto();
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    },
    [handleSetTimer, setLoading, updateCrypto],
  );

  const handleSelect = useCallback(
    async (v: PartialFiatType) => {
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
          setLoading(true);
          const { crypto, currency, country, network, amount, side } = valueSaveRef.current;
          const data = await getCryptoInfo({ fiat: v.currency }, crypto, network);
          if (data && data.maxPurchaseAmount !== null && data.minPurchaseAmount !== null) {
            setLimit({ max: data.maxPurchaseAmount, min: data.minPurchaseAmount });
            if (isValidValue({ amount, min: data.minPurchaseAmount, max: data.maxPurchaseAmount })) {
              const rst = await getOrderQuote({
                crypto,
                network,
                fiat: currency,
                country,
                amount,
                side,
              });
              const { cryptoPrice, cryptoQuantity } = rst;
              setReceive(formatAmountShow(cryptoQuantity || '', 4));
              setRate(cryptoPrice);
              setRateUpdateTime(MAX_UPDATE_TIME);
              updateTimeRef.current = MAX_UPDATE_TIME;
              handleSetTimer();
              setErrMsg('');
            } else {
              setErrMsg(showLimitText(data.minPurchaseAmount, data.maxPurchaseAmount, v.currency));
              setReceive('');
              setRate('');
            }
          }
        } catch (error) {
          console.log('error', error);
        } finally {
          setLoading(false);
        }
      }
    },
    [curFiat, drawerType, handleSetTimer, isValidValue, setLoading, showLimitText],
  );

  const renderSelectELe = useMemo(() => {
    const title = drawerType === DrawerType.token ? 'Select Crypto' : 'Select Currency';
    const searchPlaceHolder = drawerType === DrawerType.token ? 'Search crypto' : 'Search currency';
    return isPrompt ? (
      <CustomModal
        open={open}
        drawerType={drawerType}
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        onClose={() => setOpen(false)}
        onChange={handleSelect}
      />
    ) : (
      <CustomDrawer
        open={open}
        drawerType={drawerType}
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        height="528"
        maskClosable={true}
        placement="bottom"
        onClose={() => setOpen(false)}
        onChange={handleSelect}
      />
    );
  }, [drawerType, handleSelect, isPrompt, open]);

  const renderTokenInput = useMemo(() => {
    return (
      <Input
        value={page === PageType.buy ? receive : amount}
        readOnly
        suffix={
          <div
            className="flex-center"
            onClick={() => {
              setDrawerType(DrawerType.token);
              setOpen(true);
            }}>
            <CustomSvg type="elf-icon" />
            <div className="currency">{curToken.crypto}</div>
            <CustomSvg type="Down" />
          </div>
        }
      />
    );
  }, [amount, curToken.crypto, page, receive]);

  const renderCurrencyInput = useMemo(() => {
    return (
      <Input
        value={page === PageType.buy ? amount : receive}
        autoComplete="off"
        onChange={(e) => handleInputChange(e.target.value)}
        readOnly={page === PageType.sell}
        onKeyDown={handleKeyDown}
        suffix={
          <div
            className="flex-center"
            onClick={() => {
              setDrawerType(DrawerType.currency);
              setOpen(true);
            }}>
            <div className="img">
              <img src={countryCodeMap[curFiat.country || '']?.icon} alt="" />
            </div>
            <div className="currency">{curFiat.currency}</div>
            <CustomSvg type="Down" />
          </div>
        }
      />
    );
  }, [page, amount, receive, curFiat.country, curFiat.currency, handleInputChange]);

  const handleNext = useCallback(() => {
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
  }, [navigate, state]);

  const handleBack = useCallback(() => {
    if (state && state.tokenInfo) {
      navigate('/token-detail', {
        state: state.tokenInfo,
      });
    } else {
      navigate('/');
    }
  }, [navigate, state]);

  const renderBuyForm = useMemo(() => {
    return (
      <>
        <div className="buy-input">
          <div className="label">I want to pay</div>
          {renderCurrencyInput}
          {!!errMsg && <div className="error-text">{errMsg}</div>}
        </div>
        <div className="buy-input">
          <div className="label">I will receive≈</div>
          {renderTokenInput}
        </div>
      </>
    );
  }, [errMsg, renderCurrencyInput, renderTokenInput]);

  const renderSellForm = useMemo(() => {
    return (
      <>
        <div className="buy-input">
          <div className="label">I want to sell</div>
          {renderTokenInput}
          {!!errMsg && <div className="error-text">{errMsg}</div>}
        </div>
        <div className="buy-input">
          <div className="label">I will receive≈</div>
          {renderCurrencyInput}
        </div>
      </>
    );
  }, [errMsg, renderCurrencyInput, renderTokenInput]);

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
            <Radio.Group defaultValue={PageType.buy} buttonStyle="solid" value={page} onChange={handlePageChange}>
              <Radio.Button value={PageType.buy}>{t('Buy')}</Radio.Button>
              <Radio.Button value={PageType.sell}>{t('Sell')}</Radio.Button>
            </Radio.Group>
          </div>
          {page === PageType.buy && renderBuyForm}
          {page === PageType.sell && renderSellForm}
          {rate !== '' && renderRate}
        </div>
        <div className="buy-footer">
          <Button type="primary" htmlType="submit" disabled={disabled} onClick={handleNext}>
            {t('Next')}
          </Button>
        </div>
        {renderSelectELe}
        {isPrompt ? <PromptEmptyElement /> : null}
      </div>
    ),
    [
      disabled,
      handleBack,
      handleNext,
      handlePageChange,
      isPrompt,
      page,
      rate,
      renderBuyForm,
      renderRate,
      renderSelectELe,
      renderSellForm,
      t,
    ],
  );

  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
