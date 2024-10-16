import { StyleSheet } from 'react-native';
import { darkColors, defaultColors } from 'assets/theme/index';
import { pTd } from 'utils/unit';

const { font4, font2, primaryColor, bg5, bg6, bg14 } = defaultColors;

export const styles = StyleSheet.create({
  buttonStyle: {
    height: pTd(48),
    backgroundColor: bg6,
  },
  titleStyle: {
    color: darkColors.textBase1,
    fontSize: pTd(16),
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
});
