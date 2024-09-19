import { createAsyncThunk } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import { HandleTokenArgTypes } from '@portkey-wallet/types/types-ca/token';
import { fetchAllTokenList, fetchAllTokenListLegacy } from './api';
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
    const response = await fetchAllTokenListLegacy({
      keyword,
      chainIdArray: chainIdArray || [],
      skipCount,
      maxResultCount,
    });

    return { list: response.items, totalRecordCount: response.totalCount, skipCount, maxResultCount, currentNetwork };
  },
);
let a = true;
export const fetchAllTokenListV2Async = createAsyncThunk(
  'tokenManagement/fetchAllTokenListV2Async',
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
    // const response = await fetchAllTokenList({
    //   keyword,
    //   chainIdArray: chainIdArray || [],
    //   skipCount,
    //   maxResultCount,
    // });
    console.log('fetchAllTokenListV2Async start:');
    let response;
    if (a) {
      a = false;
      response = {
        totalRecordCount: 1,
        data: [
          {
            symbol: 'ELF',
            imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-ELF.png',
            label: null,
            displayStatus: 'all', //外层返回开关状态（全开-all、部分开-partial、全没开-none）
            tokens: [
              {
                id: '09f1897b-2c55-134b-aa11-3a143899f242',
                chainId: 'AELF',
                symbol: 'ELF',
                imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-ELF.png',
                address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
                decimals: 8,
                isDefault: true,
                isDisplay: true,
                label: null,
              },
              {
                id: 'b9cdfcfc-91cd-4acf-2aac-3a143899f245',
                chainId: 'tDVW',
                symbol: 'ELF',
                imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-ELF.png',
                address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
                decimals: 8,
                isDefault: true,
                isDisplay: true,
                label: null,
              },
            ],
          },
        ],
      };
    } else {
      response = {
        totalRecordCount: 1,
        data: [
          {
            symbol: 'ELF',
            imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-ELF.png',
            label: null,
            displayStatus: 'all', //外层返回开关状态（全开-all、部分开-partial、全没开-none）
            tokens: [
              {
                id: '09f1897b-2c55-134b-aa11-3a143899f242',
                chainId: 'AELF',
                symbol: 'ELF',
                imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-ELF.png',
                address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
                decimals: 8,
                isDefault: true,
                isDisplay: false,
                label: null,
              },
              {
                id: 'b9cdfcfc-91cd-4acf-2aac-3a143899f245',
                chainId: 'tDVW',
                symbol: 'ELF',
                imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-ELF.png',
                address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
                decimals: 8,
                isDefault: true,
                isDisplay: false,
                label: null,
              },
            ],
          },
        ],
      };
    }

    console.log('response is:', response.data);
    return { list: response.data, totalRecordCount: response.totalCount, skipCount, maxResultCount, currentNetwork };
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
