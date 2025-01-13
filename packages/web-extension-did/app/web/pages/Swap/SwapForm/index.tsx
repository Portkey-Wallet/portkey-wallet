import { useGetSwapRoutes } from '@portkey-wallet/hooks/hooks-ca/awaken/request';
import './index.less';
import { useDebounceCallback, useEffectOnce, useReturnLastCallback } from '@portkey-wallet/hooks';
import { useAwakenGasFee, useAwakenTokenList } from '@portkey-wallet/hooks/hooks-ca/awaken/state';
import { TCurrency } from '@portkey-wallet/types/types-ca/awaken';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCurrencyBalancesV2 } from 'hooks/awaken';
import { ZERO } from '@portkey-wallet/constants/misc';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import {
  SWAP_RECEIVE_RATE,
  SWAP_TIME_INTERVAL,
  SwapStatusCodeEnum,
} from '@portkey-wallet/constants/constants-ca/awaken/swap';
import BigNumber from 'bignumber.js';
import { formatNameWithNoUnderline, sleep } from '@portkey-wallet/utils';
import { formatPrice } from '@portkey-wallet/utils/format';
import AmountCardGroup from '../components/AmountCardGroup';
import { CommonPromptCard } from '@portkey/did-ui-react';
import { PromptCardType } from 'pages/Send';

import { Button } from 'antd';
import { CommonInfoRow } from 'pages/components/CommonInfoRow';
import { TSwapPreviewProps } from '../SwapPreivew';
import clsx from 'clsx';

export type TSwapInfo = {
  tokenIn?: TCurrency;
  tokenOut?: TCurrency;

  valueIn: string;
  valueOut: string;
  isFocusValueIn: boolean;
};

export type TSwapFormProps = {
  className?: string;
  onFinish?: (props: TSwapPreviewProps) => void;
};

export const SwapForm = ({ className, onFinish }: TSwapFormProps) => {
  const getSwapRoutesInstant = useGetSwapRoutes();
  const getSwapRoutes = useReturnLastCallback(getSwapRoutesInstant, [getSwapRoutesInstant]);
  const gasFee = useAwakenGasFee();
  const { list } = useAwakenTokenList();
  const [swapInfo, setSwapInfo] = useState<TSwapInfo>({
    valueIn: '',
    valueOut: '',
    isFocusValueIn: true,
  });

  const isInitRef = useRef(false);
  useEffect(() => {
    if (isInitRef.current) {
      return;
    }
    const defaultTokenIn = list.find((item) => item.symbol === 'ELF');
    const defaultTokenOut = list.find((item) => item.symbol === 'USDT');
    if (!defaultTokenIn || !defaultTokenOut) {
      return;
    }
    isInitRef.current = true;
    setSwapInfo((pre) => ({
      ...pre,
      tokenIn: defaultTokenIn,
      tokenOut: defaultTokenOut,
    }));
  }, [list]);

  const swapInfoRef = useRef(swapInfo);
  swapInfoRef.current = swapInfo;
  const symbols = useMemo(
    () => [swapInfo.tokenIn?.symbol || '', swapInfo.tokenOut?.symbol || ''],
    [swapInfo.tokenIn?.symbol, swapInfo.tokenOut?.symbol],
  );
  const currencyBalances = useCurrencyBalancesV2(symbols);

  const refreshTokenValueRef = useRef<typeof refreshTokenValue>();
  // const [swapRoute, setSwapRoute] = useState<TSwapRoute>();

  // const [isPriceReverse, setIsPriceReverse] = useState(true);
  // const resetIsPriceReverse = useCallback(() => {
  //   setIsPriceReverse(false);
  // }, []);

  const [isRouteEmpty, setIsRouteEmpty] = useState(false);
  const executeCb = useCallback(async () => {
    const { tokenIn, tokenOut } = swapInfoRef.current;
    if (!tokenIn || !tokenOut) {
      return;
    }

    try {
      refreshTokenValueRef.current?.();
    } catch (error) {
      console.log('executeCb error', error);
    }
    return undefined;
  }, []);
  const executeCbRef = useRef(executeCb);
  executeCbRef.current = executeCb;

  const [isInvalidParis, setIsInvalidParis] = useState(false);
  const refreshTokenValue = useCallback(
    async (isInstant = false) => {
      const { tokenIn, tokenOut, valueIn, valueOut, isFocusValueIn } = swapInfoRef.current;
      if ((isFocusValueIn && valueIn === '') || (!isFocusValueIn && valueOut === '')) {
        setSwapInfo((pre) => ({
          ...pre,
          valueIn: '',
          valueOut: '',
        }));
        // setSwapRoute(undefined);
        return;
      }

      if ((isFocusValueIn && ZERO.eq(valueIn)) || (!isFocusValueIn && ZERO.eq(valueOut))) {
        setIsInvalidParis(false);
        // setSwapRoute(undefined);
        return;
      }

      if (!tokenIn || !tokenOut) {
        console.log('refreshTokenValue error', tokenIn, tokenOut);
        return;
      }

      const _getSwapRoutes = isInstant ? getSwapRoutesInstant : getSwapRoutes;

      try {
        console.log('request _getSwapRoutes');
        const { routes, statusCode } = await _getSwapRoutes({
          symbolIn: tokenIn.symbol,
          symbolOut: tokenOut.symbol,
          isFocusValueIn,
          amountIn: isFocusValueIn ? timesDecimals(valueIn, tokenIn.decimals).toFixed() : undefined,
          amountOut: isFocusValueIn
            ? undefined
            : timesDecimals(valueOut, tokenOut.decimals).div(SWAP_RECEIVE_RATE).toFixed(0, BigNumber.ROUND_DOWN),
        });
        console.log('request _getSwapRoutes result:', routes);

        const _swapInfo = swapInfoRef.current;
        if (
          _swapInfo.tokenIn?.symbol !== tokenIn?.symbol ||
          _swapInfo.tokenOut?.symbol !== tokenOut?.symbol ||
          _swapInfo.isFocusValueIn !== isFocusValueIn ||
          (isFocusValueIn ? _swapInfo.valueIn !== valueIn : _swapInfo.valueOut !== valueOut)
        ) {
          console.log('calculateCb: to exceed the time limit');
          return;
        }

        setIsRouteEmpty(statusCode === SwapStatusCodeEnum.NoRouteFound);
        setIsInvalidParis(statusCode === SwapStatusCodeEnum.InsufficientLiquidity);
        const route = routes[0];

        const result = {
          valueIn: divDecimals(route.amountIn, tokenIn.decimals).toFixed(),
          valueOut: divDecimals(
            ZERO.plus(route.amountOut).times(SWAP_RECEIVE_RATE).dp(0, BigNumber.ROUND_CEIL),
            tokenOut.decimals,
          ).toFixed(),
          swapRoute: route,
        };

        setSwapInfo((pre) => ({
          ...pre,
          valueIn: result.valueIn,
          valueOut: result.valueOut,
        }));
        // setSwapRoute(route);

        console.log('refreshTokenValue routes', route);

        return result;
      } catch (error) {
        console.log('refreshTokenValue error', error);
        return;
      }
    },
    [getSwapRoutes, getSwapRoutesInstant],
  );

  refreshTokenValueRef.current = refreshTokenValue;
  const refreshTokenValueDebounce = useDebounceCallback(refreshTokenValue, [refreshTokenValue]);

  const timerRef = useRef<NodeJS.Timeout>();

  const clearTimer = useCallback(() => {
    if (!timerRef.current) {
      return;
    }
    clearInterval(timerRef.current);
    timerRef.current = undefined;
    console.log('clearTimer');
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const registerTimer = useCallback(() => {
    clearTimer();
    const { tokenIn, tokenOut } = swapInfoRef.current;
    if (!tokenIn || !tokenOut) {
      return;
    }

    executeCbRef.current();

    timerRef.current = setInterval(() => {
      executeCbRef.current();
    }, SWAP_TIME_INTERVAL);
  }, [clearTimer]);

  useEffectOnce(() => {
    const { tokenIn, tokenOut } = swapInfo;
    if (!tokenIn || !tokenOut) {
      return;
    }
    registerTimer();
  });

  const setValueIn = useCallback(
    async (value: string) => {
      setSwapInfo((pre) => ({
        ...pre,
        valueIn: value,
        valueOut: '',
        isFocusValueIn: true,
      }));
      refreshTokenValueDebounce();
    },
    [refreshTokenValueDebounce],
  );
  const setValueOut = useCallback(
    async (value: string) => {
      setSwapInfo((pre) => ({ ...pre, valueOut: value, valueIn: '', isFocusValueIn: false }));
      refreshTokenValueDebounce();
    },
    [refreshTokenValueDebounce],
  );

  const onTokenChange = useCallback(async () => {
    // resetIsPriceReverse();
    // setSwapRoute(undefined);
    setIsRouteEmpty(false);
    setIsInvalidParis(false);
    await sleep(100);
    registerTimer();
  }, [registerTimer]);

  const setTokenIn = useCallback(
    async (tokenIn?: TCurrency) => {
      if (!tokenIn) {
        return;
      }
      setSwapInfo((pre) => {
        const isSwitch = pre.tokenOut?.symbol === tokenIn.symbol;
        if (!isSwitch) {
          return {
            ...pre,
            tokenIn,
            isFocusValueIn: true,
            valueIn: '',
            valueOut: '',
          };
        }
        return {
          ...pre,
          tokenIn,
          tokenOut: pre.tokenIn,
          isFocusValueIn: !pre.isFocusValueIn,
          valueOut: pre.isFocusValueIn ? pre.valueIn : '',
          valueIn: pre.isFocusValueIn ? '' : pre.valueOut,
        };
      });
      onTokenChange();
    },
    [onTokenChange],
  );

  const setTokenOut = useCallback(
    async (tokenOut?: TCurrency) => {
      if (!tokenOut) {
        return;
      }
      setSwapInfo((pre) => {
        const isSwitch = pre.tokenIn?.symbol === tokenOut.symbol;
        if (!isSwitch) {
          return {
            ...pre,
            tokenOut,
            isFocusValueIn: true,
            valueOut: '',
          };
        }

        return {
          ...pre,
          tokenOut,
          tokenIn: pre.tokenOut,
          isFocusValueIn: !pre.isFocusValueIn,
          valueOut: pre.isFocusValueIn ? pre.valueIn : '',
          valueIn: pre.isFocusValueIn ? '' : pre.valueOut,
        };
      });
      onTokenChange();
    },
    [onTokenChange],
  );

  const switchToken = useCallback(async () => {
    setSwapInfo((pre) => ({
      ...pre,
      tokenIn: pre.tokenOut,
      tokenOut: pre.tokenIn,
      isFocusValueIn: !pre.isFocusValueIn,
      valueOut: pre.isFocusValueIn ? pre.valueIn : '',
      valueIn: pre.isFocusValueIn ? '' : pre.valueOut,
    }));
    onTokenChange();
  }, [onTokenChange]);

  const priceLabel = useMemo(() => {
    const { tokenIn, tokenOut, valueIn, valueOut } = swapInfo;
    if (!tokenIn || !tokenOut) {
      return '-';
    }
    // if (!valueIn && !valueOut) return '-';
    const symbolIn = formatNameWithNoUnderline(tokenIn.symbol);
    const symbolOut = formatNameWithNoUnderline(tokenOut.symbol);

    // if (!isPriceReverse) {
    //   if (!valueIn || !valueOut) return `1 ${symbolOut} = - ${symbolIn}`;

    //   const _price = formatPrice(ZERO.plus(valueIn).div(ZERO.plus(valueOut)));
    //   return `1 ${symbolOut} = ${_price} ${symbolIn}`;
    // } else {
    if (!valueIn || !valueOut) {
      return `1 ${symbolIn} = - ${symbolOut}`;
    }

    const _price = formatPrice(ZERO.plus(valueOut).div(ZERO.plus(valueIn)));
    return `1 ${symbolIn} = ${_price} ${symbolOut}`;
    // }
  }, [swapInfo]);

  const isExceedBalance = useMemo(() => {
    const { tokenIn, valueIn } = swapInfo;
    if (!tokenIn) {
      return false;
    }
    const tokenInBalance = currencyBalances?.[swapInfo.tokenIn?.symbol || ''];
    if (tokenInBalance === undefined) {
      return true;
    }
    const validBalance = tokenIn.symbol === 'ELF' ? ZERO.plus(tokenInBalance).minus(gasFee) : tokenInBalance;
    if (ZERO.plus(valueIn).gt(divDecimals(validBalance, tokenIn.decimals))) {
      return true;
    }
    return false;
  }, [currencyBalances, gasFee, swapInfo]);
  const isInputError = useMemo(() => {
    if (!currencyBalances) {
      return false;
    }
    const tokenInBalance = currencyBalances[swapInfo.tokenIn?.symbol || ''];
    if (!tokenInBalance || tokenInBalance.isNaN()) {
      return false;
    }
    return isExceedBalance;
  }, [currencyBalances, isExceedBalance, swapInfo.tokenIn?.symbol]);

  const isBtnDisable = useMemo(() => {
    const { tokenIn, tokenOut, valueIn, valueOut } = swapInfo;
    if (!tokenIn || !tokenOut) {
      return true;
    }
    if (isRouteEmpty) {
      return true;
    }
    if (!valueIn || ZERO.eq(valueIn)) {
      return true;
    }
    if (!valueOut || ZERO.eq(valueOut)) {
      return true;
    }
    if (isInvalidParis) {
      return true;
    }
    if (isExceedBalance) {
      return true;
    }
    return false;
  }, [isExceedBalance, isInvalidParis, isRouteEmpty, swapInfo]);

  const bottomButtonTitle = useMemo(() => {
    if (isInvalidParis || isRouteEmpty) {
      return 'Swap not available';
    } else if (isExceedBalance) {
      return `Insufficient ${formatNameWithNoUnderline(swapInfo.tokenIn?.label || swapInfo.tokenIn?.symbol)} balance`;
    } else {
      return 'Preview';
    }
  }, [isExceedBalance, isInvalidParis, isRouteEmpty, swapInfo.tokenIn?.label, swapInfo.tokenIn?.symbol]);

  const [isSwapping, setIsSwapping] = useState(false);
  const onPreviewClick = useCallback(async () => {
    const { tokenIn, tokenOut, valueIn, valueOut } = swapInfo;
    if (!tokenIn || !tokenOut) {
      return;
    }
    if (!valueIn || !valueOut) {
      return;
    }

    const _refreshTokenValue = refreshTokenValueRef.current;
    if (!_refreshTokenValue) {
      return;
    }
    setIsSwapping(true);
    try {
      const result = await _refreshTokenValue(true);
      // can not get routeInfo
      if (!result || !result.swapRoute) {
        return;
      }

      const route = result.swapRoute;
      const _tokens = route.distributions[0]?.tokens;
      const routeSymbolIn = _tokens[0].symbol;
      const routeSymbolOut = _tokens[_tokens.length - 1]?.symbol;
      // swapInfo do not match routeInfo
      if (tokenIn.symbol !== routeSymbolIn || tokenOut.symbol !== routeSymbolOut) {
        return;
      }

      onFinish?.({
        swapInfo: {
          ...swapInfo,
          valueIn: result.valueIn,
          valueOut: result.valueOut,
        },
        swapRoute: route,
        priceLabel,
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      console.log('onSwap finally');
      setIsSwapping(false);
    }
  }, [onFinish, priceLabel, swapInfo]);

  const isPreviewShow = useMemo(() => {
    if (swapInfo.isFocusValueIn && (!swapInfo.valueIn || ZERO.gte(swapInfo.valueIn))) {
      return false;
    }
    if (!swapInfo.isFocusValueIn && (!swapInfo.valueOut || ZERO.gte(swapInfo.valueOut))) {
      return false;
    }
    return true;
  }, [swapInfo.isFocusValueIn, swapInfo.valueIn, swapInfo.valueOut]);

  return (
    <div className={clsx('swap-form', className)}>
      <div className="swap-form-body swap-common-padding">
        <AmountCardGroup
          swapInfo={swapInfo}
          setValueIn={setValueIn}
          setValueOut={setValueOut}
          isErrorIn={isInputError}
          balances={currencyBalances}
          setTokenIn={setTokenIn}
          setTokenOut={setTokenOut}
          switchToken={switchToken}
        />

        {isInvalidParis || isRouteEmpty ? (
          <CommonPromptCard
            className="swap-form-error"
            type={PromptCardType.ERROR}
            description="There is currently no available liquidity pool for the selected token pair. Select different tokens to continue."
          />
        ) : (
          isPreviewShow && (
            <div className="swap-form-info-wrap">
              <CommonInfoRow
                label={{
                  text: 'Provider',
                  tooltipProps: {
                    title: 'Provider',
                    content: 'The decentralised exchange where your trade will be executed.',
                  },
                }}
                value={{ text: 'AwakenSwap' }}
              />
              <CommonInfoRow label={{ text: 'Price' }} value={{ text: priceLabel }} />
            </div>
          )
        )}
      </div>

      {isPreviewShow && (
        <div className="swap-form-footer swap-common-padding">
          <Button loading={isSwapping} type="primary" disabled={isBtnDisable} onClick={onPreviewClick}>
            {bottomButtonTitle}
          </Button>
        </div>
      )}
    </div>
  );
};
