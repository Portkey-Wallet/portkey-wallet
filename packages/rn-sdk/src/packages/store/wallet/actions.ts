import AElf from 'aelf-sdk';
import { checkPasswordInput, checkWalletNameInput, formatWalletInfo } from 'packages/utils/wallet';
import { createAction } from '@reduxjs/toolkit';
import { AccountType, WalletInfoType } from 'packages/types/wallet';

export const createWallet =
  ({ walletInfo, walletName, password }: { walletInfo?: any; walletName: string; password: string }): any =>
  (dispatch: any) => {
    // checkPassword
    const passwordMessage = checkPasswordInput(password);
    if (passwordMessage) throw new Error(passwordMessage);

    // checkWalletNameInput
    const walletNameMessage = checkWalletNameInput(walletName);
    if (walletNameMessage) throw new Error(walletNameMessage);

    if (!walletInfo) walletInfo = AElf.wallet.createNewWallet();
    const walletObj = formatWalletInfo(walletInfo, password, walletName);
    if (walletObj) {
      const { walletInfo: newWalletInfo, accountInfo } = walletObj;
      newWalletInfo.walletName = walletName;
      newWalletInfo.isBackup = false;
      console.log(newWalletInfo, 'newWalletInfo===');
      dispatch(createWalletAction({ walletInfo: newWalletInfo, accountInfo }));
      return true;
    }
    throw new Error('createWallet fail');
  };
export const createWalletAction = createAction<{ walletInfo: WalletInfoType; accountInfo: AccountType }>(
  'wallet/createWallet',
);
export const setBackup = createAction<{ password: string; isBackup: boolean }>('wallet/setBackup');
export const addAccount = createAction<{ password: string; accountName?: string }>('wallet/addAccount');
export const importAccount = createAction<{ password: string; privateKey: string; accountName?: string }>(
  'wallet/importAccount',
);
export const setCurrentAccount = createAction<{ address: string; password: string }>('wallet/setCurrentAccount');
export const updateAccountName = createAction<{ address: string; accountName: string; password: string }>(
  'wallet/updateAccountName',
);
export const addAndReplaceAccount = createAction<{ password: string; accountName?: string }>(
  'wallet/addAndReplaceAccount',
);

export const removeAccount = createAction<{ address: string; password: string }>('wallet/removeAccount');
export const resetWallet = createAction('wallet/resetWallet');

export const changePassword = createAction<{ password: string; newPassword: string }>('wallet/changePassword');
