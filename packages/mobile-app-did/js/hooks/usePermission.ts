import { useAppCommonSelector } from '@portkey-wallet/hooks';
import { addNotificationsModalTime } from '@portkey-wallet/store/settings/slice';
import { showGoToSettingsModal } from 'components/GoToSettingsModal';
import OverlayModal from 'components/OverlayModal';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { requestUserNotifyPermission } from 'utils/FCM';
import { openSettings } from 'react-native-permissions';

export default function useRequestNotifyPermission() {
  const dispatch = useAppDispatch();
  const settings = useAppCommonSelector(state => state.settings);

  const onClose = useCallback(() => {
    OverlayModal.hide();
    dispatch(addNotificationsModalTime());
  }, [dispatch]);

  const onGoToSetting = useCallback(() => {
    OverlayModal.hide();
    openSettings();
  }, []);

  return useCallback(async () => {
    if (settings.closeNotificationsModalTime) return;

    const isPermissionOK = await requestUserNotifyPermission();
    if (!isPermissionOK && !settings.closeNotificationsModalTime) {
      showGoToSettingsModal({ onClose, onGoToSetting });
    }
  }, [onClose, onGoToSetting, settings]);
}
