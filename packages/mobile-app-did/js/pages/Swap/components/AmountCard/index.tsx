import React, { ReactNode, useRef, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Input, useTheme } from '@rneui/themed';
import CommonButton from 'components/CommonButton';
import Touchable from 'components/Touchable';
import SelectTokenButton from '../SelectTokenButton';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { ViewStyleType } from 'types/styles';
import { getStyles } from './style';

interface IAmountCardProps {
  style?: ViewStyleType;
  title: string;
  isInput?: boolean;
  isError?: boolean;
  amount?: string;
  amountUsd?: ReactNode;
  amountUsdPercent?: string;
  isAmountUsdPercentPositive?: boolean;
  balance?: string;
  onAmountChange?: (value: string) => void;
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
}) => {
  const { theme } = useTheme();
  const styles = getStyles();

  const isMainnet = useIsMainnet();

  const iptRef = useRef<TextInput>(null);

  const [isInputting, setIsInputting] = useState(false);

  const handleAmountChange = (value: string) => {
    onAmountChange?.(value);
  };

  const handleMaxPress = () => {
    onAmountChange?.(balance || '');
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.amountWrap}>
        {isInput && isInputting ? (
          <Input
            ref={iptRef}
            keyboardType="numeric"
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
              if (isInput) {
                setIsInputting(true);
                setTimeout(() => {
                  iptRef.current?.focus();
                }, 100);
              }
            }}>
            <Text
              style={[styles.amountText, !amount && styles.amountTextPlaceholder]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {amount || '0'}
            </Text>
          </Touchable>
        )}
        <SelectTokenButton modalTitle={title} />
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
        {isInput && (
          <View style={styles.balanceWrap}>
            <Text style={styles.balanceAmount}>{balance}</Text>
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
