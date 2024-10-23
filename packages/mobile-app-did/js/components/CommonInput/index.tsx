import React, { forwardRef, useMemo } from 'react';
import { Input, InputProps } from '@rneui/themed';
import Svg, { IconName } from 'components/Svg';
import { commonStyles, generalStyles, searchStyles } from './style';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { defaultColors } from 'assets/theme';
import Touchable from 'components/Touchable';
import Lottie from 'lottie-react-native';

export type CommonInputProps = InputProps & {
  type?: 'search' | 'general';
  theme?: 'white-bg' | 'gray-bg' | 'black-bg';
  allowClear?: boolean;
  clearIcon?: IconName;
  loading?: boolean;
  grayBorder?: boolean;
};

const CommonInput = forwardRef(function CommonInput(props: CommonInputProps, forwardedRef: any) {
  const { t } = useLanguage();
  const {
    loading,
    grayBorder,
    allowClear,
    clearIcon = 'clear3',
    placeholder,
    type = 'search',
    theme = 'black-bg',
    inputStyle,
    containerStyle,
    inputContainerStyle,
    labelStyle,
    rightIconContainerStyle,
    leftIconContainerStyle,
    errorStyle,
    errorMessage,
    ...inputProps
  } = props;

  const rightIconDom = useMemo(() => {
    if (loading) {
      return (
        <Lottie style={commonStyles.loadingStyle} source={require('assets/lottieFiles/loading.json')} autoPlay loop />
      );
    } else {
      return props.value && allowClear ? (
        <Touchable onPress={() => props.onChangeText?.('')}>
          <Svg icon={clearIcon} size={pTd(16)} />
        </Touchable>
      ) : undefined;
    }
  }, [allowClear, clearIcon, loading, props]);

  if (type === 'search')
    return (
      <Input
        selectionColor={defaultColors.bg13}
        containerStyle={[searchStyles.containerStyle, containerStyle]}
        inputContainerStyle={[
          searchStyles.inputContainerStyle,
          grayBorder && commonStyles.inputContainerGrayBorderStyle,
          inputContainerStyle,
          !!errorMessage && commonStyles.inputContainerErrorBorderStyle,
        ]}
        inputStyle={[searchStyles.inputStyle, inputStyle]}
        labelStyle={[searchStyles.labelStyle, labelStyle]}
        rightIconContainerStyle={[commonStyles.rightIconContainerStyle, rightIconContainerStyle]}
        leftIconContainerStyle={[searchStyles.leftIconContainerStyle, leftIconContainerStyle]}
        placeholder={placeholder || t('Please enter')}
        placeholderTextColor={defaultColors.font7}
        leftIcon={<Svg icon="search" size={pTd(16)} />}
        rightIcon={rightIconDom}
        errorMessage={errorMessage}
        {...inputProps}
        ref={forwardedRef}
      />
    );

  return (
    <Input
      containerStyle={[generalStyles.containerStyle, containerStyle]}
      inputContainerStyle={[
        generalStyles.inputContainerStyle,
        grayBorder && commonStyles.inputContainerGrayBorderStyle,
        inputContainerStyle,
        !!errorMessage && commonStyles.inputContainerErrorBorderStyle,
      ]}
      selectionColor={defaultColors.bg13}
      inputStyle={[generalStyles.inputStyle, inputStyle]}
      labelStyle={[generalStyles.labelStyle, labelStyle]}
      rightIconContainerStyle={[generalStyles.rightIconContainerStyle, rightIconContainerStyle]}
      leftIconContainerStyle={leftIconContainerStyle}
      errorStyle={[generalStyles.errorStyle, errorStyle]}
      placeholder={placeholder || t('Please enter')}
      placeholderTextColor={defaultColors.font7}
      disabledInputStyle={[generalStyles.disabledInputStyle]}
      rightIcon={rightIconDom}
      errorMessage={errorMessage}
      {...inputProps}
      ref={forwardedRef}
    />
  );
});
export default CommonInput;
