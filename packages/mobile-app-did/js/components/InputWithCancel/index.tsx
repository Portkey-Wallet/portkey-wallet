import React from 'react';
import { StyleSheet, View } from 'react-native';
import CommonInput, { CommonInputProps } from 'components/CommonInput';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import Touchable from 'components/Touchable';

type InputWithCancelPropsType = CommonInputProps & {
  clearText: () => void;
  onCancel: () => void;
};

const InputWithCancel = React.forwardRef(function InputWithCancel(props: InputWithCancelPropsType, ref) {
  const { value, clearText, onCancel } = props;
  const { t } = useLanguage();

  return (
    <View style={[BGStyles.bg1, GStyles.flexRow, styles.inputContainer]}>
      <CommonInput
        autoFocus
        grayBorder
        theme="white-bg"
        returnKeyType="search"
        containerStyle={styles.inputStyle}
        rightIcon={
          value ? (
            <Touchable onPress={clearText}>
              <Svg icon="clear3" size={pTd(16)} />
            </Touchable>
          ) : undefined
        }
        rightIconContainerStyle={styles.rightIconContainerStyle}
        style={styles.rnInputStyle}
        {...props}
        ref={ref}
      />
      <Touchable onPress={onCancel}>
        <TextM style={[FontStyles.primaryColor, styles.cancelButton]}>{t('Cancel')}</TextM>
      </Touchable>
    </View>
  );
});

export default InputWithCancel;

const styles = StyleSheet.create({
  inputContainer: {
    ...GStyles.paddingArg(0, 20, 8),
  },
  inputStyle: {
    width: pTd(280),
  },
  rnInputStyle: {
    fontSize: pTd(14),
  },
  cancelButton: {
    paddingLeft: pTd(12),
    lineHeight: pTd(36),
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
});
