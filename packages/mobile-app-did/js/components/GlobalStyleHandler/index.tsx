import React, { ReactElement, useEffect } from 'react';
import { Text, TextInput, TextInputProps } from 'react-native';
import { useFonts } from 'expo-font';
import setDefaultProps from 'utils/setDefaultProps';
import { useLanguage } from 'i18n/hooks';
import { LanguageValue } from 'i18n/config';
import useEffectOnce from 'hooks/useEffectOnce';
import { changeFonts } from 'assets/theme/fonts';
import usePrevious from 'hooks/usePrevious';
import { defaultColors } from 'assets/theme';

// setDefaultProps(TextInput, { allowFontScaling: false, style: { color: defaultColors.font5 } });
// setDefaultProps(Text, { allowFontScaling: false, style: { color: defaultColors.font5 } });
interface GlobalStyleHandlerType {
  children: ReactElement;
}

const GlobalStyleHandler: React.FC<GlobalStyleHandlerType> = ({ children }) => {
  // setDefaultProps(Text, { style: { color: 'red' } });
  const { language } = useLanguage();
  const prevLanguage = usePrevious(language);
  const [fontsLoaded] = useFonts({
    'BricolageGrotesque-Bold': require('../../assets/fonts/BricolageGrotesque-Bold.ttf'),
    'BricolageGrotesque-Regular': require('../../assets/fonts/BricolageGrotesque-Regular.ttf'),
    'SchibstedGrotesk-Italic': require('../../assets/fonts/SchibstedGrotesk-Italic.ttf'),
    'SchibstedGrotesk-Regular': require('../../assets/fonts/SchibstedGrotesk-Regular.ttf'),
    'SchibstedGrotesk-SemiBold': require('../../assets/fonts/SchibstedGrotesk-SemiBold.ttf'),
  });

  useEffect(() => {
    if (prevLanguage === language) return;

    // if english , android and ios use Roboto font-family
    switch (language as LanguageValue) {
      case 'en':
        setDefaultProps(Text, { style: { fontFamily: 'SchibstedGrotesk-Regular' } });
        setDefaultProps(TextInput, { style: { fontFamily: 'SchibstedGrotesk-Regular' } });
        break;

      case 'zh':
        setDefaultProps(Text, { style: { fontFamily: 'SchibstedGrotesk-Regular' } });
        setDefaultProps(TextInput, { style: { fontFamily: 'SchibstedGrotesk-Regular' } });
        break;

      default:
        break;
    }
    changeFonts(language as LanguageValue);
    // navigationService.reset('Tab');
  }, [language, prevLanguage]);

  useEffectOnce(() => {
    const textInputProps: TextInputProps = {
      underlineColorAndroid: 'transparent',
    };
    setDefaultProps(TextInput, textInputProps);
  });

  if (!fontsLoaded) return null;

  return <>{children}</>;
};

export default GlobalStyleHandler;
