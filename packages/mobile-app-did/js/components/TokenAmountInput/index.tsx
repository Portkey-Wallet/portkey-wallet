import { darkColors, defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextH1, TextL } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, LayoutChangeEvent, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import { makeStyles, useThemeMode } from '@rneui/themed';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import fonts from 'assets/theme/fonts';
import Touchable from 'components/Touchable';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { FloatTip } from 'components/FloatTip';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

export interface ITokenAmountInput {
  value?: string;
  usdValue?: string;
  label?: string;
  symbol: string;
  decimals: string | number;
  warningTip?: string;
  editable?: boolean;
  setValue: (v: string) => void;
  setUsdValue: (v: string) => void;
  styleProps?: ViewStyle;
}

const TokenAmountInput: React.FC<ITokenAmountInput> = props => {
  const {
    value = '',
    usdValue = '',
    label,
    symbol,
    decimals,
    warningTip = '',
    editable = true,
    setValue,
    setUsdValue,
    styleProps,
  } = props;
  const [isRevert, setIsRevert] = useState(false);
  const { mode } = useThemeMode();
  const [tokenPriceObject, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const isMainnet = useIsMainnet();
  const styles = getStyles();
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const [warningClick, setWarningClick] = useState(false);
  const [wrapperLayoutProps, setWrapperLayoutProps] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  useEffectOnce(() => {
    getTokenPrice(symbol);
  });
  const onPressRevert = useCallback(() => setIsRevert(pre => !pre), []);
  const onValueInputChange = useCallback(
    (v: string) => {
      const _v = parseInputNumberChange(v, Infinity, Number(decimals));
      const _usdV = ZERO.plus(_v || 0)
        .multipliedBy(tokenPriceObject[symbol])
        .toFixed(2);
      setValue(_v);
      setUsdValue(_usdV);
    },
    [decimals, setUsdValue, setValue, symbol, tokenPriceObject],
  );
  const onUsdValueInputChange = useCallback(
    (v: string) => {
      const _usdV = parseInputNumberChange(v, Infinity, 2);
      const _v = parseInputNumberChange(
        ZERO.plus(_usdV || 0)
          .div(tokenPriceObject[symbol])
          .valueOf(),
        Infinity,
        Number(decimals),
      );
      setUsdValue(_usdV);
      setValue(_v);
    },
    [decimals, setUsdValue, setValue, symbol, tokenPriceObject],
  );

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if (wrapperLayoutProps.width === width && wrapperLayoutProps.height === height) return;
      setWrapperLayoutProps({ width, height });
    },
    [wrapperLayoutProps],
  );
  const clickWarning = useCallback(() => {
    setWarningClick(true);
    warningRef.current = setTimeout(() => {
      setWarningClick(false);
      warningRef.current = null;
    }, 2000);
  }, []);

  const existTokenPrice = useMemo(() => {
    return tokenPriceObject[symbol] !== 0;
  }, [tokenPriceObject, symbol]);

  return (
    <View style={[styles.wrap, styleProps]}>
      <View style={[GStyles.flexRow, styles.topSection]}>
        <>
          {isRevert ? (
            <>
              <TextH1>{`$ `}</TextH1>
              <TextInput
                value={usdValue}
                onChangeText={onUsdValueInputChange}
                style={styles.input}
                placeholder="0"
                placeholderTextColor={darkColors.textBase3}
                keyboardType="numeric"
                editable={editable}
              />
            </>
          ) : (
            <>
              <TextInput
                value={value}
                style={styles.input}
                placeholder="0"
                placeholderTextColor={darkColors.textBase3}
                keyboardType="numeric"
                onChangeText={onValueInputChange}
                editable={editable}
              />
              <TextH1>{` ${label || symbol}`}</TextH1>
            </>
          )}
          {warningTip && (
            <TouchableOpacity
              onPress={clickWarning}
              onLayout={onLayout}
              disabled={warningClick}
              style={styles.warningIconWrap}>
              <FloatTip
                wrapperLayoutProps={wrapperLayoutProps}
                textStyle={{
                  color: defaultColors.textBase2,
                }}
                content={warningTip}
                display={warningClick}
              />
              <Svg icon="warning" iconStyle={{ marginLeft: pTd(6) }} color={defaultColors.iconDanger1} size={pTd(24)} />
            </TouchableOpacity>
          )}
        </>
      </View>
      {isMainnet && existTokenPrice && (
        <Touchable onPress={onPressRevert} style={[GStyles.flexRow, styles.bottomSection]}>
          {isRevert ? (
            <TextL style={styles.bottomText}>{`${value || 0} ${label || symbol}`}</TextL>
          ) : (
            <TextL style={styles.bottomText}>{`$${usdValue || 0}`}</TextL>
          )}
          <Svg icon="switch" color={mode === 'dark' ? darkColors.iconBase2 : defaultColors.iconBase2} size={pTd(16)} />
        </Touchable>
      )}
    </View>
  );
};

export default memo(TokenAmountInput);

export const getStyles = makeStyles(theme => ({
  wrap: {
    backgroundColor: theme.colors.bgBase1,
    paddingVertical: pTd(24),
    paddingHorizontal: pTd(16),
  },
  topSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: pTd(8),
  },
  input: {
    color: theme.colors.textBase1,
    width: 'auto',
    maxWidth: '80%',
    textAlign: 'right',
    fontSize: pTd(32),
    ...fonts.BGMediumFont,
  },
  bottomText: {
    color: theme.colors.textBase2,
  },
  warningIconWrap: {
    flexDirection: 'row',
  },
}));
