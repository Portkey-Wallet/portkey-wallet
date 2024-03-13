/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IDappStoreState } from './type';
import { createSlice } from '@reduxjs/toolkit';
import { addDapp, removeDapp, resetDapp, resetDappList, updateDapp, updateSessionInfo } from './actions';

const initialState: IDappStoreState = {
  dappMap: {},
};
export const dappSlice = createSlice({
  name: 'dapp',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addDapp, (state, action) => {
        const { networkType, dapp } = action.payload;
        let dappList = state.dappMap[networkType];
        if (!dappList) dappList = [];
        if (dappList.some(item => item.origin === dapp.origin)) throw Error('dapp already exists');
        dappList.push({ ...dapp, connectedTime: Date.now() });
        state.dappMap[networkType] = dappList;
      })
      .addCase(removeDapp, (state, action) => {
        const { networkType, origin } = action.payload;
        const dappList = state.dappMap[networkType];
        if (!dappList || !dappList.some(item => item.origin === origin)) throw Error('origin does not exist');
        state.dappMap[networkType] = dappList.filter(item => item.origin !== origin);
      })
      .addCase(updateDapp, (state, action) => {
        const { networkType, dapp, origin } = action.payload;
        const dappList = state.dappMap[networkType];
        if (!dappList || !dappList.some(item => item.origin === origin)) throw Error('origin does not exist');
        state.dappMap[networkType] = dappList.map(item => {
          if (item.origin === origin) return { ...item, ...dapp };
          return item;
        });
      })
      .addCase(updateSessionInfo, (state, action) => {
        const { networkType, origin, sessionInfo } = action.payload;
        const dappList = state.dappMap[networkType];
        if (!dappList || !dappList.some(item => item.origin === origin)) throw Error('origin does not exist');
        state.dappMap[networkType] = dappList.map(item => {
          if (item.origin === origin) return { ...item, sessionInfo };
          return item;
        });
      })
      .addCase(resetDappList, (state, action) => {
        state.dappMap[action.payload] = [];
      })
      .addCase(resetDapp, state => {
        state.dappMap = {};
      });
  },
});
