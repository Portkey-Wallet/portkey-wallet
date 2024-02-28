import { useCallback } from 'react';
import { useCheckManagerExceed } from '@portkey-wallet/hooks/hooks-ca/wallet';
import navigationService from 'utils/navigationService';
import OverlayModal from 'components/OverlayModal';
import ActionSheet from 'components/ActionSheet';
import { useLanguage } from 'i18n/hooks';

export function useManagerExceedTipModal() {
  const { t } = useLanguage();
  const checkManagerExceedStatus = useCheckManagerExceed();

  const showManagerExceedTip = useCallback(async () => {
    try {
      const status = await checkManagerExceedStatus();
      return status;
    } catch (error) {
      console.log('===checkManagerExceedStatus error', error);
      return false;
    }
  }, [checkManagerExceedStatus]);

  const toDelete = useCallback(() => {
    OverlayModal.hide();
    navigationService.navigate('DeviceList');
  }, []);

  return useCallback(async () => {
    const status = await showManagerExceedTip();
    if (status) {
      ActionSheet.alert({
        title: t('Remove Login Devices'),
        message: t(
          'The number of your login devices is reaching the maximum limit. To ensure a smooth experience, it is recommended to remove devices you no longer use.',
        ),
        buttons: [
          { title: t('Not Now'), type: t('outline') },
          {
            title: t('Go to Remove'),
            type: 'primary',
            onPress: toDelete,
          },
        ],
      });
    }
  }, [showManagerExceedTip, t, toDelete]);
}
