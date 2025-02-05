import { createSlice } from '@reduxjs/toolkit';
import { TWalletState } from './type';
import {
  addAccount,
  addWallet,
  removeAccount,
  removeWallet,
  resetWallet,
  setHideAssetsAction,
  updateWalletList,
} from './actions';
import { getNextBIP44Path } from '@portkey-wallet/utils/wallet';

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
        const walletList = [...state.walletList];
        const wallet = walletList.find(item => item.key === key);
        if (!wallet) return state;

        wallet.accountList = [...wallet.accountList, account];

        // TODO: eoa add currentAccountAddress logic
        wallet.nextBIP44Path = getNextBIP44Path(account.BIP44Path);
        state.currentAccountAddress = account.address;
        return {
          ...state,
          walletList,
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
      .addCase(updateWalletList, (state, action) => {
        const { walletList } = action.payload;
        state.walletList = walletList;
      })
      .addCase(setHideAssetsAction, (state, action) => {
        const { hideAssets } = action.payload;
        state.hideAssets = hideAssets;
      })
      .addCase(resetWallet, () => ({ ...initialState }));
  },
});
