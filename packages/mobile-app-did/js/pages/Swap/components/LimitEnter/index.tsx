import React, { useMemo, memo, useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from 'i18n/hooks';
import { View } from 'react-native';
import AmountCardGroup from '../AmountCardGroup';
import { CommonPromptCard, PromptCardType } from 'components/CommonPromptCard';
import CommonButton from 'components/CommonButton';
import ExpiresSelect from '../ExpiresSelect';
import RateCard, { ILimitRateCard } from '../RateCard';
import CommonInfoRow from 'components/CommonInfoRow';
import { getStyles } from './style';
import { TCurrency } from '@portkey-wallet/types/types-ca/awaken';
import { useAwakenGasFee, useAwakenTokenList } from '@portkey-wallet/hooks/hooks-ca/awaken/state';
import { useCurrencyBalancesV2 } from 'hooks/awaken';
import { usePairMaxReserve } from '@portkey-wallet/hooks/hooks-ca/awaken/limit';
import { LIMIT_RECEIVE_RATE, LimitExpiryEnum } from '@portkey-wallet/constants/constants-ca/awaken/limit';
import { ZERO } from '@portkey-wallet/constants/misc';
import BigNumber from 'bignumber.js';
import { divDecimals } from '@portkey-wallet/utils/converter';
import { TLimitPairPriceError } from '@portkey-wallet/types/types-ca/awaken/limit';
import { useGetLimitOrderRemainingUnfilled } from '@portkey-wallet/graphql/awaken/hooks';
import { useDAppChainId } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useKeyboardSafeArea } from 'components/KeyboardSafeArea';
import { pTd } from 'utils/unit';

export type TLimitInfo = {
  tokenIn?: TCurrency;
  tokenOut?: TCurrency;

  valueIn: string;
  valueOut: string;
  isFocusValueIn: boolean;
};

type TPriceInfo = {
  price: string;
  isReverse: boolean;
};

const LimitEnter = () => {
  const { t } = useLanguage();
  const styles = getStyles();

  const gasFee = useAwakenGasFee();
  const limitPairPriceRef = useRef<ILimitRateCard>();

  const [limitInfo, setLimitInfo] = useState<TLimitInfo>({
    valueIn: '',
    valueOut: '',
    isFocusValueIn: true,
  });

  const { list } = useAwakenTokenList();
  const isInitRef = useRef(false);
  useEffect(() => {
    if (isInitRef.current) return;
    const defaultTokenIn = list.find(item => item.symbol === 'ELF');
    const defaultTokenOut = list.find(item => item.symbol === 'USDT');
    if (!defaultTokenIn || !defaultTokenOut) return;
    isInitRef.current = true;
    setLimitInfo(pre => ({
      ...pre,
      tokenIn: defaultTokenIn,
      tokenOut: defaultTokenOut,
    }));
  }, [list]);

  const [tokenPriceInfo, setTokenPriceInfo] = useState<TPriceInfo>({
    price: '0',
    isReverse: false,
  });

  const symbols = useMemo(
    () => [limitInfo.tokenIn?.symbol || '', limitInfo.tokenOut?.symbol || ''],
    [limitInfo.tokenIn?.symbol, limitInfo.tokenOut?.symbol],
  );
  const currencyBalances = useCurrencyBalancesV2(symbols);
  const {
    maxReserve,
    isError: isReserveError,
    refresh: refreshReserve,
  } = usePairMaxReserve(limitInfo.tokenIn?.symbol, limitInfo.tokenOut?.symbol);
  const [expiryValue, setExpiryValue] = useState(LimitExpiryEnum.day);

  const setValueIn = useCallback(
    async (value: string, _tokenOutPrice?: TPriceInfo) => {
      const { price, isReverse } = _tokenOutPrice ?? tokenPriceInfo;
      if (ZERO.gte(price) || !price) {
        setLimitInfo(pre => ({
          ...pre,
          valueOut: '',
        }));
        return;
      }

      setLimitInfo(pre => {
        let _valueOut = '';
        if (value) {
          let valueOutBN = ZERO;
          if (!isReverse) {
            valueOutBN = ZERO.plus(value).div(price);
          } else {
            valueOutBN = ZERO.plus(value).times(price);
          }
          _valueOut = valueOutBN
            .times(LIMIT_RECEIVE_RATE)
            .dp(pre.tokenOut?.decimals || 0, BigNumber.ROUND_FLOOR)
            .toFixed();
        }

        return {
          ...pre,
          valueIn: value,
          isFocusValueIn: true,
          valueOut: _valueOut,
        };
      });
    },
    [tokenPriceInfo],
  );

  const setValueOut = useCallback(
    async (value: string, _tokenOutPrice?: TPriceInfo) => {
      const { price, isReverse } = _tokenOutPrice ?? tokenPriceInfo;
      if (ZERO.gte(price) || !price) {
        setLimitInfo(pre => ({
          ...pre,
          valueIn: '',
        }));
        return;
      }

      setLimitInfo(pre => {
        let _valueIn = '';
        if (value) {
          let valueInBN = ZERO;
          if (!isReverse) {
            valueInBN = ZERO.plus(value).times(price);
          } else {
            valueInBN = ZERO.plus(value).div(price);
          }
          _valueIn = valueInBN
            .div(LIMIT_RECEIVE_RATE)
            .dp(pre.tokenIn?.decimals || 0, BigNumber.ROUND_CEIL)
            .toFixed();
        }

        return {
          ...pre,
          valueOut: value,
          isFocusValueIn: false,
          valueIn: _valueIn,
        };
      });
    },
    [tokenPriceInfo],
  );

  const setTokenIn = useCallback(async (tokenIn?: TCurrency) => {
    if (!tokenIn) return;
    limitPairPriceRef.current?.reset();
    setLimitInfo(pre => {
      const isSwitch = pre.tokenOut?.symbol === tokenIn.symbol;
      if (!isSwitch)
        return {
          ...pre,
          tokenIn,
          isFocusValueIn: true,
          valueIn: '',
          valueOut: '',
        };
      return {
        ...pre,
        tokenIn,
        tokenOut: pre.tokenIn,
        isFocusValueIn: !pre.isFocusValueIn,
        valueOut: pre.isFocusValueIn ? pre.valueIn : '',
        valueIn: pre.isFocusValueIn ? '' : pre.valueOut,
      };
    });
  }, []);

  const setTokenOut = useCallback(async (tokenOut?: TCurrency) => {
    if (!tokenOut) return;
    limitPairPriceRef.current?.reset();
    setLimitInfo(pre => {
      const isSwitch = pre.tokenIn?.symbol === tokenOut.symbol;
      if (!isSwitch)
        return {
          ...pre,
          tokenOut,
          isFocusValueIn: true,
          valueOut: '',
        };

      return {
        ...pre,
        tokenOut,
        tokenIn: pre.tokenOut,
        isFocusValueIn: !pre.isFocusValueIn,
        valueOut: pre.isFocusValueIn ? pre.valueIn : '',
        valueIn: pre.isFocusValueIn ? '' : pre.valueOut,
      };
    });
  }, []);

  const switchToken = useCallback(async () => {
    limitPairPriceRef.current?.reset();
    setLimitInfo(pre => ({
      ...pre,
      tokenIn: pre.tokenOut,
      tokenOut: pre.tokenIn,
      isFocusValueIn: !pre.isFocusValueIn,
      valueOut: pre.isFocusValueIn ? pre.valueIn : '',
      valueIn: pre.isFocusValueIn ? '' : pre.valueOut,
    }));
  }, []);

  const refreshValue = useCallback(
    (price: string, isReverse: boolean) => {
      if (limitInfo.isFocusValueIn) {
        setValueIn(limitInfo.valueIn, {
          price,
          isReverse,
        });
      } else {
        setValueOut(limitInfo.valueOut, {
          price,
          isReverse,
        });
      }
    },
    [limitInfo.isFocusValueIn, limitInfo.valueIn, limitInfo.valueOut, setValueIn, setValueOut],
  );
  const refreshValueRef = useRef(refreshValue);
  refreshValueRef.current = refreshValue;
  const onPairPriceChange = useCallback((value: string, isReverse: boolean) => {
    setTokenPriceInfo({
      price: value,
      isReverse,
    });
    refreshValueRef.current(value, isReverse);
  }, []);

  const isExceedBalance = useMemo(() => {
    const { tokenIn, valueIn } = limitInfo;
    if (!tokenIn) return false;
    const tokenInBalance = currencyBalances?.[limitInfo.tokenIn?.symbol || ''];
    if (tokenInBalance === undefined) return true;
    const validBalance = tokenIn.symbol === 'ELF' ? ZERO.plus(tokenInBalance).minus(gasFee) : tokenInBalance;
    if (ZERO.plus(valueIn).gt(divDecimals(validBalance, tokenIn.decimals))) return true;
    return false;
  }, [currencyBalances, gasFee, limitInfo]);

  const [pairPriceError, setPairPriceError] = useState<TLimitPairPriceError>({
    text: '',
    btnText: '',
    error: false,
  });

  const isBtnDisable = useMemo(() => {
    const { tokenIn, tokenOut, valueIn, valueOut } = limitInfo;
    if (!tokenIn || !tokenOut) return true;
    if (isReserveError) return true;
    if (!tokenPriceInfo.price || ZERO.eq(tokenPriceInfo.price)) return true;
    if (pairPriceError.error) return true;
    if (!valueIn || ZERO.eq(valueIn)) return true;
    if (!valueOut || ZERO.eq(valueOut)) return true;

    if (isExceedBalance) return true;
    return false;
  }, [isExceedBalance, isReserveError, limitInfo, pairPriceError.error, tokenPriceInfo.price]);

  const isInputError = useMemo(() => {
    if (!currencyBalances) return false;
    const tokenInBalance = currencyBalances[limitInfo.tokenIn?.symbol || ''];
    if (!tokenInBalance || tokenInBalance.isNaN()) return false;
    return isExceedBalance;
  }, [currencyBalances, isExceedBalance, limitInfo.tokenIn?.symbol]);

  const [isLoading, setIsLoading] = useState(false);

  const getUnfilled = useGetLimitOrderRemainingUnfilled();
  const dAppChainId = useDAppChainId();
  const wallet = useCurrentWalletInfo();
  const onSwapClick = useCallback(async () => {
    const { tokenIn, tokenOut, valueIn, valueOut } = limitInfo;
    if (!tokenIn || !tokenOut || isReserveError) return;

    if (ZERO.gte(valueIn || 0) || ZERO.gte(valueOut || 0)) return;
    setIsLoading(true);
    try {
      const result = await getUnfilled({
        dto: {
          chainId: dAppChainId,
          makerAddress: wallet[dAppChainId]?.caAddress || '',
          tokenSymbol: tokenIn.symbol,
        },
      });
      // limitConfirmModalRef.current?.show({
      //   tokenIn,
      //   tokenOut,
      //   amountIn: valueIn,
      //   amountOut: valueOut,
      //   expiryValue,
      //   isPriceReverse: tokenPriceInfo.isReverse,
      //   unfilledCount: result.data.limitOrderRemainingUnfilled.orderCount,
      //   unfilledValue: result.data.limitOrderRemainingUnfilled.value,
      // });
    } catch (error) {
      console.log('LimitSellBtnWithPay error', error);
    } finally {
      setIsLoading(false);
    }
  }, [dAppChainId, getUnfilled, isReserveError, limitInfo, wallet]);

  const actionButtonTitle = useMemo(() => {
    if (isReserveError) {
      return 'Limit not available';
    } else if (isExceedBalance) {
      return `Insufficient ${limitInfo.tokenIn?.label || limitInfo.tokenIn?.symbol} balance`;
    } else {
      return 'Preview';
    }
  }, [isExceedBalance, isReserveError, limitInfo.tokenIn?.label, limitInfo.tokenIn?.symbol]);

  const { ref, value } = useKeyboardSafeArea(pTd(16));
  const [isRateInputting, setIsRateInputting] = useState(false);

  return (
    <View style={styles.limitEnterWrap}>
      <View
        style={
          isRateInputting && {
            marginTop: value ? -1 * value : undefined,
            paddingBottom: value ? value : undefined,
          }
        }>
        <AmountCardGroup
          style={styles.amountCardGroup}
          inputProps={{
            returnKeyType: 'done',
          }}
          swapInfo={limitInfo}
          setValueIn={setValueIn}
          setValueOut={setValueOut}
          isErrorIn={isInputError}
          balances={currencyBalances}
          setTokenIn={setTokenIn}
          setTokenOut={setTokenOut}
          switchToken={switchToken}
        />
        <CommonPromptCard
          style={styles.promptCard}
          type={PromptCardType.ERROR}
          description="There is currently no available liquidity pool for the selected token pair. Select different tokens to continue."
        />
        <CommonButton
          style={styles.actionButton}
          type="primary"
          title={t(actionButtonTitle)}
          disabled={isBtnDisable}
          onPress={onSwapClick}
          loading={isLoading}
        />

        <RateCard
          viewRef={ref}
          style={styles.rateCard}
          ref={limitPairPriceRef}
          tokenIn={limitInfo.tokenIn}
          tokenOut={limitInfo.tokenOut}
          reserve={maxReserve}
          onChange={onPairPriceChange}
          onErrorChange={setPairPriceError}
          onInputtingChange={setIsRateInputting}
        />
        <View style={styles.infoWrap}>
          <CommonInfoRow
            label={{
              text: 'Provider',
              tooltipProps: {
                title: 'Provider',
                description: 'The decentralised exchange where your trade will be executed.',
              },
            }}
            value={{ text: 'AwakenSwap' }}
          />
          <CommonInfoRow
            label={{
              text: 'Expires by',
              tooltipProps: {
                title: 'Expires by',
                description: "Your trade will be cancelled if it's not completed within the set timeframe.",
              },
            }}
            value={{ content: <ExpiresSelect selectedValue={expiryValue} onChangeValue={setExpiryValue} /> }}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(LimitEnter);
