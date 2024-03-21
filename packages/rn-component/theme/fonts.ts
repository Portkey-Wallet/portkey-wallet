import { LanguageValue } from 'i18n/config';
import { TextStyle } from 'react-native';
import { ThemeStyleSheet } from '.';

const fonts: {
  mediumFont: TextStyle;
  regularFont: TextStyle;
} = {
  mediumFont: {
    fontFamily: 'Roboto-Medium',
    fontWeight: 'bold',
  },
  regularFont: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
  },
};

export function changeFonts(lan: LanguageValue) {
  const theme = ThemeStyleSheet.create();
  if (lan === 'zh') {
    theme.mediumFont.fontFamily = undefined;
    theme.regularFont.fontFamily = undefined;
  } else {
    theme.mediumFont.fontFamily = 'Roboto-Medium';
    theme.regularFont.fontFamily = 'Roboto-Regular';
  }
}

export default fonts;
