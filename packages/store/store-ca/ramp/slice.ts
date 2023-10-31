import { createSlice } from '@reduxjs/toolkit';
import {
  setBuyCryptoList,
  setBuyDefaultCrypto,
  setBuyDefaultFiat,
  setBuyFiatList,
  setRampEntry,
  setRampInfo,
  setSellCryptoList,
  setSellDefaultCrypto,
  setSellDefaultFiat,
  setSellFiatList,
} from './actions';
import { initialRampState } from './constants';

export const rampSlice = createSlice({
  name: 'ramp',
  initialState: initialRampState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setRampInfo, (state, action) => {
        state.rampInfo = action.payload.info;
      })
      .addCase(setRampEntry, (state, action) => {
        state.rampEntry.isRampShow = action.payload.isRampShow;
        state.rampEntry.isBuySectionShow = action.payload.isBuySectionShow;
        state.rampEntry.isSellSectionShow = action.payload.isSellSectionShow;
      })
      .addCase(setBuyCryptoList, (state, action) => {
        state.buyCryptoList = action.payload.list;
      })
      .addCase(setBuyFiatList, (state, action) => {
        state.buyFiatList = action.payload.list;
      })
      .addCase(setBuyDefaultCrypto, (state, action) => {
        state.buyDefaultCrypto.amount = action.payload.amount;
        state.buyDefaultCrypto.symbol = action.payload.symbol;
      })
      .addCase(setBuyDefaultFiat, (state, action) => {
        state.buyDefaultFiat.amount = action.payload.amount;
        state.buyDefaultFiat.symbol = action.payload.symbol;
      })
      .addCase(setSellCryptoList, (state, action) => {
        state.sellCryptoList = action.payload.list;
      })
      .addCase(setSellFiatList, (state, action) => {
        state.sellFiatList = action.payload.list;
      })
      .addCase(setSellDefaultCrypto, (state, action) => {
        state.sellDefaultCrypto.amount = action.payload.amount;
        state.sellDefaultCrypto.symbol = action.payload.symbol;
      })
      .addCase(setSellDefaultFiat, (state, action) => {
        state.sellDefaultFiat.amount = action.payload.amount;
        state.sellDefaultFiat.symbol = action.payload.symbol;
      });
  },
});
