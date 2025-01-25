import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  TConfigStateType,
  TFetchContactSupportNetworkListPayload,
  TFetchTransferSupportNetworkListPayload,
} from './types';
import { request } from '@portkey-wallet/api/api-eoa';
import { NetworkItem } from '@portkey-wallet/types/types-eoa/network';

const initialState: TConfigStateType = {
  contactSupportNetworkMap: {},
  sendAssetSupportNetworkMap: {},
};

// fetchContactSupportNetworkItem
export const fetchContactSupportNetworkList = createAsyncThunk<TFetchContactSupportNetworkListPayload, NetworkItem[]>(
  'fetchContactSupportNetworkList',
  async networkList => {
    const result: any = {};

    try {
      const promiseList: Promise<any>[] = [];
      networkList.forEach(ele => {
        promiseList.push(
          request.contact.getSupportNetworkList({
            baseURL: ele.apiUrl,
          }),
        );
      });

      const response = await Promise.allSettled(promiseList);
      response.forEach((item, index) => {
        const currentNetwork = networkList[index].networkType;
        if (item.status === 'fulfilled') {
          result[currentNetwork] = item?.value?.networkList || [];
        } else {
          console.log(`${currentNetwork} request failed:`, item.reason);
        }
      });

      return result;
    } catch (error) {
      console.log('error', error);
      return result;
    }
  },
);

// fetchTransferSupportNetworkList
export const fetchTransferSupportNetworkList = createAsyncThunk<TFetchTransferSupportNetworkListPayload, NetworkItem[]>(
  'fetchTransferSupportNetworkList',
  async networkList => {
    const result: any = {};

    try {
      const promiseList: Promise<any>[] = [];
      networkList.forEach(ele => {
        promiseList.push(
          request.sendApi.getTransferSupportNetworkMap({
            baseURL: ele.apiUrl,
          }),
        );
      });

      const response = await Promise.allSettled(promiseList);
      response.forEach((item, index) => {
        const currentNetwork = networkList[index].networkType;
        if (item.status === 'fulfilled') {
          result[currentNetwork] = item?.value?.supportedNetworks || {};
        } else {
          console.log(`${currentNetwork} request failed:`, item.reason);
        }
      });

      return result;
    } catch (error) {
      console.log('error', error);
      return result;
    }
  },
);

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchContactSupportNetworkList.fulfilled, (state, action) => {
        const result = action.payload;

        state.contactSupportNetworkMap = {
          ...state.contactSupportNetworkMap,
          ...result,
        };
      })
      .addCase(fetchContactSupportNetworkList.rejected, (state, action) => {
        console.log('fetchContactSupportNetworkItem.rejected: error', action.error.message);
      })
      .addCase(fetchTransferSupportNetworkList.fulfilled, (state, action) => {
        const result = action.payload;
        state.sendAssetSupportNetworkMap = {
          ...state.sendAssetSupportNetworkMap,
          ...result,
        };
      })
      .addCase(fetchTransferSupportNetworkList.rejected, (state, action) => {
        console.log('fetchTransferSupportNetworkItem.rejected: error', action.error.message);
      });
  },
});
