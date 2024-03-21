import React, { forwardRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { windowHeight } from '@portkey-wallet/utils/mobile/device';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';

import { pTd } from 'utils/unit';
import { headerHeight } from 'components/CustomHeader/style/index.style';
import Keypad, { KeypadPropsType } from 'components/Keypad';
import DigitText, { DigitTextProps } from 'components/DigitText';

type PinContainerProps = {
  title: string;
  showHeader?: boolean;
  onChangeText?: (text: string) => void;
} & DigitTextProps &
  KeypadPropsType;

const PinContainer = forwardRef(function PinContainer(
  {
    title,
    style,
    showHeader,
    onChangeText,
    onFinish,
    maxLength,
    isBiometrics,
    onBiometricsPress,
    ...textProps
  }: PinContainerProps,
  forwardedRef,
) {
  const [value, setValue] = useState('');

  return (
    <View style={[styles.container, showHeader && { paddingTop: styles.container.paddingTop - headerHeight }]}>
      <View>
        <TextL style={GStyles.textAlignCenter}>{title}</TextL>
        <DigitText
          type="pin"
          secureTextEntry
          style={[styles.pinStyle, style]}
          maxLength={maxLength}
          text={value}
          {...textProps}
        />
      </View>

      <Keypad
        ref={forwardedRef}
        maxLength={maxLength}
        onChange={_value => {
          setValue(_value);
          onChangeText && onChangeText(_value);
        }}
        onFinish={onFinish}
        onRest={() => {
          setValue('');
        }}
        onBiometricsPress={onBiometricsPress}
        isBiometrics={isBiometrics}
      />
    </View>
  );
});

export default PinContainer;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingTop: windowHeight * 0.25,
    justifyContent: 'space-between',
    paddingBottom: pTd(40),
  },
  pinStyle: {
    marginTop: 24,
    width: pTd(216),
    alignSelf: 'center',
  },
});
