import { createAsyncThunk } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import { HandleTokenArgTypes } from '@portkey-wallet/types/types-eoa/token';
import { fetchAllTokenList, fetchAllTokenListLegacy } from './api';
import { request } from '@portkey-wallet/api/api-eoa';
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
    identify,
  }: {
    keyword?: string;
    chainIdArray?: string[];
    skipCount?: number;
    maxResultCount?: number;
    identify: string;
  }) => {
    const response = await fetchAllTokenListLegacy({
      keyword,
      chainIdArray: chainIdArray || [],
      skipCount,
      maxResultCount,
    });

    return { list: response.items, totalRecordCount: response.totalCount, skipCount, maxResultCount, identify };
  },
);

export const fetchAllTokenListV2Async = createAsyncThunk(
  'tokenManagement/fetchAllTokenListV2Async',
  async ({
    keyword = '',
    chainIdArray,
    skipCount = 0,
    maxResultCount = 1000,
    identify,
  }: {
    keyword?: string;
    chainIdArray?: string[];
    skipCount?: number;
    maxResultCount?: number;
    identify: string;
  }) => {
    const response = await fetchAllTokenList({
      keyword,
      chainIdArray: chainIdArray || [],
      skipCount,
      maxResultCount,
    });
    console.log('fetchAllTokenListV2Async start:');

    console.log('response is:', response.data);
    return {
      list: response.data,
      totalRecordCount: response.totalRecordCount,
      skipCount,
      maxResultCount,
      identify,
    };
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
