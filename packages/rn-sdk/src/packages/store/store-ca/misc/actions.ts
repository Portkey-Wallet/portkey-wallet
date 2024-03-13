import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { request } from 'packages/api/api-did';
import { NetworkType } from 'packages/types';
import { MiscState } from './types';
import { NetworkList } from 'packages/constants/constants-ca/network';
import { DefaultCountry } from 'packages/constants/constants-ca/country';
import { CountryItem } from 'packages/types/types-ca/country';

export const getPhoneCountryCode = createAsyncThunk<
  Required<Pick<MiscState, 'phoneCountryCodeListChainMap' | 'defaultPhoneCountryCode'>>,
  NetworkType
>('misc/getPhoneCountryCode', async (network: NetworkType) => {
  const networkInfo = NetworkList.find(item => item.networkType === network);
  if (!networkInfo) {
    throw new Error('networkInfo not found');
  }
  const result = await request.wallet.getPhoneCountryCode({
    baseURL: networkInfo.apiUrl,
  });

  if (result.data && Array.isArray(result.data)) {
    return {
      phoneCountryCodeListChainMap: {
        [network]: result.data,
      },
      defaultPhoneCountryCode: result.locateData || DefaultCountry,
    };
  } else {
    throw new Error('getPhoneCountryCode error');
  }
});

export const setLocalPhoneCountryCodeAction = createAction<CountryItem>('misc/setContact');
