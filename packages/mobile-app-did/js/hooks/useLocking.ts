import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { setCredentials } from 'store/user/actions';
import navigationService from 'utils/navigationService';

export default function useLocking() {
  const dispatch = useAppDispatch();
  const { address } = useCurrentWalletInfo();
  return useCallback(() => {
    try {
      if (!address) return;
      dispatch(setCredentials(undefined));
      navigationService.reset('SecurityLock');
    } catch (error) {
      console.log(error, '====error');
    }
  }, [address, dispatch]);
}
