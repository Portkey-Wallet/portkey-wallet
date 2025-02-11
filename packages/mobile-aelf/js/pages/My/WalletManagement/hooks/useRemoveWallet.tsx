import { useCallback } from 'react';
import { removeWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCheckSecurityLock } from 'hooks/securityLock';

export const useRemoveWallet = () => {
  const dispatch = useAppCommonDispatch();
  const checkSecurityLock = useCheckSecurityLock();

  const deleteWallet = useCallback(
    async (currentWalletKey: string, callback?: any) => {
      await checkSecurityLock(() => {
        dispatch(
          removeWallet({
            key: currentWalletKey,
          }),
        );
        callback && callback();
      });
    },
    [checkSecurityLock, dispatch],
  );
  return {
    removeWallet: deleteWallet,
  };
};
