import React, { useMemo } from 'react';
import { TextInputProps, View } from 'react-native';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import AmountCard from '../AmountCard';
import { pTd } from 'utils/unit';
import { ViewStyleType } from 'types/styles';
import { getStyles } from './style';
import { TSwapInfo } from '../SwapEnter';
import { useAwakenTokenPrices } from '@portkey-wallet/hooks/hooks-ca/awaken/state';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useTheme } from '@rneui/themed';
import { TextM } from 'components/CommonText';
import { TBalancesV2 } from 'hooks/awaken';
import { TCurrency } from '@portkey-wallet/types/types-ca/awaken';

interface IAmountCardGroupProps {
  style?: ViewStyleType;
  swapInfo: TSwapInfo;
  setValueIn?: (value: string) => Promise<void>;
  setValueOut?: (value: string) => Promise<void>;
  isErrorIn?: boolean;
  balances: TBalancesV2;
  setTokenIn?: (token: TCurrency) => void;
  setTokenOut?: (token: TCurrency) => void;
  switchToken?: () => void;
  inputProps?: TextInputProps;
}

const AmountCardGroup = ({
  style,
  swapInfo,
  setValueIn,
  setValueOut,
  isErrorIn,
  balances,
  setTokenIn,
  setTokenOut,
  switchToken,
  inputProps,
}: IAmountCardGroupProps) => {
  const styles = getStyles();
  const { theme } = useTheme();
  const { price: tokenInPrice } = useAwakenTokenPrices({ symbol: swapInfo.tokenIn?.symbol });
  const { price: tokenOutPrice } = useAwakenTokenPrices({ symbol: swapInfo.tokenOut?.symbol });
  const amountInUsd = useMemo(() => {
    return `$${ZERO.plus(swapInfo.valueIn.trim() || 0)
      .times(tokenInPrice)
      .dp(2)
      .toFixed()}`;
  }, [swapInfo.valueIn, tokenInPrice]);

  const usdImpactInfo = useMemo(() => {
    const { tokenIn, tokenOut, valueIn, valueOut } = swapInfo;
    if (!tokenIn || !tokenOut || !valueIn || !valueOut) return undefined;

    if (
      !tokenInPrice ||
      tokenInPrice === '0' ||
      !tokenOutPrice ||
      tokenOutPrice === '0' ||
      ZERO.eq(valueIn) ||
      ZERO.eq(valueOut)
    )
      return;

    const priceIn = ZERO.plus(valueIn).times(tokenInPrice);
    const priceOut = ZERO.plus(valueOut).times(tokenOutPrice);
    const _impact = priceOut.minus(priceIn).div(priceIn).times(100).dp(2);
    let fontColor = theme.colors.textBase2;
    if (_impact.gt(ZERO)) {
      fontColor = theme.colors.textSuccess1;
    } else if (_impact.lt(ZERO)) {
      fontColor = theme.colors.textDanger2;
    }

    return {
      label: `${_impact.gt(ZERO) ? '+' : ''}${_impact.toFixed()}%`,
      fontColor,
    };
  }, [swapInfo, theme, tokenInPrice, tokenOutPrice]);

  const amountOutUsd = useMemo(() => {
    return (
      <>
        {`$${ZERO.plus(swapInfo.valueOut.trim() || 0)
          .times(tokenOutPrice)
          .dp(2)
          .toFixed()}`}
        <TextM style={{ color: usdImpactInfo?.fontColor }}>{usdImpactInfo ? `(${usdImpactInfo.label})` : ''}</TextM>
      </>
    );
  }, [swapInfo.valueOut, tokenOutPrice, usdImpactInfo]);

  return (
    <View style={[styles.amountCardGroup, style]}>
      <AmountCard
        inputProps={inputProps}
        title="You Pay"
        isInput
        amount={swapInfo.valueIn}
        onAmountChange={setValueIn}
        balance={balances?.[swapInfo.tokenIn?.symbol || '']}
        amountUsd={amountInUsd}
        isError={isErrorIn}
        token={swapInfo.tokenIn}
        onTokenChange={setTokenIn}
        isMaxShow={true}
      />
      <AmountCard
        inputProps={inputProps}
        style={styles.amountCardMarginTop}
        title="You Receive"
        amount={swapInfo.valueOut}
        onAmountChange={setValueOut}
        amountUsd={amountOutUsd}
        token={swapInfo.tokenOut}
        onTokenChange={setTokenOut}
        isInput
      />
      <Touchable style={styles.swapIconWrap} onPress={switchToken}>
        <Svg icon={'swap-arrow'} size={pTd(20)} />
      </Touchable>
    </View>
  );
};

export default AmountCardGroup;
