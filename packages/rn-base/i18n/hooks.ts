import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isValidLanguage, LanguageValue } from './config';
import { storeStorageData } from '../utils/asyncStorage';
export function useLanguage() {
  const { i18n, t } = useTranslation();
  const changeLanguage = useCallback(
    (value: string) => {
      if (i18n.language !== value && isValidLanguage(value as LanguageValue)) {
        i18n.changeLanguage(value);
        storeStorageData('I18N_LANGUAGE', value);
      }
    },
    [i18n],
  );
  return useMemo(() => ({ language: i18n.language, changeLanguage, t }), [changeLanguage, i18n.language, t]);
}
