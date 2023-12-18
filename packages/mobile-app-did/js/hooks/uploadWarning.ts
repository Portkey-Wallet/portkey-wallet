import { useCallback, useMemo } from 'react';
import { IOS_DOWNLOAD_LINK_V2, ANDROID_DOWNLOAD_LINK_V2 } from '@portkey-wallet/constants/constants-ca/link';
import ActionSheet from 'components/ActionSheet';
import { useAppCommonSelector } from '@portkey-wallet/hooks';
import { Linking } from 'react-native';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { setHasShowUploadV2WaringModal } from '@portkey-wallet/store/settings/slice';
import { useAppDispatch } from 'store/hooks';
import OverlayModal from 'components/OverlayModal';

export const useUploadWarning = () => {
  const dispatch = useAppDispatch();

  const settings = useAppCommonSelector(state => state.settings);

  const setHasShowUploadV2WaringModalState = useCallback(
    (state: boolean) => {
      dispatch(setHasShowUploadV2WaringModal(state));
    },
    [dispatch],
  );

  const shouldShowUploadWarning = useMemo(() => {
    if (settings.hasShowUploadV2WaringModal) return false;
    return true;
  }, [settings.hasShowUploadV2WaringModal]);

  const showUploadWaring = useCallback(() => {
    // todo
    ActionSheet.alert({
      title: 'Portkey V2 Launched',
      message: 'Please download the latest version of Portkey to continue using it.',
      buttonGroupDirection: 'column',
      buttons: [
        {
          title: 'Download Portkey V2',
          onPress: () => {
            setHasShowUploadV2WaringModalState(true);
            Linking.openURL(isIOS ? IOS_DOWNLOAD_LINK_V2 : ANDROID_DOWNLOAD_LINK_V2);
          },
        },
        {
          title: 'Ignore',
          type: 'outline',
          onPress: () => {
            OverlayModal.hide();
            setHasShowUploadV2WaringModalState(true);
          },
        },
      ],
    });
  }, [setHasShowUploadV2WaringModalState]);

  return { setHasShowUploadV2WaringModalState, shouldShowUploadWarning, showUploadWaring };
};
