import ActionSheet from 'components/ActionSheet';
import { useLanguage } from 'i18n/hooks';
import { useCallback } from 'react';
import { PermissionType, PortkeyModulesEntity } from 'service/native-modules';

export const useQrScanPermissionAndToast = () => {
  const { t } = useLanguage();

  const showDialog = useCallback(
    () =>
      ActionSheet.alert({
        title: t('Enable Camera Access'),
        message: t('Cannot connect to the camera. Please make sure it is turned on'),
        buttons: [
          {
            title: t('Close'),
            type: 'solid',
          },
        ],
      }),
    [t],
  );

  return useCallback(async () => {
    const result = await requireXPermission('camera');
    if (!result) showDialog();
    return result;
  }, [showDialog]);
};

const requireXPermission = async (permission: PermissionType) => {
  return (await PortkeyModulesEntity.PermissionModule.isPermissionGranted(permission))
    ? true
    : await PortkeyModulesEntity.PermissionModule.requestPermission(permission);
};
