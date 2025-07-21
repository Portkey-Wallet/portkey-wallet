import { useCallback } from 'react';
import { removeWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';

// Need unlock or check pin in the page. Different from the mobile app.
// Demo: AddressCardHeader.tsx.
export const useRemoveWallet = () => {
  const dispatch = useAppCommonDispatch();

  const deleteWallet = useCallback(
    async (currentWalletKey: string, callback?: any) => {
      dispatch(
        removeWallet({
          key: currentWalletKey,
        }),
      );
      callback && callback();
    },
    [dispatch],
  );
  return {
    removeWallet: deleteWallet,
  };
};
