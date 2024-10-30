import { LanguageValue } from 'i18n/config';
import { TextStyle } from 'react-native';

const fonts: {
  BGRegularFont: TextStyle;
  BGMediumFont: TextStyle;
  SGRegularFont: TextStyle;
  SGMediumFont: TextStyle;
  SGItalicFont: TextStyle;
  // TODO: delete
  mediumFont?: TextStyle;
  regularFont?: TextStyle;
} = {
  BGRegularFont: {
    fontFamily: 'BricolageGrotesque-Regular',
    fontWeight: '400',
  },
  BGMediumFont: {
    fontFamily: 'BricolageGrotesque-Bold',
    fontWeight: 'bold',
  },
  SGMediumFont: {
    fontFamily: 'SchibstedGrotesk-SemiBold',
    fontWeight: 'bold',
  },
  SGRegularFont: {
    fontFamily: 'SchibstedGrotesk-Regular',
    fontWeight: '400',
  },
  SGItalicFont: {
    fontFamily: 'SchibstedGrotesk-Italic',
  },
  mediumFont: {
    fontFamily: 'SchibstedGrotesk-SemiBold',
    fontWeight: 'bold',
  },
  regularFont: {
    fontFamily: 'SchibstedGrotesk-Regular',
  },
};

export function changeFonts(lan: LanguageValue) {
  return lan;
  // if (lan === 'zh') {
  //   fonts.mediumFont.fontFamily = undefined;
  //   fonts.regularFont.fontFamily = undefined;
  // } else {
  //   fonts.mediumFont.fontFamily = 'Roboto-Medium';
  //   fonts.regularFont.fontFamily = 'Roboto-Regular';
  // }
}

export default fonts;
