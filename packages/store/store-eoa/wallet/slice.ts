import { createSlice } from '@reduxjs/toolkit';
import { TWalletState } from './type';
import {
  addAccount,
  addWallet,
  updateWallet,
  removeAccount,
  updateAccount,
  removeWallet,
  resetWallet,
  setHideAssetsAction,
  changeCurrentWallet,
  updateWalletList,
} from './actions';
import { getAvatarIndex, getNextBIP44Path } from '@portkey-wallet/utils/wallet';
import { TWalletInfo, TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';
// import { NetworkType } from '@portkey-wallet/types';
import { MAX_ACCOUNT_NUMBER } from './config';

const getCurrentAccountAddress = (newWalletList: TWalletInfo[], currentAccountAddress: string | undefined) => {
  if (!newWalletList || newWalletList.length === 0) {
    return initialState.currentAccountAddress;
  }
  const accountExists = newWalletList.some(wallet =>
    wallet.accountList.some(account => account.address === currentAccountAddress),
  );
  console.log('getCurrentAccountAddress:', accountExists, newWalletList[0].accountList[0].address);
  if (!accountExists && newWalletList.length > 0) {
    return newWalletList[0].accountList[0].address;
  }
  return currentAccountAddress;
};

const initialState: TWalletState = {
  walletList: [],
  privateKeyAccountList: [],
  currentAccountAddress: undefined,
  hideAssets: false,
  walletAddedCount: 0,
};
export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addWallet, (state, action) => {
        const { wallet } = action.payload;
        return {
          ...state,
          walletList: [...state.walletList, wallet],
          currentAccountAddress: wallet.accountList[0]?.address,
          walletAddedCount: state.walletAddedCount + 1,
        };
      })
      .addCase(updateWallet, (state, action) => {
        const { wallet } = action.payload;
        const newWalletList = state.walletList.map(item => (item.key === wallet.key ? { ...item, ...wallet } : item));
        const _currentAddressAccount = getCurrentAccountAddress(newWalletList, state.currentAccountAddress);
        return {
          ...state,
          walletList: newWalletList,
          // currentAccountAddress: wallet.accountList[0]?.address,
          currentAccountAddress: _currentAddressAccount,
        };
      })
      .addCase(removeWallet, (state, action) => {
        const { key } = action.payload;
        const walletList = state.walletList.filter(item => item.key !== key);

        const _currentAddressAccount = getCurrentAccountAddress(walletList, state.currentAccountAddress);
        return {
          ...state,
          walletList,
          currentAccountAddress: _currentAddressAccount,
        };
      })
      .addCase(addAccount, (state, action) => {
        const { key, account } = action.payload;
        const newWalletList = state.walletList.map(wallet => {
          if (wallet.key === key) {
            const accountListLength = wallet.accountList.length;
            const lastAccount = wallet.accountList[accountListLength - 1];
            if (lastAccount.BIP44Path === account.BIP44Path || accountListLength >= MAX_ACCOUNT_NUMBER) {
              return wallet;
            }
            const accountFormat: TAccountInfo = {
              ...account,
              icon: account.icon || `avatar_${getAvatarIndex(account.BIP44Path)}`,
            };
            return {
              ...wallet,
              accountList: [...wallet.accountList, accountFormat],
              nextBIP44Path: getNextBIP44Path(account.BIP44Path),
            };
          }
          return wallet;
        });

        return {
          ...state,
          walletList: newWalletList,
          currentAccountAddress: account.address,
        };
      })
      .addCase(removeAccount, (state, action) => {
        const { walletKey, accountAddress } = action.payload;

        const newWalletList = state.walletList
          .map(item => {
            if (item.key === walletKey) {
              const newAccountList = item.accountList.filter(accountItem => accountItem.address !== accountAddress);
              return {
                ...item,
                accountList: newAccountList,
              };
            }
            return item;
          })
          .filter(item => item.accountList.length > 0);

        const _currentAddressAccount = getCurrentAccountAddress(newWalletList, state.currentAccountAddress);
        return {
          ...state,
          walletList: newWalletList,
          currentAccountAddress: _currentAddressAccount,
        };
      })
      .addCase(updateAccount, (state, action) => {
        const { walletKey, accountAddress, account } = action.payload;
        const newWalletList = state.walletList.map(item => {
          if (item.key === walletKey) {
            const newAccountList = item.accountList.map(accountItem =>
              accountItem.address === accountAddress ? { ...accountItem, ...account } : accountItem,
            );
            return {
              ...item,
              accountList: newAccountList,
            };
          }
          return item;
        });

        return {
          ...state,
          walletList: newWalletList,
        };
      })
      .addCase(updateWalletList, (state, action) => {
        const { walletList } = action.payload;
        state.walletList = walletList;
      })
      .addCase(setHideAssetsAction, (state, action) => {
        const { hideAssets } = action.payload;
        state.hideAssets = hideAssets;
      })
      .addCase(resetWallet, () => ({ ...initialState }))
      .addCase(changeCurrentWallet, (state, action) => {
        const { address } = action.payload;
        return {
          ...state,
          currentAccountAddress: address,
        };
      });
  },
});
