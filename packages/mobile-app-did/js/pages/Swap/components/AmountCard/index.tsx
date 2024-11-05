import React, { useRef } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Input, useTheme } from '@rneui/themed';
import CommonButton from 'components/CommonButton';
import SelectTokenButton from '../SelectTokenButton';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useInputFocus } from 'hooks/useInputFocus';
import { getStyles } from './style';

interface IAmountCardProps {
  title: string;
  isInput?: boolean;
  showBalance?: boolean;
  amount?: string;
  amountUsd?: string;
  balance?: string;
  onAmountChange?: (value: string) => void;
}

const AmountCard: React.FC<IAmountCardProps> = ({
  title,
  isInput = false,
  amount,
  amountUsd,
  balance,
  onAmountChange,
}) => {
  const { theme } = useTheme();
  const styles = getStyles();

  const isMainnet = useIsMainnet();

  const iptRef = useRef<TextInput>(null);
  useInputFocus(iptRef);

  const handleAmountChange = (value: string) => {
    onAmountChange?.(value);
  };

  const handleMaxPress = () => {
    onAmountChange?.(balance || '');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.amountWrap}>
        {isInput ? (
          <Input
            ref={iptRef}
            keyboardType="numeric"
            maxLength={18}
            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            placeholderTextColor={theme.colors.textBase3}
            placeholder="0"
            value={amount}
            onChangeText={handleAmountChange}
          />
        ) : (
          <Text style={styles.amountText} numberOfLines={1} ellipsizeMode="tail">
            {amount}
          </Text>
        )}
        <SelectTokenButton modalTitle={title} />
      </View>
      <View style={styles.infoWrap}>
        <Text style={styles.usdAmount} numberOfLines={1} ellipsizeMode="tail">
          {isMainnet && amountUsd}
        </Text>
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
