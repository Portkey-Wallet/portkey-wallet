import ActionSheet from 'components/ActionSheet';
import navigationService from './navigationService';
import OverlayModal from 'components/OverlayModal';

export const guardianCountAlert = () => {
  // TODO: check if should show
  ActionSheet.alert({
    title: 'Remove Login Devices',
    message:
      'The number of your login devices is reaching the maximum limit. To ensure a smooth experience, it is recommended to remove devices you no longer use.',
    buttons: [
      { title: 'Not Now', type: 'outline' },
      {
        title: 'Go to Remove',
        type: 'primary',
        onPress: () => {
          OverlayModal.hide();
          navigationService.navigate('DeviceList');
        },
      },
    ],
  });
};
