import { createAsyncThunk } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import { HandleTokenArgTypes } from '@portkey-wallet/types/types-ca/token';
import { fetchAllTokenList } from './api';
import { request } from '@portkey-wallet/api/api-did';

export const addTokenInCurrentAccount = createAction<HandleTokenArgTypes>('token/addTokenInCurrentAccount');

export const deleteTokenInCurrentAccount = createAction<HandleTokenArgTypes>('token/deleteTokenInCurrentAccount');

export const fetchAllTokenListAsync = createAsyncThunk(
  'tokenManagement/fetchAllTokenListAsync',
  async ({ keyword = '', chainIdArray }: { keyword?: string; chainIdArray?: string[] }) => {
    const response = await fetchAllTokenList({ keyword, chainIdArray: chainIdArray || [] });

    return { list: response.items, totalRecordCount: response.totalRecordCount };
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
