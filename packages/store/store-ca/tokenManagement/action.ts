import { createAsyncThunk } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import { HandleTokenArgTypes } from '@portkey-wallet/types/types-ca/token';
import { fetchAllTokenList } from './api';
import { request } from '@portkey-wallet/api/api-did';
import { NetworkType } from '@portkey-wallet/types';

export const addTokenInCurrentAccount = createAction<HandleTokenArgTypes>('token/addTokenInCurrentAccount');

export const deleteTokenInCurrentAccount = createAction<HandleTokenArgTypes>('token/deleteTokenInCurrentAccount');
export const resetTokenInfo = createAction<NetworkType>('token/resetTokenInfo');

export const fetchAllTokenListAsync = createAsyncThunk(
  'tokenManagement/fetchAllTokenListAsync',
  async ({
    keyword = '',
    chainIdArray,
    skipCount = 0,
    maxResultCount = 1000,
    currentNetwork,
  }: {
    keyword?: string;
    chainIdArray?: string[];
    skipCount?: number;
    maxResultCount?: number;
    currentNetwork?: NetworkType;
  }) => {
    const response = await fetchAllTokenList({ keyword, chainIdArray: chainIdArray || [], skipCount, maxResultCount });

    return { list: response.items, totalRecordCount: response.totalCount, skipCount, maxResultCount, currentNetwork };
  },
);

export const getSymbolImagesAsync = createAsyncThunk('tokenManagement/getSymbolImagesAsync', async () => {
  try {
    const { symbolImages } = await request.assets.getSymbolImages({});
    return symbolImages;
  } catch (error) {
    console.log('getSymbolImages error', error);
    return {};
  }
});
