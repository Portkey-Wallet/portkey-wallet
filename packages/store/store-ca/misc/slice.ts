import { createSlice } from '@reduxjs/toolkit';
import { getPhoneCountryCode, setLocalPhoneCountryCodeAction } from './actions';
import { MiscState } from './types';
import { DefaultCountry } from '@portkey-wallet/constants/constants-ca/country';
import { NetworkType } from '@portkey-wallet/types';

const sideChainTokenReceiveTipMapInit = {
  MAINNET: false, // will tip
  TESTNET: false,
};

const initialState: MiscState = {
  phoneCountryCodeListChainMap: {},
  defaultPhoneCountryCode: DefaultCountry,
  sideChainTokenReceiveTipMap: sideChainTokenReceiveTipMapInit,
};
export const miscSlice = createSlice({
  name: 'misc',
  initialState,
  reducers: {
    setSideChainTokenReceiveTipMap: (state, { payload }: { payload: { network: NetworkType; value: boolean } }) => {
      const { network, value } = payload;
      if (state.sideChainTokenReceiveTipMap) {
        state.sideChainTokenReceiveTipMap = {
          ...state.sideChainTokenReceiveTipMap,
          [network]: value,
        };
      } else {
        state = {
          ...state,
          sideChainTokenReceiveTipMap: {
            ...sideChainTokenReceiveTipMapInit,
            [network]: value,
          },
        };
      }
    },
    resetMisc: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(getPhoneCountryCode.fulfilled, (state, action) => {
        state.phoneCountryCodeListChainMap = {
          ...state.phoneCountryCodeListChainMap,
          ...action.payload.phoneCountryCodeListChainMap,
        };
        state.defaultPhoneCountryCode = action.payload.defaultPhoneCountryCode;
      })
      .addCase(getPhoneCountryCode.rejected, (_state, action) => {
        console.log('getPhoneCountryCode error', action);
      })
      .addCase(setLocalPhoneCountryCodeAction, (state, action) => {
        state.localPhoneCountryCode = action.payload;
      });
  },
});

export const { setSideChainTokenReceiveTipMap, resetMisc } = miscSlice.actions;
