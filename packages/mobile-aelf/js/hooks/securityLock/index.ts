import { getSecureStoreItem } from '@portkey-wallet/utils/mobile/biometric';
import { useUser } from 'hooks/store';
import { useCallback } from 'react';
import navigationService from 'utils/navigationService';

export const useCheckSecurityLock = () => {
  const { biometrics } = useUser();

  return useCallback(
    async (callback?: () => void) => {
      if (!biometrics) {
        navigationService.push('SecurityLock', {
          isCheck: true,
          checkCallback: callback,
        });
        return;
      }

      try {
        await getSecureStoreItem('Pin');
        callback?.();
      } catch (error) {
        // TODO: eoa add error toast
      }
    },
    [biometrics],
  );
};
