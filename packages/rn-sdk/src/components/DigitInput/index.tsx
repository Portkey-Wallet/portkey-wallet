import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import { InputProps } from '@rneui/base';
import React, { useRef, useState, useCallback, memo, useMemo, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, TextInput, TouchableHighlight } from 'react-native';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { isValidPositiveInteger } from '@portkey-wallet/utils/reg';
import DigitText, { DigitTextProps } from 'components/DigitText';

export type DigitInputProps = {
  onFinish?: (code: string) => void;
} & InputProps &
  DigitTextProps;

export type DigitInputInterface = {
  reset: () => void;
};

const DigitInput = forwardRef(function DigitInput(
  {
    maxLength = PIN_SIZE,
    onChangeText,
    keyboardType = 'numeric',
    type = 'default',
    onFinish,
    ...textProps
  }: DigitInputProps,
  forwardedRef,
) {
  const input = useRef<any>();
  const [text, setText] = useState('');
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

  const reset = useCallback(() => setText(''), []);
  useImperativeHandle(forwardedRef, () => ({ reset }), [reset]);

  return (
    <TouchableHighlight onPress={() => input.current?.focus()} activeOpacity={1} underlayColor="transparent">
      <View>
        <DigitText maxLength={maxLength} type={type} text={text} {...textProps} />
        <TextInput
          contextMenuHidden={type === 'pin'}
          style={[styles.inputStyle, styleProps.inputStyle]}
          ref={input}
          value={text}
          maxLength={maxLength}
          autoFocus={true}
          keyboardType={keyboardType}
          onChangeText={_value => {
            if (_value && !isValidPositiveInteger(_value)) return;
            setText(_value);
            onChangeText?.(_value);
            if (_value.length === maxLength) onFinish?.(_value);
          }}
        />
      </View>
    </TouchableHighlight>
  );
});
export default memo(DigitInput);
const styles = StyleSheet.create({
  inputStyle: {
    height: 45,
    zIndex: 99,
    position: 'absolute',
    opacity: 0,
  },
});
