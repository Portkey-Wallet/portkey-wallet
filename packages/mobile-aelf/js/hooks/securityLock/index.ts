import { getSecureStoreItem } from '@portkey-wallet/utils/mobile/biometric';
import { useUser } from 'hooks/store';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { setCredentials } from 'store/user/actions';
import navigationService from 'utils/navigationService';

export const useCheckSecurityLock = () => {
  const { biometrics } = useUser();
  const dispatch = useAppDispatch();

  return useCallback(
    async (callback?: () => void, isBackAllow = false, navigationServicePop = true) => {
      if (!biometrics) {
        navigationService.push('SecurityLock', {
          isCheck: true,
          checkCallback: () => {
            navigationServicePop && navigationService.pop(1);
            callback?.();
          },
          isBackAllow,
        });
        return;
      }

      try {
        const securePassword = await getSecureStoreItem('Pin');
        if (!securePassword) {
          return;
        }
        dispatch(setCredentials({ pin: securePassword }));
        callback?.();
      } catch (error) {
        // TODO: eoa add error toast
      }
    },
    [biometrics, dispatch],
  );
};
