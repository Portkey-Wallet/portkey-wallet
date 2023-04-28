import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import { Text } from '@rneui/base';
import { defaultColors } from 'assets/theme';
import { TextS } from 'components/CommonText';
import React, { useCallback, memo, useMemo } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';

export type DigitTextProps = {
  maxLength?: number;
  inputItemStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  type?: 'pin' | 'default';
  onFinish?: (code: string) => void;
  text?: string;
  secureTextEntry?: boolean;
  errorMessage?: string;
};

export type DigitInputInterface = {
  reset: () => void;
};

function InputItem({
  secureTextEntry,
  text,
  iconStyle,
}: {
  secureTextEntry?: boolean;
  text?: string;
  iconStyle?: StyleProp<ViewStyle>;
}) {
  if (secureTextEntry) return <View style={[styles.iconStyle, iconStyle]} />;
  return <Text style={styles.textStyles}>{text}</Text>;
}

const DigitText = ({
  secureTextEntry,
  maxLength = PIN_SIZE,
  inputItemStyle,
  iconStyle,
  style,
  errorMessage,
  type = 'default',
  text: textLabel = '',
}: DigitTextProps) => {
  const styleProps = useMemo(() => {
    return {
      inputItem: {
        width: screenWidth / (maxLength + 4),
        height: screenWidth / (maxLength + 2),
      },
      inputStyle: {
        width: (screenWidth / (maxLength + 2)) * maxLength,
      },
    };
  }, [maxLength]);
  const getInputItem = useCallback(() => {
    const inputItem = [];
    for (let i = 0; i < maxLength; i++) {
      if (type === 'pin') {
        inputItem.push(<View key={i} style={i < textLabel.length ? styles.pinSecureText : styles.pinPlaceholder} />);
      } else {
        inputItem.push(
          <View key={i} style={[styles.inputItem, styleProps.inputItem, inputItemStyle]}>
            {i < textLabel.length ? (
              <InputItem secureTextEntry={secureTextEntry} iconStyle={iconStyle} text={textLabel[i]} />
            ) : null}
          </View>,
        );
      }
    }
    return inputItem;
  }, [iconStyle, inputItemStyle, maxLength, secureTextEntry, styleProps.inputItem, textLabel, type]);

  return (
    <View>
      <View style={[styles.container, type === 'pin' ? styles.pinContainer : undefined, style]}>{getInputItem()}</View>
      {errorMessage ? <TextS style={styles.errorText}>{errorMessage}</TextS> : null}
    </View>
  );
};

export default memo(DigitText);
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  pinContainer: {
    height: 16,
  },
  inputItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: defaultColors.border6,
  },
  iconStyle: {
    width: 16,
    height: 16,
    backgroundColor: defaultColors.font5,
    borderRadius: 8,
  },
  errorText: {
    marginTop: 40,
    textAlign: 'center',
    color: defaultColors.error,
  },
  textStyles: {
    fontSize: 36,
    color: defaultColors.font5,
    fontWeight: 'bold',
  },
  pinPlaceholder: {
    height: 4,
    width: 16,
    backgroundColor: defaultColors.font5,
  },
  pinSecureText: {
    backgroundColor: defaultColors.font5,
    height: 16,
    width: 16,
    borderRadius: 8,
  },
});
