import { RequireAtLeastOne } from '@portkey-wallet/types/common';
import { TAccountInfo, TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { createAction } from '@reduxjs/toolkit';

export const addWallet = createAction<{
  wallet: TWalletInfo;
}>('wallet/addWallet');

export const updateWallet = createAction<{
  wallet: TWalletInfo;
}>('wallet/updateWallet');

export const removeWallet = createAction<{
  key: string;
}>('wallet/removeWallet');

export const resetWallet = createAction('wallet/resetWallet');

export const changeCurrentWallet = createAction<{
  address: string;
}>('wallet/changeCurrentWallet');

export const addAccount = createAction<{
  key: string;
  account: TAccountInfo;
}>('wallet/addAccount');

export const updateAccount = createAction<{
  accountAddress: string;
  walletKey: string;
  account: TAccountInfo;
}>('wallet/updateAccount');

export const removeAccount = createAction<{
  walletKey: string;
  accountAddress: string;
}>('wallet/removeAccount');

export const updateWalletList = createAction<{
  walletList: TWalletInfo[];
}>('wallet/updateWalletList');

export const setHideAssetsAction =
  createAction<RequireAtLeastOne<{ hideAssets: boolean }>>('wallet/setHideAssetsAction');
