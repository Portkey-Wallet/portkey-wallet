import { StyleSheet } from 'react-native';
import { darkColors, defaultColors } from 'assets/theme/index';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';

export const commonStyles = StyleSheet.create({
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
  loadingStyle: {
    width: pTd(32),
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

export const getSearchStyles = makeStyles(theme => ({
  containerStyle: {
    height: pTd(40),
    paddingLeft: 0,
    paddingRight: 0,
  },
  inputContainerStyle: {
    borderColor: theme.colors.borderBase1,
    borderWidth: pTd(1),
    backgroundColor: theme.colors.bgBase1,
    height: pTd(40),
    borderRadius: pTd(20),
  },
  inputStyle: {
    fontSize: pTd(16),
    paddingLeft: pTd(16),
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
}));

export const getGeneralStyles = makeStyles(theme => ({
  containerStyle: {
    ...GStyles.paddingArg(0),
    ...GStyles.marginArg(0),
  },
  inputContainerStyle: {
    borderColor: theme.colors.borderBase1,
    borderWidth: pTd(1),
    // borderBottomWidth: StyleSheet.hairlineWidth,
    height: pTd(40),
    borderRadius: pTd(8),
  },
  inputStyle: {
    fontSize: pTd(16),
    color: theme.colors.textBase1,
    paddingHorizontal: pTd(16),
    minHeight: pTd(40),
    height: pTd(40),
  },
  labelStyle: {
    color: theme.colors.textBase1,
    fontSize: pTd(14),
    lineHeight: pTd(20),
    marginBottom: pTd(8),
    // fontWeight: '400',
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
    color: theme.colors.textDanger2,
  },
  disabledInputStyle: {
    color: theme.colors.textBase1,
    opacity: 1,
  },
}));

export const bgWhiteStyles = StyleSheet.create({
  inputContainerStyle: {
    backgroundColor: defaultColors.bg1,
  },
});
