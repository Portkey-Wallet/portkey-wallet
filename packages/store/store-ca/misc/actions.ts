import { createAsyncThunk } from '@reduxjs/toolkit';
import { UpdateNotify } from '@portkey-wallet/types/types-ca/device';
import { UpdateVersionParams } from './types';
import { request } from '@portkey-wallet/api/api-did';
import { CountryItem } from '@portkey-wallet/types/types-ca/country';
import { countryCodeIndex } from '@portkey-wallet/constants/constants-ca/country';

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

export const getPhoneCountryCode = createAsyncThunk<[string, CountryItem[]][], void>(
  'misc/getPhoneCountryCode',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    return countryCodeIndex;
  },
);
