import { StyleSheet } from 'react-native';
import { darkColors, defaultColors } from 'assets/theme/index';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';

const { font5 } = defaultColors;

export const commonStyles = StyleSheet.create({
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
  loadingStyle: {
    width: pTd(20),
  },
  inputContainerGrayBorderStyle: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: darkColors.borderBase1,
    borderBottomColor: defaultColors.border8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputContainerErrorBorderStyle: {
    borderColor: darkColors.textDanger2,
  },
});

export const searchStyles = StyleSheet.create({
  containerStyle: {
    height: pTd(40),
    paddingLeft: 0,
    paddingRight: 0,
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: darkColors.bgBase1,
    height: pTd(36),
    borderRadius: pTd(6),
  },
  inputStyle: {
    fontSize: pTd(14),
    // ...GStyles.marginArg(14, 16),
    // height: pTd(50),
    marginLeft: pTd(4),
    marginRight: pTd(14),
  },
  labelStyle: {},
  rightIconContainerStyle: {
    marginRight: pTd(16),
  },
  leftIconContainerStyle: {
    marginLeft: pTd(12),
  },
});

export const generalStyles = StyleSheet.create({
  containerStyle: {
    ...GStyles.paddingArg(0),
    ...GStyles.marginArg(0),
  },
  inputContainerStyle: {
    borderColor: darkColors.borderBase1,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: pTd(40),
    borderRadius: pTd(6),
  },
  inputStyle: {
    fontSize: pTd(14),
    color: darkColors.textBase1,
    ...GStyles.marginArg(18, 16),
    minHeight: pTd(60),
    height: pTd(60),
  },
  labelStyle: {
    color: darkColors.textDisabled1,
    fontSize: pTd(14),
    lineHeight: pTd(20),
    marginBottom: pTd(8),
    fontWeight: '400',
    paddingLeft: pTd(8),
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
  errorStyle: {
    marginLeft: 0,
    paddingLeft: 0,
    fontSize: pTd(16),
    lineHeight: pTd(23),
    color: darkColors.textDanger2,
  },
  disabledInputStyle: {
    color: font5,
    opacity: 1,
  },
});

export const bgWhiteStyles = StyleSheet.create({
  inputContainerStyle: {
    backgroundColor: defaultColors.bg1,
  },
});
