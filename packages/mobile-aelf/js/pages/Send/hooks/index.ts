import { CROSS_CHAIN_INTERCEPTED_CONTENT } from '@portkey-wallet/constants/constants-ca/send';
import ActionSheet from 'components/ActionSheet';
import { useLanguage } from 'i18n/hooks';
import { useCallback } from 'react';

export const useShowDialog = () => {
  const { t } = useLanguage();
  return useCallback(
    (type: 'crossChainInterception' | 'exchange', confirmCallBack?: () => void) => {
      console.log(type, confirmCallBack);
      ActionSheet.alert({
        title: 'Notice',
        message: t(CROSS_CHAIN_INTERCEPTED_CONTENT),
        buttons: [
          {
            title: t('OK'),
            type: 'primary',
          },
        ],
      });
    },
    [t],
  );
};
