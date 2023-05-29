/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IDappStoreState } from './type';
import { createSlice } from '@reduxjs/toolkit';
import { addDapp, removeDapp, updateDapp } from './actions';

const initialState: IDappStoreState = {
  dappList: {},
};
export const dappSlice = createSlice({
  name: 'dapp',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addDapp, (state, action) => {
        const { networkType, dapp } = action.payload;
        let dappList = state.dappList[networkType];
        if (!dappList) dappList = [];
        if (dappList.some(item => item.origin === dapp.origin)) throw Error('dapp already exists');
        dappList.push(dapp);
        state.dappList[networkType] = dappList;
      })
      .addCase(removeDapp, (state, action) => {
        const { networkType, origin } = action.payload;
        const dappList = state.dappList[networkType];
        if (!dappList || !dappList.some(item => item.origin === origin)) throw Error('origin does not exist');
        state.dappList[networkType] = dappList.filter(item => item.origin !== origin);
      })
      .addCase(updateDapp, (state, action) => {
        const { networkType, dapp, origin } = action.payload;
        const dappList = state.dappList[networkType];
        if (!dappList || !dappList.some(item => item.origin === origin)) throw Error('origin does not exist');
        state.dappList[networkType] = dappList.map(item => {
          if (item.origin === origin) return dapp;
          return item;
        });
      });
  },
});
