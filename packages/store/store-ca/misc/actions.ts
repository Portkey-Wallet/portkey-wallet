import { createAsyncThunk } from '@reduxjs/toolkit';
import { UpdateNotify } from '@portkey-wallet/types/types-ca/device';
import { UpdateVersionParams } from './types';
import { request } from '@portkey-wallet/api/api-did';

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
