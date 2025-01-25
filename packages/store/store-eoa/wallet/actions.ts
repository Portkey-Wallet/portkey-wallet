import { NetworkType } from '@portkey-wallet/types';
import { RequireAtLeastOne } from '@portkey-wallet/types/common';
import { TAccountInfo, TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TWalletState } from './type';
import { NetworkList } from '@portkey-wallet/constants/constants-ca/network-mainnet-v2';
import { getChainList } from './api';
import { IChainItemType } from '@portkey-wallet/types/types-eoa/chain';

export const addWallet = createAction<{
  wallet: TWalletInfo;
}>('wallet/addWallet');

export const removeWallet = createAction<{
  key: string;
}>('wallet/removeWallet');

export const resetWallet = createAction('wallet/resetWallet');

export const addAccount = createAction<{
  key: string;
  account: TAccountInfo;
}>('wallet/addAccount');

export const removeAccount = createAction<{
  key: string;
  address: string;
}>('wallet/removeAccount');

export const setHideAssetsAction =
  createAction<RequireAtLeastOne<{ hideAssets: boolean }>>('wallet/setHideAssetsAction');
export const setChainListAction = createAction<{ chainList: IChainItemType[]; networkType: NetworkType }>(
  'wallet/setChainListAction',
);
export const getChainListAsync = createAsyncThunk(
  'wallet/getChainList',
  async (type: NetworkType | undefined, { getState, dispatch }) => {
    const {
      wallet: { networkType },
    } = getState() as { wallet: TWalletState };
    const _networkType = type ? type : networkType;
    const baseUrl = NetworkList.find(item => item.networkType === _networkType)?.eoaApiUrl;
    if (!baseUrl) throw Error('Unable to obtain the corresponding network');
    const response = await getChainList({ baseUrl });
    if (!response?.items) throw Error('No data');
    dispatch(setChainListAction({ chainList: response.items, networkType: _networkType }));
    return [response.items, response.items.find((item: any) => item.chainId === 'AELF')];
  },
);
