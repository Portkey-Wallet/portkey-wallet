import { darkColors, defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import { makeStyles, useThemeMode } from '@rneui/themed';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import fonts from 'assets/theme/fonts';
import Touchable from 'components/Touchable';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';
import { useInputFocus } from 'hooks/useInputFocus';
import { isIOS } from '@portkey-wallet/utils/mobile/device';

export interface ITokenAmountInput {
  value?: string;
  usdValue?: string;
  label?: string;
  symbol: string;
  decimals: string | number;
  warningTip?: string;
  editable?: boolean;
  showErrorInput?: boolean;
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
    showErrorInput = false,
    setValue,
    setUsdValue,
    styleProps,
  } = props;
  const [isRevert, setIsRevert] = useState(false);
  const { mode } = useThemeMode();
  const [tokenPriceObject, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const isMainnet = useIsMainnet();
  const styles = getStyles();

  const iptRef = useRef<TextInput>(null);
  useInputFocus(iptRef);

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

  const existTokenPrice = useMemo(() => {
    return tokenPriceObject[symbol] !== 0;
  }, [tokenPriceObject, symbol]);

  return (
    <View style={[styles.wrap, styleProps]}>
      <View style={[GStyles.flexRow, styles.topSection]}>
        <>
          {isRevert ? (
            <>
              <Text style={styles.label}>{'$ '}</Text>
              <TextInput
                value={usdValue}
                onChangeText={onUsdValueInputChange}
                style={[styles.input, showErrorInput && warningTip && styles.errorInput]}
                placeholder="0"
                placeholderTextColor={darkColors.textBase3}
                keyboardType="numeric"
                editable={editable}
              />
            </>
          ) : (
            <>
              <TextInput
                ref={iptRef}
                value={value}
                style={[
                  styles.input,
                  showErrorInput && warningTip && styles.errorInput,
                  value?.length > 12 && styles.middleText,
                  value?.length > 18 && styles.smallText,
                ]}
                placeholder="0"
                placeholderTextColor={darkColors.textBase3}
                keyboardType="numeric"
                onChangeText={onValueInputChange}
                editable={editable}
              />
              <Text
                style={[
                  styles.label,
                  !isIOS && styles.labelPaddingBottom,
                  value?.length > 12 && styles.middleText,
                  value?.length > 18 && styles.smallText,
                ]}>{` ${label || symbol}`}</Text>
            </>
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
      {warningTip && <Text style={styles.warningText}>{warningTip}</Text>}
    </View>
  );
};

export default memo(TokenAmountInput);

export const getStyles = makeStyles(theme => ({
  wrap: {
    backgroundColor: theme.colors.bgBase1,
    paddingTop: pTd(12),
    paddingBottom: pTd(24),
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
  },
  label: {
    fontSize: pTd(32),
    ...fonts.BGMediumFont,
  },
  labelPaddingBottom: {
    paddingBottom: pTd(9),
  },
  input: {
    color: theme.colors.textBase1,
    width: 'auto',
    maxWidth: '80%',
    height: pTd(62),
    textAlign: 'right',
    fontSize: pTd(32),
    ...fonts.BGMediumFont,
    paddingHorizontal: 0,
  },
  middleText: {
    fontSize: pTd(24),
  },
  smallText: {
    fontSize: pTd(16),
  },
  errorInput: {
    color: theme.colors.textDanger1,
  },
  bottomText: {
    color: theme.colors.textBase2,
  },
  warningText: {
    marginTop: pTd(8),
    textAlign: 'center',
    color: theme.colors.textDanger2,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  warningIconWrap: {
    flexDirection: 'row',
    marginLeft: pTd(6),
  },
  tipContainerStyle: {
    width: pTd(189),
  },
}));
