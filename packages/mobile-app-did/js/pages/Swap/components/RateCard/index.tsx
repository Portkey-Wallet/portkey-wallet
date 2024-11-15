import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTheme, Input } from '@rneui/themed';
import { useLanguage } from 'i18n/hooks';
import { View, Text } from 'react-native';
import CommonButton from 'components/CommonButton';
import Svg from 'components/Svg';
import CommonTagToggleGroup, { TagToggleGroupSize } from 'components/CommonTagToggleGroup';
import { pTd } from 'utils/unit';
import { ViewStyleType } from 'types/styles';
import { getStyles } from './style';
import { TCurrency } from '@portkey-wallet/types/types-ca/awaken';
import { TReserveInfo } from '@portkey-wallet/hooks/hooks-ca/awaken/limit';
import { formatNameWithNoUnderline } from '@portkey-wallet/utils';
import { ONE, ZERO } from '@portkey-wallet/constants/misc';
import { LIMIT_PRICE_DECIMAL } from '@portkey-wallet/constants/constants-ca/awaken/limit';
import BigNumber from 'bignumber.js';
import { getPairTokenRatio } from '@portkey-wallet/utils/awaken';
import { divDecimals } from '@portkey-wallet/utils/converter';
import { isValidNumberV2 } from '@portkey-wallet/utils/reg';
import { parseInputChange } from '@portkey-wallet/utils/input';

export interface ILimitRateCard {
  reset: () => void;
}

enum PriceBtnKeyEnum {
  market = 1,
  one,
  three,
  five,
}

type TPriceBtn = {
  label: string;
  value: string;
  key: PriceBtnKeyEnum;
  hideCheckIcon: boolean;
};

const PRICE_BTN_LIST: TPriceBtn[] = [
  {
    label: 'Market',
    value: '0',
    key: PriceBtnKeyEnum.market,
    hideCheckIcon: true,
  },
  {
    label: '1%',
    value: '0.01',
    key: PriceBtnKeyEnum.one,
    hideCheckIcon: true,
  },
  {
    label: '3%',
    value: '0.03',
    key: PriceBtnKeyEnum.three,
    hideCheckIcon: true,
  },
  {
    label: '5%',
    value: '0.05',
    key: PriceBtnKeyEnum.five,
    hideCheckIcon: true,
  },
];

type TDiffPercentInfo = {
  color?: string;
  value: string;
  prefix: string;
  valueStr: string;
};

export type TLimitPairPriceError = {
  text: string;
  btnText: string;
  error: boolean;
};

export type TLimitPairPriceProps = {
  viewRef?: React.RefObject<View>;
  style?: ViewStyleType;
  tokenIn?: TCurrency;
  tokenOut?: TCurrency;
  reserve?: TReserveInfo;
  isReverseInit?: boolean;
  onChange?: (value: string, isReverse: boolean) => void;
  onFocus?: () => void;
  isZeroShow?: boolean;
  onErrorChange?: (error: TLimitPairPriceError) => void;
  onInputtingChange?: (val: boolean) => void;
};

export default forwardRef(function RateCard(
  {
    viewRef,
    style,
    tokenIn,
    tokenOut,
    reserve,
    isReverseInit = true,
    onChange,
    onFocus,
    isZeroShow = false,
    onErrorChange,
    onInputtingChange,
  }: TLimitPairPriceProps,
  ref,
) {
  const styles = getStyles();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [isReverse, setIsReverse] = useState(isReverseInit);
  const isReverseRef = useRef(isReverse);
  isReverseRef.current = isReverse;

  const tokenOutMarketPrice = useMemo(() => {
    return ZERO.plus(
      getPairTokenRatio({
        tokenA: tokenOut,
        tokenB: tokenIn,
        reserves: {
          [tokenOut?.symbol || '']: reserve?.reserveOut || '0',
          [tokenIn?.symbol || '']: reserve?.reserveIn || '0',
        },
      }),
    ).toFixed();
  }, [reserve?.reserveIn, reserve?.reserveOut, tokenIn, tokenOut]);
  const tokenOutMarketPriceRef = useRef(tokenOutMarketPrice);
  tokenOutMarketPriceRef.current = tokenOutMarketPrice;

  const [price, setPrice] = useState('');

  const refreshPriceValue = useCallback(
    (_priceKey: PriceBtnKeyEnum) => {
      console.log('tokenOutMarketPrice change', tokenOutMarketPrice, isReverse);

      const tokenOutMarketPriceBN = ZERO.plus(tokenOutMarketPrice);
      const priceBtn = PRICE_BTN_LIST.find(item => item.key === _priceKey);
      let value = ZERO;
      const realValue = tokenOutMarketPriceBN.times(ONE.minus(priceBtn?.value || 0));

      if (!isReverse) {
        value = realValue.dp(LIMIT_PRICE_DECIMAL, BigNumber.ROUND_DOWN);
      } else {
        if (ZERO.eq(tokenOutMarketPriceBN)) value = ZERO;
        else
          value = ONE.div(tokenOutMarketPriceBN)
            .times(ONE.plus(priceBtn?.value || 0))
            .dp(LIMIT_PRICE_DECIMAL, BigNumber.ROUND_DOWN);
      }

      const valueStr = value.toFixed();
      setPrice(valueStr);

      return valueStr;
    },
    [isReverse, tokenOutMarketPrice],
  );
  const refreshPriceValueRef = useRef(refreshPriceValue);
  refreshPriceValueRef.current = refreshPriceValue;

  const isTokenAMarketPriceInitRef = useRef(false);
  useEffect(() => {
    if (!isTokenAMarketPriceInitRef.current) return;
    console.log('LimitPairPrice value change', isReverse, tokenOutMarketPrice, isTokenAMarketPriceInitRef.current);
    const value = refreshPriceValueRef.current(PriceBtnKeyEnum.market);
    onChange?.(value, isReverseRef.current);
  }, [onChange, isReverse, tokenOutMarketPrice]);

  useEffect(() => {
    if (isTokenAMarketPriceInitRef.current) return;
    if (ZERO.gte(tokenOutMarketPrice)) return;
    isTokenAMarketPriceInitRef.current = true;
    console.log('LimitPairPrice init', tokenOutMarketPrice);
    const value = refreshPriceValueRef.current(PriceBtnKeyEnum.market);
    onChange?.(value, isReverseRef.current);
  }, [tokenOutMarketPrice, onChange]);

  const onChangeRate = useCallback(
    (_: string, item: any) => {
      // setPriceKey(item.key);
      console.log('LimitPairPrice onClick');
      onChange?.(refreshPriceValueRef.current(item.key), isReverseRef.current);
      onFocus?.();
    },
    [onChange, onFocus],
  );

  const min = useRef<BigNumber>(divDecimals(ONE, LIMIT_PRICE_DECIMAL));
  const inputChange = useCallback(
    (str: string) => {
      if (str && !isValidNumberV2(str)) {
        return;
      }

      const value = parseInputChange(str, min.current, LIMIT_PRICE_DECIMAL);
      setPrice(value);
      onChange?.(
        // !isReverse ? value : ONE.div(value).toFixed(LIMIT_PRICE_DECIMAL, BigNumber.ROUND_FLOOR),
        value,
        isReverseRef.current,
      );
    },
    [onChange],
  );

  const amountError = useMemo<TLimitPairPriceError>(() => {
    if (isZeroShow && (ZERO.gte(price) || price === '')) {
      return {
        text: t('Please enter a price'),
        btnText: t('Please enter a price'),
        error: true,
      };
    }

    // const tokenOutMarketPriceBN = ZERO.plus(tokenOutMarketPriceRef.current).dp(
    //   LIMIT_PRICE_DECIMAL,
    //   BigNumber.ROUND_FLOOR,
    // );
    // const _isReverse = isReverseRef.current;

    // const maxValue = tokenOutMarketPriceBN
    //   .times(LIMIT_MAX_BUFFER_RATIO)
    //   .dp(LIMIT_PRICE_DECIMAL, BigNumber.ROUND_FLOOR);
    // if (!_isReverse) {
    //   if (maxValue.lt(price)) {
    //     return {
    //       text: t(`limitHighPriceDescription`),
    //       btnText: t('limitHighPriceBtnText'),
    //       error: true,
    //     };
    //   }
    // } else {
    //   const minValue = ONE.div(maxValue).dp(LIMIT_PRICE_DECIMAL, BigNumber.ROUND_FLOOR);
    //   if (minValue.gt(price) && maxValue.gt(ZERO)) {
    //     return {
    //       text: t('limitLowPriceDescription'),
    //       btnText: t('limitLowPriceBtnText'),
    //       error: true,
    //     };
    //   }
    // }
    return {
      text: '',
      btnText: '',
      error: false,
    };
  }, [isZeroShow, price, t]);
  useEffect(() => {
    onErrorChange?.(amountError);
  }, [amountError, onErrorChange]);

  const diffPercentInfo: TDiffPercentInfo | undefined = useMemo(() => {
    if (!price || ZERO.eq(price)) return undefined;
    const _isReverse = isReverseRef.current;
    const tokenOutMarketPriceBN = ZERO.plus(tokenOutMarketPriceRef.current);
    const marketPriceBN = !_isReverse ? tokenOutMarketPriceBN : ONE.div(tokenOutMarketPriceBN);

    const diffPercent = ZERO.plus(price).div(marketPriceBN).minus(1);
    const isZero = diffPercent.dp(4, BigNumber.ROUND_HALF_CEIL).eq(ZERO);

    if (isZero || ZERO.eq(tokenOutMarketPriceBN)) {
      return {
        value: '0',
        valueStr: '0%',
        prefix: '',
      };
    }

    const absPercentValue = diffPercent.abs().times(100).toFixed(2, BigNumber.ROUND_HALF_CEIL);
    const absPercentStr = `${absPercentValue}%`;
    if (ZERO.gt(diffPercent)) {
      return {
        color: theme.colors.textDanger2,
        value: absPercentValue,
        valueStr: absPercentStr,
        prefix: '-',
      };
    }
    return {
      color: theme.colors.textSuccess1,
      value: absPercentValue,
      valueStr: absPercentStr,
      prefix: '+',
    };
  }, [price, theme.colors.textDanger2, theme.colors.textSuccess1]);

  const titlePrefix = useMemo(() => {
    return isReverse
      ? `Pay ${formatNameWithNoUnderline(tokenIn?.symbol)} at rate`
      : `Receive ${formatNameWithNoUnderline(tokenOut?.symbol)} at rate`;
  }, [isReverse, tokenIn?.symbol, tokenOut?.symbol]);

  const title = useMemo(() => {
    if (!diffPercentInfo || diffPercentInfo.value === '0') return titlePrefix;

    return (
      <>
        {titlePrefix}
        <Text
          style={[
            styles.title,
            { color: diffPercentInfo.color },
          ]}>{` (${diffPercentInfo.prefix}${diffPercentInfo.valueStr})`}</Text>
      </>
    );
  }, [diffPercentInfo, styles.title, titlePrefix]);

  const reset = useCallback(async () => {
    isTokenAMarketPriceInitRef.current = false;
    setPrice('');
  }, []);
  useImperativeHandle(ref, () => ({ reset }));

  const switchReverse = useCallback(() => {
    setIsReverse(pre => !pre);
  }, []);

  const selectedValue = useMemo(() => {
    if (!diffPercentInfo) return undefined;
    if (isReverse && diffPercentInfo.prefix === '-') return undefined;
    const selectItem = PRICE_BTN_LIST.find(item =>
      ZERO.plus(diffPercentInfo.value).div(100).minus(item.value).abs().lt(0.0001),
    );
    if (!selectItem) return undefined;
    return selectItem.value;
  }, [diffPercentInfo, isReverse]);

  const tagList = useMemo(() => {
    return PRICE_BTN_LIST.map(item => {
      const symbol = isReverse ? '+' : '-';
      const label = item.key === PriceBtnKeyEnum.market ? item.label : `${symbol}${item.label}`;
      return {
        ...item,
        label,
      };
    });
  }, [isReverse]);

  const symbolUnit = useMemo(
    () => formatNameWithNoUnderline(isReverse ? tokenOut?.symbol : tokenIn?.symbol),
    [isReverse, tokenIn?.symbol, tokenOut?.symbol],
  );

  return (
    <View style={[styles.rateCardWrap, style]} ref={viewRef}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.amountWrap}>
        {/* <Text style={styles.amountText} numberOfLines={1} ellipsizeMode="tail">
          {amount || '0'}
        </Text> */}
        <Input
          returnKeyType="done"
          keyboardType="numeric"
          maxLength={18}
          placeholderTextColor={theme.colors.textBase3}
          placeholder="0"
          value={price}
          onChangeText={inputChange}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={styles.inputStyle}
          onFocus={() => onInputtingChange?.(true)}
          onBlur={() => onInputtingChange?.(false)}
        />

        <CommonButton
          buttonStyle={styles.switchTokenButton}
          type="outline"
          title={
            <>
              <Svg iconStyle={styles.switchTokenIcon} icon="swap-thin" size={pTd(14)} color={theme.colors.iconBase2} />
              <Text style={styles.switchTokenText}>{symbolUnit}</Text>
            </>
          }
          onPress={switchReverse}
        />
      </View>
      <CommonTagToggleGroup
        tagItemStyle={styles.tagItemStyle}
        size={TagToggleGroupSize.SM}
        isRound
        isOutline
        tagList={tagList}
        selectedValue={selectedValue}
        onSelect={onChangeRate}
      />
    </View>
  );
});
