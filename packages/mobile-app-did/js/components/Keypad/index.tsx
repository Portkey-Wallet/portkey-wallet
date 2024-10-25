import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import GStyles from 'assets/theme/GStyles';
import { TextH1 } from 'components/CommonText';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { PIN_SIZE } from '@portkey-wallet/constants/misc';
import { defaultColors } from 'assets/theme';

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
          <TextH1>1</TextH1>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.padBtn}
          onPress={() => {
            handleValueChange('2');
          }}>
          <TextH1>2</TextH1>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.padBtn, styles.noMarginRight]}
          onPress={() => {
            handleValueChange('3');
          }}>
          <TextH1>3</TextH1>
        </TouchableOpacity>
      </View>
      <View style={styles.padRow}>
        <TouchableOpacity
          style={styles.padBtn}
          onPress={() => {
            handleValueChange('4');
          }}>
          <TextH1>4</TextH1>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.padBtn}
          onPress={() => {
            handleValueChange('5');
          }}>
          <TextH1>5</TextH1>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.padBtn, styles.noMarginRight]}
          onPress={() => {
            handleValueChange('6');
          }}>
          <TextH1>6</TextH1>
        </TouchableOpacity>
      </View>
      <View style={styles.padRow}>
        <TouchableOpacity
          style={styles.padBtn}
          onPress={() => {
            handleValueChange('7');
          }}>
          <TextH1>7</TextH1>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.padBtn}
          onPress={() => {
            handleValueChange('8');
          }}>
          <TextH1>8</TextH1>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.padBtn, styles.noMarginRight]}
          onPress={() => {
            handleValueChange('9');
          }}>
          <TextH1>9</TextH1>
        </TouchableOpacity>
      </View>
      <View style={styles.padRow}>
        {isBiometrics ? (
          <TouchableOpacity style={styles.padBtn} onPress={onBiometricsPress}>
            <Svg icon="touch-id" oblongSize={[pTd(24), pTd(26)]} color={defaultColors.primaryColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.padBtn} />
        )}
        <TouchableOpacity
          style={styles.padBtn}
          onPress={() => {
            handleValueChange('0');
          }}>
          <TextH1>0</TextH1>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.padBtn, styles.noMarginRight]}
          onPress={() => {
            handleValueChange('', PadEventType.DELETE);
          }}>
          <Svg icon="block-back" size={pTd(24)} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default Keypad;

const styles = StyleSheet.create({
  container: {},
  padRow: {
    marginTop: pTd(20),
    flexDirection: 'row',
  },
  padBtn: {
    height: pTd(80),
    flex: 1,
    marginRight: pTd(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMarginRight: {
    marginRight: 0,
  },
});
