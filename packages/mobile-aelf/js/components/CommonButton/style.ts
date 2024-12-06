import { StyleSheet } from 'react-native';
import { darkColors, defaultColors } from 'assets/theme/index';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';

const { font2, bg5, bg6 } = defaultColors;

export const styles = StyleSheet.create({
  buttonStyle: {
    height: pTd(48),
    backgroundColor: bg6,
  },
  titleStyle: {
    color: darkColors.textBase1,
    fontSize: pTd(16),
    ...fonts.mediumFont,
  },
  solidButtonStyle: {
    backgroundColor: bg5,
    borderColor: bg5,
  },
  solidTitleStyle: {
    color: font2,
  },
  outlineTitleStyle: {
    color: font2,
  },
  outlineButtonStyle: {
    backgroundColor: 'transparent',
    borderWidth: pTd(1.5),
    borderColor: darkColors.borderNeutral2,
  },
  primaryButtonStyle: {
    backgroundColor: darkColors.bgBrand1,
  },
  primaryTitleStyle: {
    color: darkColors.textBrand4,
  },
  disabledStyle: {
    opacity: 0.4,
    color: darkColors.textDisabled2,
  },
  disabledPrimaryStyle: {
    opacity: 1,
    backgroundColor: darkColors.bgBase2,
    color: darkColors.textDisabled2,
  },
  disabledTitleStyle: {
    color: darkColors.textDisabled2,
  },
  clearButtonStyle: {
    borderWidth: 0,
  },
  transparentButtonStyle: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  outlineDisabledTitleStyle: {
    color: defaultColors.font3,
  },
  loadingIcon: {
    width: pTd(16),
  },
  waringButtonStyle: {
    backgroundColor: darkColors.bgDanger1,
    borderWidth: 0,
  },
  warningTitleStyle: {
    color: darkColors.textBase1,
  },
  waringDisabledStyle: {
    backgroundColor: darkColors.bgBase2,
  },
  waringDisabledTitleStyle: {
    color: darkColors.textDisabled2,
  },
  waringNoBorderButtonStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  warningNoBorderTitleStyle: {
    color: darkColors.textDanger1,
  },
  waringNoBorderDisabledStyle: {
    backgroundColor: darkColors.bgBase2,
  },
  waringNoBorderDisabledTitleStyle: {
    color: darkColors.textDisabled1,
  },
});
