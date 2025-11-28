import React, { forwardRef, useState } from 'react';
import { TextStyle, View } from 'react-native';
import { TextH1 } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { headerHeight } from 'components/CustomHeader/style/index.style';
import Keypad, { KeypadPropsType } from 'components/Keypad';
import DigitText, { DigitTextProps } from 'components/DigitText';
import { makeStyles } from '@rneui/themed';

type PinContainerProps = {
  title: string;
  showHeader?: boolean;
  onChangeText?: (text: string) => void;
  isKeypadShow?: boolean;
  titleStyle?: TextStyle;
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
    isKeypadShow = true,
    titleStyle,
    ...textProps
  }: PinContainerProps,
  forwardedRef,
) {
  const styles = getStyles();
  const [value, setValue] = useState('');

  return (
    // showHeader && { paddingTop: styles.container.paddingTop - headerHeight }
    <View style={[styles.container, showHeader && { paddingTop: styles.container.paddingTop - headerHeight }]}>
      <View>
        <TextH1 style={titleStyle}>{title}</TextH1>
        <DigitText
          type="pin"
          secureTextEntry
          style={[styles.pinStyle, style]}
          maxLength={maxLength}
          text={value}
          {...textProps}
        />
      </View>

      {isKeypadShow && (
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
      )}
    </View>
  );
});

export default PinContainer;

const getStyles = makeStyles(theme => ({
  container: {
    height: '100%',
    paddingTop: pTd(68),
    justifyContent: 'space-between',
    paddingBottom: pTd(20),
    backgroundColor: theme.colors.bgBase1,
  },
  pinStyle: {
    marginTop: pTd(64),
    width: pTd(204),
    alignSelf: 'center',
  },
}));
