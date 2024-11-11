import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
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
import { TCurrency } from '@portkey-wallet/types/types-ca/awaken';
import { formatNameWithNoUnderline } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';

interface IAmountCardProps {
  style?: ViewStyleType;
  title?: string;
  isError?: boolean;
  amount?: string;
  amountUsd?: ReactNode;
  balance?: Bignumber;
  onAmountChange?: (value: string) => void;
  token?: TCurrency;
  onTokenChange?: (token: TCurrency) => void;
  onShowCryptoAssetList: () => void;
  isMaxShow?: boolean;
}

const AmountCard: React.FC<IAmountCardProps> = ({
  style,
  title,
  isError = false,
  amount,
  amountUsd,
  balance,
  onAmountChange,
  token,
  onTokenChange,
  onShowCryptoAssetList,
  isMaxShow = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles();
  const iptRef = useRef<TextInput>(null);
  const [isInputting, setIsInputting] = useState(false);
  // amount change callback
  const handleAmountChange = (value: string) => {
    console.log('amount change', value);
    const newValue = value.replace(/[^0-9.]/g, '');
    onAmountChange?.(newValue);
  };
  // click max btn
  const handleMaxPress = useCallback(() => {
    // if (balance?.isNaN() || !token) {
    //   onAmountChange?.('');
    //   return;
    // }
    // const { symbol, decimals } = token;
    // if (symbol === 'ELF' && gasFee && balance) {
    //   const _valueBN = ZERO.plus(balance).minus(gasFee);
    //   if (_valueBN.lte(ZERO)) {
    //     onAmountChange?.('');
    //     return;
    //   }
    //   onAmountChange?.(divDecimals(_valueBN, decimals).toFixed() || '');
    //   return;
    // }
    // onAmountChange?.(divDecimals(balance || ZERO, decimals).toFixed() || '');
  }, [balance, onAmountChange, token]);

  const balanceStr = useMemo(() => {
    if (!balance || !token) return '';
    const { symbol, decimals } = token;
    return `${divDecimals(balance, decimals).toFixed()} ${formatNameWithNoUnderline(symbol)}`;
  }, [balance, token]);

  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.amountWrap}>
        {isInputting ? (
          <Input
            ref={iptRef}
            keyboardType="number-pad"
            maxLength={18}
            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={[styles.inputStyle, isError && styles.errorInputStyle]}
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
              setIsInputting(true);
              setTimeout(() => {
                iptRef.current?.focus();
              }, 100);
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
          modalTitle={title}
          token={token}
          onShowCryptoAssetList={onShowCryptoAssetList}
          onTokenChange={onTokenChange}
        />
      </View>
      <View style={styles.infoWrap}>
        {amountUsd && (
          <View style={styles.usdAmountWrap}>
            <Text style={styles.usdAmount} numberOfLines={1} ellipsizeMode="tail">
              {amountUsd}
            </Text>
          </View>
        )}
        {isMaxShow && (
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
