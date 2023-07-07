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
import BuyForm from './components/BuyForm';
import SellForm from './components/SellForm';
import { useEffectOnce } from 'react-use';
import { PaymentTypeEnum } from '@portkey-wallet/types/types-ca/payment';
import BigNumber from 'bignumber.js';
import CustomTipModal from 'pages/components/CustomModal';
import { useBuyButtonShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCheckManagerSyncState } from 'hooks/wallet';
import {
  buySoonText,
  InsufficientFundsText,
  sellSoonText,
  serviceUnavailableText,
  SynchronizingChainText,
} from '@portkey-wallet/constants/constants-ca/payment';

export default function Buy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isPrompt } = useCommonState();
  const updateTimeRef = useRef(MAX_UPDATE_TIME);
  const updateTimerRef = useRef<NodeJS.Timer | number>();
  const valueSaveRef = useRef({ ...initValueSave });
  const [errMsg, setErrMsg] = useState<string>('');
  const [warningMsg, setWarningMsg] = useState<string>('');
  const [page, setPage] = useState<PaymentTypeEnum>(PaymentTypeEnum.BUY);
  const [rate, setRate] = useState('');
  const [amount, setAmount] = useState(initCurrency);
  const [receive, setReceive] = useState('');
  const [curToken, setCurToken] = useState(initToken);
  const { setLoading } = useLoading();
  const [curFiat, setCurFiat] = useState<PartialFiatType>(initFiat);
  const [rateUpdateTime, setRateUpdateTime] = useState(MAX_UPDATE_TIME);
  const { isBuySectionShow, isSellSectionShow, refreshBuyButton } = useBuyButtonShow();
  const checkManagerSyncState = useCheckManagerSyncState();

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
        receive: '',
        isShowErrMsg: false,
      };
      updateCrypto();
    } else {
      if (!isBuySectionShow && isSellSectionShow) {
        const side = PaymentTypeEnum.SELL;
        setPage(side);
        valueSaveRef.current.side = side;
        setAmount(initCrypto);
        valueSaveRef.current.amount = initCrypto;
      }
      updateCrypto();
    }
    return () => {
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = undefined;
    };
  });

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
        const receive = formatAmountShow(Number(fiatQuantity) - Number(rampFee), 4);
        setReceive(receive);
        valueSaveRef.current.receive = receive;
      }
      if (valueSaveRef.current.side === PaymentTypeEnum.BUY) {
        const receive = formatAmountShow(cryptoQuantity || '', 4);
        setReceive(receive);
        valueSaveRef.current.receive = receive;
      }
    },
    [],
  );

  const setErrMsgCase = useCallback(() => {
    const { min, max, currency, crypto, side } = valueSaveRef.current;
    if (min !== null && max !== null) {
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = undefined;
      if (side === PaymentTypeEnum.SELL) {
        setErrMsg(showLimitText(min, max, crypto));
      }
      if (side === PaymentTypeEnum.BUY) {
        setErrMsg(showLimitText(min, max, currency));
      }
      valueSaveRef.current.isShowErrMsg = true;
      setReceive('');
      valueSaveRef.current.receive = '';
    }
  }, [showLimitText]);
  const { updateReceive, stopInterval } = useMemo(() => {
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
      try {
        const rst = await getOrderQuote(params);
        if (params.amount !== valueSaveRef.current.amount) return;

        const { cryptoPrice, cryptoQuantity, fiatQuantity, rampFee } = rst;
        setReceiveCase({ fiatQuantity, rampFee, cryptoQuantity });
        setRate(cryptoPrice);
        setErrMsg('');
        setWarningMsg('');
        valueSaveRef.current.isShowErrMsg = false;
        if (!updateTimerRef.current) {
          resetTimer();
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    const handleSetTimer = () => {
      updateTimerRef.current = setInterval(() => {
        --updateTimeRef.current;

        if (updateTimeRef.current === 0) {
          updateReceive();
          updateTimeRef.current = MAX_UPDATE_TIME;
        }

        setRateUpdateTime(updateTimeRef.current);
      }, 1000);
    };
    const stopInterval = () => {
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = undefined;
      setRate('');
    };

    const resetTimer = () => {
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = undefined;
      updateTimeRef.current = MAX_UPDATE_TIME;
      setRateUpdateTime(MAX_UPDATE_TIME);
      handleSetTimer();
    };

    return { updateReceive, handleSetTimer, stopInterval, resetTimer };
  }, [setReceiveCase]);

  const updateCrypto = useCallback(async () => {
    const { currency, crypto, network, side } = valueSaveRef.current;
    const data = await getCryptoInfo({ fiat: currency }, crypto, network, side);
    if (side === PaymentTypeEnum.BUY) {
      if (data && data.maxPurchaseAmount !== null && data.minPurchaseAmount !== null) {
        valueSaveRef.current.max = Number(
          ZERO.plus(data.maxPurchaseAmount).decimalPlaces(4, BigNumber.ROUND_DOWN).valueOf(),
        );
        valueSaveRef.current.min = Number(
          ZERO.plus(data.minPurchaseAmount).decimalPlaces(4, BigNumber.ROUND_UP).valueOf(),
        );
      }
    } else {
      if (data && data.maxSellAmount !== null && data.minSellAmount !== null) {
        valueSaveRef.current.max = Number(
          ZERO.plus(data.maxSellAmount).decimalPlaces(4, BigNumber.ROUND_DOWN).valueOf(),
        );
        valueSaveRef.current.min = Number(ZERO.plus(data.minSellAmount).decimalPlaces(4, BigNumber.ROUND_UP).valueOf());
      }
    }
    const { amount, min, max } = valueSaveRef.current;
    if (min && max) {
      if (!isValidValue({ amount, min, max })) {
        setErrMsgCase();
        setWarningMsg('');
        stopInterval();
      } else {
        await updateReceive();
      }
    }
  }, [isValidValue, setErrMsgCase, stopInterval, updateReceive]);

  const handleInputChange = useCallback(
    async (v: string) => {
      setAmount(v);
      valueSaveRef.current.amount = v;
      const { min, max } = valueSaveRef.current;
      if (max && min && !isValidValue({ amount: v, min, max })) {
        setErrMsgCase();
        setWarningMsg('');
        stopInterval();
        return;
      }
      const { crypto, network, country, currency, side } = valueSaveRef.current;
      await updateReceive({
        crypto,
        network,
        fiat: currency,
        country,
        amount: v,
        side,
      });
    },
    [isValidValue, setErrMsgCase, stopInterval, updateReceive],
  );

  const handlePageChange = useCallback(
    async (e: RadioChangeEvent) => {
      refreshBuyButton(); // fetch on\off ramp is display

      const side = e.target.value;
      // Compatible with the situation where the function is turned off when the user is on the page.
      if (side === PaymentTypeEnum.BUY && !isBuySectionShow) {
        CustomTipModal({
          content: t(buySoonText),
        });
        return;
      }
      if (side === PaymentTypeEnum.SELL && !isSellSectionShow) {
        CustomTipModal({
          content: t(sellSoonText),
        });
        return;
      }

      stopInterval();
      setPage(side);
      // BUY
      valueSaveRef.current = { ...initValueSave };
      valueSaveRef.current.side = side;
      setAmount(initCurrency);
      // SELL
      if (side === PaymentTypeEnum.SELL) {
        setAmount(initCrypto);
        valueSaveRef.current.amount = initCrypto;
      }

      setCurFiat(initFiat);
      setWarningMsg('');
      setErrMsg('');
      valueSaveRef.current.isShowErrMsg = false;
      setReceive('');
      valueSaveRef.current.receive = '';
      setRate('');
      try {
        setLoading(true);
        await updateCrypto();
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    },
    [isBuySectionShow, isSellSectionShow, refreshBuyButton, setLoading, stopInterval, t, updateCrypto],
  );

  const handleSelect = useCallback(
    async (v: PartialFiatType, drawerType: DrawerType) => {
      if (drawerType === DrawerType.token) {
        // only elf for now
      } else {
        if (v.currency && v.country) {
          setCurFiat(v);
          valueSaveRef.current.currency = v.currency;
          valueSaveRef.current.country = v.country;
        } else {
          return;
        }

        try {
          setLoading(true);
          await updateCrypto();
        } catch (error) {
          console.log('error', error);
        } finally {
          setLoading(false);
        }
      }
    },
    [setLoading, updateCrypto],
  );

  const {
    accountToken: { accountTokenList },
  } = useAssets();
  const currentChain = useCurrentChain('AELF');
  const currentNetwork = useCurrentNetworkInfo();
  const wallet = useCurrentWalletInfo();

  const setInsufficientFundsMsg = useCallback(() => {
    stopInterval();

    setErrMsg(InsufficientFundsText);
    valueSaveRef.current.isShowErrMsg = true;

    setReceive('');
    valueSaveRef.current.receive = '';
  }, [stopInterval]);

  const handleNext = useCallback(async () => {
    const { side } = valueSaveRef.current;
    setLoading(true);
    const result = await refreshBuyButton();
    const isBuySectionShow = result.isBuySectionShow;
    const isSellSectionShow = result.isSellSectionShow;
    // Compatible with the situation where the function is turned off when the user is on the page.
    if ((side === PaymentTypeEnum.BUY && !isBuySectionShow) || (side === PaymentTypeEnum.SELL && !isSellSectionShow)) {
      setLoading(false);
      message.error(serviceUnavailableText);
      return navigate('/');
    }

    if (side === PaymentTypeEnum.SELL) {
      if (!currentChain) return setLoading(false);

      const _isManagerSynced = await checkManagerSyncState('AELF');

      if (!_isManagerSynced) {
        setLoading(false);
        setWarningMsg(SynchronizingChainText);
        return;
      } else {
        setWarningMsg('');
      }

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
      setLoading(false);
      const balance = result.result.balance;

      if (
        ZERO.plus(divDecimals(balance, 8)).isLessThanOrEqualTo(ZERO.plus(DEFAULT_FEE).plus(valueSaveRef.current.amount))
      ) {
        setInsufficientFundsMsg();
        return;
      }
    }
    setLoading(false);

    const { amount, currency, country, crypto, network } = valueSaveRef.current;
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
  }, [
    accountTokenList,
    checkManagerSyncState,
    currentChain,
    currentNetwork.walletType,
    navigate,
    refreshBuyButton,
    setInsufficientFundsMsg,
    setLoading,
    state,
    wallet,
  ]);

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
            <BuyForm
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
              side={PaymentTypeEnum.BUY}
            />
          )}
          {page === PaymentTypeEnum.SELL && (
            <SellForm
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
              warningMsg={warningMsg}
              side={PaymentTypeEnum.SELL}
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
      warningMsg,
    ],
  );

  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
