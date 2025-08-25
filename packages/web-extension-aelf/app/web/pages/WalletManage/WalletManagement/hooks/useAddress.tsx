import { useCallback } from 'react';
import { LOCAL_AVATARS } from 'assets/images/avatars/avatars';
import { TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { updateAccount, removeAccount } from '@portkey-wallet/store/store-eoa/wallet/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { SWEventDispatchAccountsChangedWithCurrentAccount } from 'utils/Wallet/account';
// import { useCheckSecurityLock } from 'hooks/securityLock';

export const useAddress = ({
  currentAccount,
  currentAddress,
  currentWalletKey,
}: {
  currentAccount?: TAccountInfo;
  currentAddress: string;
  currentWalletKey: string;
}) => {
  const dispatch = useAppCommonDispatch();
  // const checkSecurityLock = useCheckSecurityLock();

  const updateAddressIcon = useCallback(
    async (iconKey: any) => {
      const foundKey = Object.entries(LOCAL_AVATARS).find(([_, value]) => value === iconKey)?.[0];
      console.log('handleSelectPhoto: ', iconKey, foundKey, LOCAL_AVATARS);
      if (!foundKey || !currentAccount) {
        return;
      }
      // setCurrentAccount(newAccount);
      // setAvatar(LOCAL_AVATARS[foundKey]);
      const newAccount = {
        ...currentAccount,
        icon: foundKey || 'avatar_1',
      };
      dispatch(
        updateAccount({
          walletKey: currentWalletKey,
          accountAddress: currentAddress,
          account: newAccount,
        }),
      );
      setTimeout(() => {
        SWEventDispatchAccountsChangedWithCurrentAccount();
      }, 300);
    },
    [currentAccount, currentAddress, currentWalletKey, dispatch],
  );

  const updateAddressName = useCallback(
    async (name: string) => {
      if (!name || !currentAccount) {
        return;
      }
      const newAccount = {
        ...currentAccount,
        name,
      };
      dispatch(
        updateAccount({
          walletKey: currentWalletKey,
          accountAddress: currentAddress,
          account: newAccount,
        }),
      );
      setTimeout(() => {
        SWEventDispatchAccountsChangedWithCurrentAccount();
      }, 300);
    },
    [currentAccount, currentAddress, currentWalletKey, dispatch],
  );

  const removeAddress = useCallback(
    async (callback: any) => {
      // await checkSecurityLock(() => {
      //   // TODO: if privateKey wallet, turn to the logic of remove wallet.
      //   dispatch(
      //     removeAccount({
      //       walletKey: currentWalletKey,
      //       accountAddress: currentAddress,
      //     }),
      //   );
      //   callback();
      // });
      dispatch(
        removeAccount({
          walletKey: currentWalletKey,
          accountAddress: currentAddress,
        }),
      );
      setTimeout(async () => {
        await SWEventDispatchAccountsChangedWithCurrentAccount();
        callback();
      }, 100);
      console.log('removeAddress: ');
    },
    [currentAddress, currentWalletKey, dispatch],
  );

  return {
    updateAddressIcon,
    updateAddressName,
    removeAddress,
  };
};
