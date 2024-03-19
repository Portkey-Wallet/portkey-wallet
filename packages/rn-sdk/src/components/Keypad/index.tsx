import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import GStyles from 'assets/theme/GStyles';
import { TextXXXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import CommonSvg from 'components/Svg';
import { PIN_SIZE } from '@portkey-wallet/constants/misc';

export interface KeypadPropsType {
  onChange?: (value: string) => void;
  onBiometricsPress?: () => void;
  onFinish?: (code: string) => void;
  onRest?: () => void;
  maxLength?: number;
  style?: StyleProp<ViewStyle>;
  isBiometrics?: boolean;
}

enum PadEventType {
  ADD,
  DELETE,
  RESET,
}

const Keypad = forwardRef(function Keypad(
  { onChange, onBiometricsPress, onFinish, onRest, maxLength = PIN_SIZE, style, isBiometrics = false }: KeypadPropsType,
  ref,
) {
  const valueRef = useRef('');

  const handleValueChange = useCallback(
    (_value = '', type = PadEventType.ADD) => {
      switch (type) {
        case PadEventType.DELETE:
          valueRef.current = valueRef.current.slice(0, -1);
          onChange && onChange(valueRef.current);
          break;
        case PadEventType.ADD:
          if (valueRef.current.length <= maxLength - 1) {
            valueRef.current += _value;
            onChange && onChange(valueRef.current);
          }
          if (valueRef.current.length >= maxLength) {
            onFinish && onFinish(valueRef.current);
          }
          break;
        case PadEventType.RESET:
          valueRef.current = '';
          onRest && onRest();
          break;
        default:
          break;
      }
    },
    [maxLength, onChange, onFinish, onRest],
  );

  const reset = useCallback(() => {
    handleValueChange('', PadEventType.RESET);
  }, [handleValueChange]);

  useImperativeHandle(ref, () => ({ reset }));

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.padRow, GStyles.marginTop(0)]}>
        <TouchableOpacity
          style={styles.padBtn}
          onPress={() => {
            handleValueChange('1');
          }}>
          <TextXXXL>1</TextXXXL>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.padBtn}
          onPress={() => {
            handleValueChange('2');
          }}>
          <TextXXXL>2</TextXXXL>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.padBtn, styles.noMarginRight]}
          onPress={() => {
            handleValueChange('3');
          }}>
          <TextXXXL>3</TextXXXL>
        </TouchableOpacity>
      </View>
      <View style={styles.padRow}>
        <TouchableOpacity
          style={styles.padBtn}
          onPress={() => {
            handleValueChange('4');
          }}>
          <TextXXXL>4</TextXXXL>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.padBtn}
          onPress={() => {
            handleValueChange('5');
          }}>
          <TextXXXL>5</TextXXXL>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.padBtn, styles.noMarginRight]}
          onPress={() => {
            handleValueChange('6');
          }}>
          <TextXXXL>6</TextXXXL>
        </TouchableOpacity>
      </View>
      <View style={styles.padRow}>
        <TouchableOpacity
          style={styles.padBtn}
          onPress={() => {
            handleValueChange('7');
          }}>
          <TextXXXL>7</TextXXXL>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.padBtn}
          onPress={() => {
            handleValueChange('8');
          }}>
          <TextXXXL>8</TextXXXL>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.padBtn, styles.noMarginRight]}
          onPress={() => {
            handleValueChange('9');
          }}>
          <TextXXXL>9</TextXXXL>
        </TouchableOpacity>
      </View>
      <View style={styles.padRow}>
        {isBiometrics ? (
          <TouchableOpacity style={styles.padBtn} onPress={onBiometricsPress}>
            <CommonSvg icon="touch-id" oblongSize={[pTd(24), pTd(26)]} />
          </TouchableOpacity>
        ) : (
          <View style={styles.padBtn} />
        )}
        <TouchableOpacity
          style={styles.padBtn}
          onPress={() => {
            handleValueChange('0');
          }}>
          <TextXXXL>0</TextXXXL>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.padBtn, styles.noMarginRight]}
          onPress={() => {
            handleValueChange('', PadEventType.DELETE);
          }}>
          <CommonSvg icon="block-back" size={pTd(24)} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default Keypad;

const styles = StyleSheet.create({
  container: {},
  padRow: {
    marginTop: pTd(24),
    flexDirection: 'row',
  },
  padBtn: {
    height: pTd(44),
    flex: 1,
    marginRight: pTd(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMarginRight: {
    marginRight: 0,
  },
  pinStyle: {
    marginTop: 24,
    width: pTd(230),
    alignSelf: 'center',
  },
});
