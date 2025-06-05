import i18n from 'i18next';
import { useCallback, useMemo } from 'react';
import { initReactI18next, useTranslation } from 'react-i18next';
import commonEn from '@portkey-wallet/i18n/en';
import en from './languages/en.json';
import { LANGUAGE, LOCAL_LANGUAGE_LIST, DEFAULT_LANGUAGE } from './config';
import moment from 'moment';

const resources = {
  en: {
    translation: {
      ...commonEn,
      ...en,
    },
  },
};

function initLanguage() {
  let lng = DEFAULT_LANGUAGE;

  //Get whether the language has been set locally
  const v = localStorage.getItem(LANGUAGE);
  if (v && LOCAL_LANGUAGE_LIST.includes(v)) {
    lng = v;
  }
  // TODO: apis language
  // //Get apis language

  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,
      lng,

      keySeparator: false, // we do not use keys in form messages.welcome

      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });
  moment.locale(lng.replace('_', '-'));
}
initLanguage();
export function useLanguage(): {
  language: string;
  changeLanguage: (v: string) => void;
} {
  const { i18n } = useTranslation();
  const changeLanguage = useCallback(
    (value: any) => {
      if (i18n.language !== value && LOCAL_LANGUAGE_LIST.includes(value)) {
        moment.locale(value);
        i18n.changeLanguage(value);
        localStorage.setItem(LANGUAGE, value);
      }
    },
    [i18n],
  );
  return useMemo(() => ({ language: i18n.language, changeLanguage }), [changeLanguage, i18n.language]);
}
export default i18n;
