import { createAsyncThunk } from '@reduxjs/toolkit';
import { UpdateNotify } from '@portkey-wallet/types/types-ca/device';
import { UpdateVersionParams } from './types';
import { request } from '@portkey-wallet/api/api-did';
import { getCountryCodeIndex } from '@portkey-wallet/constants/constants-ca/country';
import { NetworkType } from '@portkey-wallet/types';
import { MiscState } from './types';
import { NetworkList } from '@portkey-wallet/constants/constants-ca/network';

export const setUpdateVersionInfo = createAsyncThunk<UpdateNotify, UpdateVersionParams>(
  'wallet/setUpdateVersionInfo',
  async (params: UpdateVersionParams) => {
    const _params = {
      deviceId: 'deviceId',
      appId: '10001',
      ...params,
    };
    const req: UpdateNotify = await request.wallet.pullNotify({
      method: 'POST',
      params: _params,
    });
    return req;
  },
);

export const getPhoneCountryCode = createAsyncThunk<MiscState['phoneCountryCodeIndexChainMap'], NetworkType>(
  'misc/getPhoneCountryCode',
  async (network: NetworkType) => {
    const networkInfo = NetworkList.find(item => item.networkType === network);
    if (!networkInfo) {
      throw new Error('networkInfo not found');
    }
    const result = await request.wallet.getPhoneCountryCode({
      baseURL: networkInfo.apiUrl,
    });

    if (result.data && Array.isArray(result.data)) {
      return {
        [network]: getCountryCodeIndex(result.data),
      };
    } else {
      throw new Error('getPhoneCountryCode error');
    }
  },
);
