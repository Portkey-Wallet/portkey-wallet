import { darkColors, defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextXXXL } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { memo, useCallback, useState } from 'react';
import { View, TextInput } from 'react-native';
import { pTd } from 'utils/unit';
import { makeStyles, useThemeMode } from '@rneui/themed';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import fonts from 'assets/theme/fonts';
import Touchable from 'components/Touchable';
import { formatAmountUSDShow } from '@portkey-wallet/utils/converter';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';

export interface ITokenAmountInput {
  value: string;
  usdValue: string;
  label?: string;
  symbol: string;
  decimals: string | number;
  setValue: (v: string) => void;
  setUsdValue: (v: string) => void;
}

const TokenAmountInput: React.FC<ITokenAmountInput> = props => {
  const { value = '', usdValue = '', label, symbol, decimals, setValue, setUsdValue } = props;
  const [isRevert, setIsRevert] = useState(false);
  const { mode } = useThemeMode();
  const [tokenPriceObject] = useGetCurrentAccountTokenPrice();
  const styles = getStyles();

  const onPressRevert = useCallback(() => setIsRevert(pre => !pre), []);
  const onValueInputChange = useCallback(
    (v: string) => {
      const _v = parseInputNumberChange(v, Infinity, Number(decimals));
      const _usdV = formatAmountUSDShow(ZERO.plus(_v).multipliedBy(tokenPriceObject[symbol]));
      setValue(_v);
      setUsdValue(_usdV);
    },
    [decimals, setUsdValue, setValue, symbol, tokenPriceObject],
  );
  const onUsdValueInputChange = useCallback(
    (v: string) => {
      const _usdV = parseInputNumberChange(v, Infinity, 2);
      const _v = parseInputNumberChange(
        ZERO.plus(_usdV).div(tokenPriceObject[symbol]).valueOf(),
        Infinity,
        Number(decimals),
      );
      setUsdValue(_usdV);
      setValue(_v);
    },
    [decimals, setUsdValue, setValue, symbol, tokenPriceObject],
  );

  return (
    <View style={styles.wrap}>
      <View style={[GStyles.flexRow, styles.topSection]}>
        {isRevert ? (
          <>
            <TextXXXL style={styles.unit}>{`$ `}</TextXXXL>
            <TextInput
              value={usdValue}
              onChangeText={onUsdValueInputChange}
              style={styles.input}
              placeholder="0"
              placeholderTextColor={darkColors.textBase3}
              keyboardType="numeric"
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
            />
            <TextXXXL style={styles.unit}>{` ${label || symbol}`}</TextXXXL>
          </>
        )}
      </View>
      <Touchable onPress={onPressRevert} style={[GStyles.flexRow, styles.bottomSection]}>
        {isRevert ? (
          <TextL style={styles.bottomText}>{`${value || 0} ${label || symbol}`}</TextL>
        ) : (
          <TextL style={styles.bottomText}>{`$${usdValue || 0}`}</TextL>
        )}
        <Svg icon="switch" color={mode === 'dark' ? darkColors.iconBase2 : defaultColors.iconBase2} />
      </Touchable>
    </View>
  );
};

export default memo(TokenAmountInput);

export const getStyles = makeStyles(theme => ({
  wrap: {
    backgroundColor: theme.colors.bgBase1,
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
  input: {
    color: theme.colors.textBase1,
    width: 'auto',
    maxWidth: '80%',
    textAlign: 'right',
    fontSize: pTd(32),
    ...fonts.SGMediumFont,
  },
  unit: {
    fontSize: pTd(32),
  },
  bottomText: {
    color: theme.colors.textBase2,
  },
}));
