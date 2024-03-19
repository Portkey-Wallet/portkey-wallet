import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { getStorageData } from 'utils/asyncStorage';
import { DEFAULT_LANGUAGE, getLocalLanguage, isValidLanguage } from './config';
import commonEn from '@portkey-wallet/i18n/en';
import commonZh from '@portkey-wallet/i18n/zh';
import en from './languages/en.json';
import zh from './languages/zh.json';
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      ...commonEn,
      ...en,
    },
  },
  zh: {
    translation: {
      ...commonZh,
      ...zh,
    },
  },
};

export default i18n;

RNLocalize.addEventListener('change', async () => {
  const localLanguage = getLocalLanguage();
  const customLanguageCode = await getStorageData('I18N_LANGUAGE');
  if (!customLanguageCode && isValidLanguage(localLanguage)) {
    i18n.changeLanguage(localLanguage);
  }
});

export async function initLanguage() {
  const lng = DEFAULT_LANGUAGE;
  // const customLanguageCode = await getStorageData('I18N_LANGUAGE');
  // const localLanguage = getLocalLanguage();
  // // AsyncStorage language
  // if (customLanguageCode) lng = customLanguageCode;
  // // local language
  // else if (localLanguage) lng = localLanguage;
  // // invalid language
  // if (lng && !isValidLanguage(lng as any)) lng = DEFAULT_LANGUAGE;
  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      compatibilityJSON: 'v3', // Look like an issue on android. Need fallback to v2.
      resources,
      lng, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
      // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
      // if you're using a language detector, do not define the lng option

      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });
}
