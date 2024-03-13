import { createSlice } from '@reduxjs/toolkit';
import {
  setBuyDefaultCrypto,
  setBuyDefaultCryptoList,
  setBuyDefaultFiat,
  setBuyFiatList,
  setRampEntry,
  setSellCryptoList,
  setSellDefaultCrypto,
  setSellDefaultFiat,
  setSellDefaultFiatList,
} from './actions';
import { initialRampState } from './constants';

export const rampSlice = createSlice({
  name: 'ramp',
  initialState: initialRampState,
  reducers: {
    resetRamp: () => initialRampState,
  },
  extraReducers: builder => {
    builder
      .addCase(setRampEntry, (state, action) => {
        state.rampEntry.isRampShow = action.payload.isRampShow;
        state.rampEntry.isBuySectionShow = action.payload.isBuySectionShow;
        state.rampEntry.isSellSectionShow = action.payload.isSellSectionShow;
      })
      .addCase(setBuyFiatList, (state, action) => {
        state.buyFiatList = action.payload.list;
      })
      .addCase(setBuyDefaultFiat, (state, action) => {
        state.buyDefaultFiat = action.payload.value;
      })
      .addCase(setBuyDefaultCryptoList, (state, action) => {
        state.buyDefaultCryptoList = action.payload.list;
      })
      .addCase(setBuyDefaultCrypto, (state, action) => {
        state.buyDefaultCrypto = action.payload.value;
      })

      .addCase(setSellCryptoList, (state, action) => {
        state.sellCryptoList = action.payload.list;
      })
      .addCase(setSellDefaultCrypto, (state, action) => {
        state.sellDefaultCrypto = action.payload.value;
      })
      .addCase(setSellDefaultFiatList, (state, action) => {
        state.sellDefaultFiatList = action.payload.list;
      })
      .addCase(setSellDefaultFiat, (state, action) => {
        state.sellDefaultFiat = action.payload.value;
      });
  },
});

export const { resetRamp } = rampSlice.actions;
