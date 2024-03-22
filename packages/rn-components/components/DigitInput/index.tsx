import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import { InputProps } from '@rneui/base';
import React, { useRef, useState, useCallback, memo, useMemo, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, TextInput, TouchableHighlight } from 'react-native';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { isValidPositiveInteger } from '@portkey-wallet/utils/reg';
import DigitText, { DigitTextProps } from '../DigitText';

export type DigitInputProps = {
  onFinish?: (code: string) => void;
  isInputLocked?: boolean;
} & InputProps &
  DigitTextProps;

export type DigitInputInterface = {
  reset: () => void;
  lockInput: () => void;
  unLockInput: () => void;
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
  const isLockedRef = useRef(false);
  const input = useRef<any>();
  const [text, setText] = useState('');
  const styleProps = useMemo(() => {
    return {
      inputStyle: {
        height: screenWidth / (maxLength + 2),
      },
    };
  }, [maxLength]);

  const reset = useCallback(() => {
    setText('');
    const isFocused = input.current?.isFocused();
    !isFocused && input.current?.focus();
  }, []);

  const lockInput = useCallback(() => {
    isLockedRef.current = true;
  }, []);

  const unLockInput = useCallback(() => {
    isLockedRef.current = false;
  }, []);

  useImperativeHandle(forwardedRef, () => ({ reset, lockInput, unLockInput }), [reset, lockInput, unLockInput]);

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
            if (isLockedRef.current) return;
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
    zIndex: 99,
    position: 'absolute',
    width: '100%',
    opacity: 0,
  },
});
