import ActionSheet from 'components/ActionSheet';
import navigationService from './navigationService';
import OverlayModal from 'components/OverlayModal';

export const guardianCountAlert = () => {
  // TODO: check if should show
  ActionSheet.alert({
    title: 'Notice',
    message:
      'The number of managers is almost at its limit. Please delete some device information that you are no longer logged in to ensure that you can log in properly afterwards.',
    buttons: [
      { title: 'Cancel', type: 'outline' },
      {
        title: 'Go to Delete',
        type: 'primary',
        onPress: () => {
          OverlayModal.hide();
          navigationService.navigate('DeviceList');
        },
      },
    ],
  });
};
