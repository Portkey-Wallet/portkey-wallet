import { useCallback, useMemo } from 'react';
import { useAppCommonSelector } from '@portkey-wallet/hooks';
import { setHasShowUploadV2WaringModal } from '@portkey-wallet/store/settings/slice';
import { useAppDispatch } from 'store/hooks';
import { showUpgradeOverlay } from 'components/UpgradeOverlay';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { ANDROID_DOWNLOAD_LINK_V2, IOS_DOWNLOAD_LINK_V2 } from '@portkey-wallet/constants/constants-ca/link';
import { Linking } from 'react-native';

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

  const onDownLoad = useCallback(() => {
    setHasShowUploadV2WaringModalState(true);
    Linking.openURL(isIOS ? IOS_DOWNLOAD_LINK_V2 : ANDROID_DOWNLOAD_LINK_V2);
  }, [setHasShowUploadV2WaringModalState]);

  const onNotNow = useCallback(() => {
    setHasShowUploadV2WaringModalState(true);
  }, [setHasShowUploadV2WaringModalState]);

  const showUploadWaring = useCallback(() => {
    showUpgradeOverlay({ onDownLoad, onNotNow });
  }, [onDownLoad, onNotNow]);

  return { setHasShowUploadV2WaringModalState, shouldShowUploadWarning, showUploadWaring };
};
