import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TWalletState } from './type';
import {
  addAccount,
  addWallet,
  removeAccount,
  removeWallet,
  resetWallet,
  setChainListAction,
  setHideAssetsAction,
} from './actions';
import { getNextBIP44Path } from '@portkey-wallet/utils/wallet';
import { NetworkType } from '@portkey-wallet/types';

const initialState: TWalletState = {
  walletList: [],
  privateKeyAccountList: [],
  currentAccountAddress: undefined,
  networkType: 'MAINNET',
  hideAssets: false,
  chainInfo: {},
};
export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    changeNetworkType: (state, action: PayloadAction<NetworkType>) => {
      state.networkType = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addWallet, (state, action) => {
        const { wallet } = action.payload;
        console.log('wallet======2', JSON.stringify(wallet));
        console.log(
          'wallet======3',
          JSON.stringify({
            ...state,
            walletList: [...state.walletList, wallet],
            currentAccountAddress: wallet.accountList[0]?.address,
          }),
        );
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
      .addCase(setHideAssetsAction, (state, action) => {
        const { hideAssets } = action.payload;
        state.hideAssets = hideAssets;
      })
      .addCase(setChainListAction, (state, action) => {
        const { chainList, networkType } = action.payload;
        if (!state.chainInfo) state.chainInfo = { [networkType]: chainList };
        state.chainInfo[networkType] = chainList;
      })
      .addCase(resetWallet, () => ({ ...initialState }));
  },
});
export const { changeNetworkType } = walletSlice.actions;
