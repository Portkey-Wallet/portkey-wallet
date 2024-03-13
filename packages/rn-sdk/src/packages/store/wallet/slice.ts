import { createSlice } from '@reduxjs/toolkit';

import {
  addAccount,
  addAndReplaceAccount,
  changePassword,
  createWalletAction,
  importAccount,
  removeAccount,
  resetWallet,
  setBackup,
  setCurrentAccount,
  updateAccountName,
} from './actions';
import {
  checkAccountNameInput,
  checkPasswordInput,
  getAccountByPrivateKey,
  getNextBIP44Path,
} from 'packages/utils/wallet';
import { DefaultBIP44Path } from 'packages/constants/wallet';
import { WalletError, WalletState } from './type';
import {
  changeEncryptStr,
  checkAccount,
  checkAccountExists,
  checkAccountNotExistByState,
  checkPasswordByStateMnemonic,
  createAccount,
  getAccountByWalletState,
  handlePrivateKey,
} from './utils';
import { isEqAddress } from 'packages/utils/aelf';
import { isPrivateKey } from 'packages/utils';
const initialState: WalletState = {
  nextBIP44Path: DefaultBIP44Path,
  walletType: 'aelf',
};
export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createWalletAction, (state, action) => {
        const { walletInfo, accountInfo } = action.payload;
        state.walletInfo = walletInfo;
        state.accountList = [accountInfo];
        state.currentAccount = accountInfo;
        state.nextBIP44Path = getNextBIP44Path(accountInfo.BIP44Path ?? '');
      })
      .addCase(setBackup, (state, action) => {
        if (!state.walletInfo || !state.accountList) throw new Error(WalletError.noCreateWallet);
        const { password, isBackup } = action.payload;
        checkPasswordByStateMnemonic(state.walletInfo.AESEncryptMnemonic, password);
        state.walletInfo.isBackup = isBackup;
      })
      .addCase(addAccount, (state, action) => {
        if (!state.walletInfo || !state.accountList) throw new Error(WalletError.noCreateWallet);
        const { password, accountName } = action.payload;

        // checkWalletNameInput
        const walletNameMessage = checkAccountNameInput(accountName);
        if (walletNameMessage) throw new Error(walletNameMessage);

        const walletInfo = getAccountByWalletState(state, password);

        checkAccountExists(state, walletInfo);

        const accountInfo = createAccount(
          walletInfo,
          password,
          accountName || `Account ${state.accountList.length + 1}`,
        );

        state.accountList.push(accountInfo);
        state.nextBIP44Path = getNextBIP44Path(state.nextBIP44Path);
        state.currentAccount = accountInfo;
      })
      .addCase(setCurrentAccount, (state, action) => {
        if (!state.walletInfo || !state.accountList) throw new Error(WalletError.noCreateWallet);
        const { address, password } = action.payload;
        checkAccountNotExistByState(state.accountList, address);
        checkPasswordByStateMnemonic(state.walletInfo.AESEncryptMnemonic, password);
        state.currentAccount = state.accountList.find(account => isEqAddress(account.address, address));
      })
      .addCase(resetWallet, () => initialState)
      .addCase(importAccount, (state, action) => {
        if (!state.walletInfo || !state.accountList) throw new Error(WalletError.noCreateWallet);
        const { password, privateKey, accountName } = action.payload;

        const pkey = handlePrivateKey(privateKey);

        if (!isPrivateKey(pkey)) throw new Error(WalletError.invalidPrivateKey);

        checkPasswordByStateMnemonic(state.walletInfo.AESEncryptMnemonic, password);

        const walletInfo = getAccountByPrivateKey(pkey);

        checkAccountExists(state, walletInfo);

        const accountInfo = createAccount(
          walletInfo,
          password,
          accountName || `Account ${state.accountList.length + 1}`,
          'Import',
        );

        state.accountList.push(accountInfo);
        state.currentAccount = accountInfo;
      })
      .addCase(updateAccountName, (state, action) => {
        if (!state.walletInfo || !state.accountList) throw new Error(WalletError.noCreateWallet);

        const { address, accountName, password } = action.payload;

        // checkWalletNameInput
        const walletNameMessage = checkAccountNameInput(accountName);
        if (walletNameMessage) throw new Error(walletNameMessage);

        checkPasswordByStateMnemonic(state.walletInfo.AESEncryptMnemonic, password);
        checkAccountNotExistByState(state.accountList, address);
        state.accountList = state.accountList.map(account => {
          if (isEqAddress(account.address, address))
            return {
              ...account,
              accountName,
            };
          return account;
        });
        // if change currentAccount
        if (state.currentAccount && isEqAddress(state.currentAccount.address, address))
          state.currentAccount.accountName = accountName;
      })
      .addCase(removeAccount, (state, action) => {
        if (!state.walletInfo || !state.accountList) throw new Error(WalletError.noCreateWallet);
        const { address, password } = action.payload;
        checkAccountNotExistByState(state.accountList, address);
        checkPasswordByStateMnemonic(state.walletInfo.AESEncryptMnemonic, password);

        let isRemoved = false;
        state.accountList = state.accountList.filter(item => {
          if (isEqAddress(item.address, address)) {
            isRemoved = item.accountType === 'Import';
            return !isRemoved;
          }
          return true;
        });
        // if remove currentAccount
        if (state.currentAccount && isEqAddress(state.currentAccount.address, address))
          state.currentAccount = state.accountList[0];
        if (!isRemoved) throw new Error(WalletError.createdAccountNotDeleted);
      })
      .addCase(addAndReplaceAccount, (state, action) => {
        if (!state.walletInfo || !state.accountList) throw new Error(WalletError.noCreateWallet);
        const { password, accountName } = action.payload;
        const walletInfo = getAccountByWalletState(state, password);

        if (checkAccount(state.accountList, walletInfo.address)) {
          state.accountList = state.accountList.filter(item => {
            if (isEqAddress(item.address, walletInfo.address)) return item.accountType !== 'Import';
            return true;
          });
        }
        const accountInfo = createAccount(
          walletInfo,
          password,
          accountName || `Account ${state.accountList.length + 1}`,
        );

        state.accountList.push(accountInfo);
        state.nextBIP44Path = getNextBIP44Path(state.nextBIP44Path);
        state.currentAccount = accountInfo;
      })
      .addCase(changePassword, (state, action) => {
        if (!state.walletInfo || !state.accountList) throw new Error(WalletError.noCreateWallet);
        const { password, newPassword } = action.payload;
        // checkPassword
        const passwordMessage = checkPasswordInput(password);
        if (passwordMessage) throw new Error(passwordMessage);

        checkPasswordByStateMnemonic(state.walletInfo.AESEncryptMnemonic, password);
        state.walletInfo.AESEncryptMnemonic = changeEncryptStr(
          state.walletInfo.AESEncryptMnemonic,
          password,
          newPassword,
        );
        state.walletInfo.AESEncryptPrivateKey = changeEncryptStr(
          state.walletInfo.AESEncryptPrivateKey,
          password,
          newPassword,
        );
        if (state.currentAccount)
          state.currentAccount.AESEncryptPrivateKey = changeEncryptStr(
            state.currentAccount.AESEncryptPrivateKey,
            password,
            newPassword,
          );
        state.accountList = state.accountList.map(account => {
          return {
            ...account,
            AESEncryptPrivateKey: changeEncryptStr(account.AESEncryptPrivateKey, password, newPassword),
          };
        });
      });
  },
});
