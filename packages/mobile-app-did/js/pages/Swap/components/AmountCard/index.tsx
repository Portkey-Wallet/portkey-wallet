import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Input, useTheme } from '@rneui/themed';
import CommonButton from 'components/CommonButton';
import Touchable from 'components/Touchable';
import SelectTokenButton from '../SelectTokenButton';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { ViewStyleType } from 'types/styles';
import { getStyles } from './style';
import { useAwakenGasFee } from '@portkey-wallet/hooks/hooks-ca/awaken/state';
import { ZERO } from '@portkey-wallet/constants/misc';
import { divDecimals } from '@portkey-wallet/utils/converter';
import Bignumber from 'bignumber.js';
import { TCurrency } from '@portkey-wallet/types/awaken';
import { formatNameWithNoUnderline } from '@portkey-wallet/utils';
import { isValidNumberV2 } from '@portkey-wallet/utils/reg';
import { parseInputChange } from '@portkey-wallet/utils/input';
import { LIMIT_PRICE_DECIMAL } from '@portkey-wallet/constants/awaken/limit';
import CommonToast from 'components/CommonToast';

interface IAmountCardProps {
  style?: ViewStyleType;
  title: string;
  isInput?: boolean;
  isError?: boolean;
  amount?: string;
  amountUsd?: ReactNode;
  amountUsdPercent?: string;
  isAmountUsdPercentPositive?: boolean;
  balance?: Bignumber;
  onAmountChange?: (value: string) => void;
  token?: TCurrency;
  onTokenChange?: (token: TCurrency) => void;
  isMaxShow?: boolean;
  inputProps?: TextInputProps;
}

const AmountCard: React.FC<IAmountCardProps> = ({
  style,
  title,
  isInput = false,
  isError = false,
  amount,
  amountUsd,
  amountUsdPercent,
  isAmountUsdPercentPositive = false,
  balance,
  onAmountChange,
  token,
  onTokenChange,
  isMaxShow = false,
  inputProps,
}) => {
  const { theme } = useTheme();
  const styles = getStyles();

  const isMainnet = useIsMainnet();

  const iptRef = useRef<TextInput>(null);

  const [isInputting, setIsInputting] = useState(false);

  const handleAmountChange = (value: string) => {
    if (value && !isValidNumberV2(value)) {
      return;
    }
    const newValue = parseInputChange(value, ZERO, token?.decimals || LIMIT_PRICE_DECIMAL);
    onAmountChange?.(newValue);
  };

  const gasFee = useAwakenGasFee();
  const handleMaxPress = useCallback(() => {
    if (balance?.isNaN() || !balance || !token) {
      onAmountChange?.('');
      return;
    }
    const { symbol, decimals } = token;
    if (symbol === 'ELF' && gasFee && balance) {
      const _valueBN = ZERO.plus(balance).minus(gasFee);
      if (_valueBN.lte(ZERO)) {
        onAmountChange?.('');
        CommonToast.fail('Insufficient balance to cover gas fee.');
        return;
      }
      onAmountChange?.(divDecimals(_valueBN, decimals).toFixed() || '');
      return;
    }
    if (ZERO.gte(balance)) {
      onAmountChange?.('');
      return;
    }
    onAmountChange?.(divDecimals(balance || ZERO, decimals).toFixed() || '');
  }, [balance, gasFee, onAmountChange, token]);

  const balanceStr = useMemo(() => {
    if (!balance || balance.isNaN() || !token) {
      return '';
    }
    const { symbol, decimals } = token;
    return `${divDecimals(balance, decimals).toFixed()} ${formatNameWithNoUnderline(symbol)}`;
  }, [balance, token]);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.amountWrap}>
        {isInput && isInputting ? (
          <Input
            {...inputProps}
            ref={iptRef}
            keyboardType="numeric"
            maxLength={18}
            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={[styles.inputStyle, isError && styles.errorInputStyle]}
            errorStyle={styles.errorStyle}
            placeholderTextColor={theme.colors.textBase3}
            placeholder="0"
            value={amount}
            onChangeText={handleAmountChange}
            onFocus={() => setIsInputting(true)}
            onBlur={() => setIsInputting(false)}
          />
        ) : (
          <Touchable
            style={styles.amountTextWrap}
            onPress={() => {
              if (isInput) {
                setIsInputting(true);
                setTimeout(() => {
                  iptRef.current?.focus();
                }, 100);
              }
            }}>
            <Text
              style={[styles.amountText, !amount && styles.amountTextPlaceholder, isError && styles.errorInputStyle]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {amount || '0'}
            </Text>
          </Touchable>
        )}
        <SelectTokenButton
          style={styles.selectTokenButton}
          modalTitle={title}
          token={token}
          onTokenChange={onTokenChange}
        />
      </View>
      <View style={styles.infoWrap}>
        <View style={styles.usdAmountWrap}>
          {isMainnet && (
            <>
              <Text style={styles.usdAmount} numberOfLines={1} ellipsizeMode="tail">
                {amountUsd}
              </Text>
              {!isInput && (
                <Text
                  style={[
                    styles.usdAmountPercent,
                    isAmountUsdPercentPositive ? styles.usdAmountPercentPositive : styles.usdAmountPercentNegative,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {' '}
                  ({amountUsdPercent})
                </Text>
              )}
            </>
          )}
        </View>
        {isInput && isMaxShow && (
          <View style={styles.balanceWrap}>
            <Text style={styles.balanceAmount}>{balanceStr}</Text>
            <CommonButton
              title="Max"
              type="outline"
              buttonStyle={styles.maxButton}
              titleStyle={styles.maxButtonTitle}
              onPress={handleMaxPress}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default AmountCard;
