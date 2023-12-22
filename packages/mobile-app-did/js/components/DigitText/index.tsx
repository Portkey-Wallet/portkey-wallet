import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import { Text } from '@rneui/base';
import { defaultColors } from 'assets/theme';
import { TextM } from 'components/CommonText';
import React, { useCallback, memo, useMemo } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';

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
  isError?: boolean;
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
  isError: isErrorProp = false,
}: DigitTextProps) => {
  const styleProps = useMemo(() => {
    return {
      inputItem: {
        width: screenWidth / (maxLength + 2.5435),
        height: screenWidth / (maxLength + 2),
      },
    };
  }, [maxLength]);

  const isError = useMemo(() => !!errorMessage || isErrorProp, [errorMessage, isErrorProp]);

  const getInputItem = useCallback(() => {
    const inputItem = [];
    for (let i = 0; i < maxLength; i++) {
      if (type === 'pin') {
        inputItem.push(
          <View
            key={i}
            style={[
              i < textLabel.length ? styles.pinSecureText : styles.pinPlaceholder,
              isError && styles.pinPlaceholderError,
            ]}
          />,
        );
      } else {
        inputItem.push(
          <View
            key={i}
            style={[styles.inputItem, isError && styles.inputItemError, styleProps.inputItem, inputItemStyle]}>
            {i < textLabel.length ? (
              <InputItem secureTextEntry={secureTextEntry} iconStyle={iconStyle} text={textLabel[i]} />
            ) : null}
          </View>,
        );
      }
    }
    return inputItem;
  }, [iconStyle, inputItemStyle, isError, maxLength, secureTextEntry, styleProps.inputItem, textLabel, type]);

  return (
    <View>
      <View style={[styles.container, type === 'pin' ? styles.pinContainer : undefined, style]}>{getInputItem()}</View>
      {errorMessage ? <TextM style={styles.errorText}>{errorMessage}</TextM> : null}
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
    height: pTd(16),
  },
  inputItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: pTd(6),
    borderColor: defaultColors.border6,
  },
  inputItemError: {
    borderColor: defaultColors.error,
  },
  iconStyle: {
    width: pTd(16),
    height: pTd(16),
    backgroundColor: defaultColors.font5,
    borderRadius: pTd(9),
  },
  errorText: {
    marginTop: pTd(24),
    textAlign: 'center',
    color: defaultColors.error,
  },
  textStyles: {
    fontSize: pTd(24),
    color: defaultColors.font5,
    fontWeight: 'bold',
  },
  pinPlaceholder: {
    height: pTd(4),
    width: pTd(16),
    backgroundColor: defaultColors.font5,
  },
  pinPlaceholderError: {
    backgroundColor: defaultColors.error,
  },
  pinSecureText: {
    backgroundColor: defaultColors.font5,
    height: pTd(16),
    width: pTd(16),
    borderRadius: pTd(9),
  },
});
