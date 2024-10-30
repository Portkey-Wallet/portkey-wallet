import { StyleSheet } from 'react-native';
import { darkColors, defaultColors } from 'assets/theme/index';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';

const { border1, font5, font2 } = defaultColors;

export const commonStyles = StyleSheet.create({
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
  loadingStyle: {
    width: pTd(20),
  },
  inputContainerGrayBorderStyle: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border8,
    borderBottomColor: defaultColors.border8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export const searchStyles = StyleSheet.create({
  containerStyle: {
    height: pTd(40),
    paddingLeft: 0,
    paddingRight: 0,
  },
  inputContainerStyle: {
    backgroundColor: darkColors.bgBase1,
    height: pTd(36),
    borderRadius: pTd(20),
    borderColor: darkColors.borderBase1,
    borderWidth: pTd(1),
  },
  inputStyle: {
    fontSize: pTd(14),
    // ...GStyles.marginArg(14, 16),
    // height: pTd(50),
    color: defaultColors.font2,
    marginLeft: pTd(16),
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
    borderColor: border1,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: pTd(56),
    borderRadius: pTd(6),
  },
  inputStyle: {
    fontSize: pTd(14),
    color: font2,
    ...GStyles.marginArg(18, 16),
    minHeight: pTd(60),
    height: pTd(60),
  },
  labelStyle: {
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
    paddingLeft: pTd(8),
    fontSize: pTd(12),
    lineHeight: pTd(16),
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
