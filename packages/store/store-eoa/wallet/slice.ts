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
import { getNextBIP44Path } from '@portkey-wallet/utils/wallet';
// import { NetworkType } from '@portkey-wallet/types';
import { MAX_ACCOUNT_NUMBER } from './config';

const initialState: TWalletState = {
  walletList: [],
  privateKeyAccountList: [],
  currentAccountAddress: undefined,
  hideAssets: false,
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
        };
      })
      .addCase(updateWallet, (state, action) => {
        const { wallet } = action.payload;
        const newWalletList = state.walletList.map(item => (item.key === wallet.key ? { ...item, ...wallet } : item));
        return {
          ...state,
          walletList: newWalletList,
          currentAccountAddress: wallet.accountList[0]?.address,
        };
      })
      .addCase(removeWallet, (state, action) => {
        const { key } = action.payload;
        const walletList = state.walletList.filter(item => item.key !== key);

        // TODO: eoa add currentAccountAddress logic
        return {
          ...state,
          walletList,
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
            return {
              ...wallet,
              accountList: [...wallet.accountList, account],
              nextBIP44Path: getNextBIP44Path(account.BIP44Path),
            };
          }
          return wallet;
        });

        // const walletList = [...state.walletList];
        // const wallet = walletList.find(item => item.key === key);
        // if (!wallet) return state;
        //
        // wallet.accountList = [...wallet.accountList, account];
        //
        // // TODO: eoa add currentAccountAddress logic
        // wallet.nextBIP44Path = getNextBIP44Path(account.BIP44Path);
        // state.currentAccountAddress = account.address;
        return {
          ...state,
          walletList: newWalletList,
        };
      })
      .addCase(removeAccount, (state, action) => {
        const { key, address } = action.payload;
        const walletList = [...state.walletList];
        const wallet = walletList.find(item => item.key === key);
        if (!wallet) return state;
        const account = wallet.accountList.find(item => item.address === address);
        if (!account) return state;
        account.isHide = true;

        // TODO: eoa add currentAccountAddress logic
        return {
          ...state,
          walletList,
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
