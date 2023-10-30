import React, { forwardRef, useMemo } from 'react';
import { Input, InputProps } from '@rneui/themed';
import Svg from 'components/Svg';
import { commonStyles, generalStyles, searchStyles, bgWhiteStyles } from './style';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { defaultColors } from 'assets/theme';
import Touchable from 'components/Touchable';
import Lottie from 'lottie-react-native';

export type CommonInputProps = InputProps & {
  type?: 'search' | 'general';
  theme?: 'white-bg' | 'gray-bg';
  allowClear?: boolean;
  loading?: boolean;
};

const CommonInput = forwardRef(function CommonInput(props: CommonInputProps, forwardedRef: any) {
  const { t } = useLanguage();
  const {
    loading,
    allowClear,
    placeholder,
    type = 'search',
    theme = 'gray-bg',
    inputStyle,
    containerStyle,
    inputContainerStyle,
    labelStyle,
    rightIconContainerStyle,
    leftIconContainerStyle,
    errorStyle,
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
          <Svg icon="clear3" size={pTd(16)} />
        </Touchable>
      ) : undefined;
    }
  }, [allowClear, loading, props]);

  if (type === 'search')
    return (
      <Input
        selectionColor={defaultColors.bg13}
        containerStyle={[searchStyles.containerStyle, containerStyle]}
        inputContainerStyle={[searchStyles.inputContainerStyle, inputContainerStyle]}
        inputStyle={[searchStyles.inputStyle, inputStyle]}
        labelStyle={[searchStyles.labelStyle, labelStyle]}
        rightIconContainerStyle={[commonStyles.rightIconContainerStyle, rightIconContainerStyle]}
        leftIconContainerStyle={[searchStyles.leftIconContainerStyle, leftIconContainerStyle]}
        placeholder={placeholder || t('Please enter')}
        placeholderTextColor={defaultColors.font7}
        leftIcon={<Svg icon="search" size={pTd(16)} />}
        rightIcon={rightIconDom}
        {...inputProps}
        ref={forwardedRef}
      />
    );

  return (
    <Input
      containerStyle={[generalStyles.containerStyle, containerStyle]}
      inputContainerStyle={[
        generalStyles.inputContainerStyle,
        theme === 'white-bg' && bgWhiteStyles.inputContainerStyle,
        inputContainerStyle,
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
      {...inputProps}
      ref={forwardedRef}
    />
  );
});
export default CommonInput;
