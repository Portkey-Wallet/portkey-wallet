import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './languages/en.json';
import { LANGUAGE, LOCAL_LANGUAGE_LIST, DEFAULT_LANGUAGE } from './config';
import moment from 'moment';
const resources = { en };

export function initLanguage(localStorage?: Storage) {
  const languageCurrent = ensureLanguage() || DEFAULT_LANGUAGE;

  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,
      lng: languageCurrent,

      keySeparator: false, // we do not use keys in form messages.welcome

      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });
  moment.locale(languageCurrent.replace('_', '-'));
}
export default i18n;

// Sub-path rule > localStorage rule
function ensureLanguage() {
  let language;
  const languageStorage = localStorage?.getItem(LANGUAGE);
  if (languageStorage && LOCAL_LANGUAGE_LIST.includes(languageStorage)) {
    language = languageStorage;
  }
  return language;
}
