import * as RNLocalize from 'react-native-localize';

export const LOCAL_LANGUAGE = [
  { language: 'en', title: 'English' },
  { language: 'zh', title: '繁体中文' },
] as const;

export type LanguageValue = (typeof LOCAL_LANGUAGE)[number]['language'];

export const LOCAL_LANGUAGE_LIST = LOCAL_LANGUAGE.map(i => i.language);
export const DEFAULT_LANGUAGE = LOCAL_LANGUAGE_LIST[0];

export const getLocalLanguage = (): LanguageValue => {
  const localLanguage = RNLocalize.getLocales()[0].languageCode;
  if (typeof localLanguage === 'string' && localLanguage.toLowerCase().includes('zh')) return 'zh';
  return 'en';
};

export const isValidLanguage = (language: LanguageValue) => {
  return LOCAL_LANGUAGE_LIST.includes(language);
};
