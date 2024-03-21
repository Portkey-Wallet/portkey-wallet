import { LanguageValue } from 'i18n/config';
import { TextStyle } from 'react-native';

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
  if (lan === 'zh') {
    fonts.mediumFont.fontFamily = undefined;
    fonts.regularFont.fontFamily = undefined;
  } else {
    fonts.mediumFont.fontFamily = 'Roboto-Medium';
    fonts.regularFont.fontFamily = 'Roboto-Regular';
  }
}

export default fonts;
