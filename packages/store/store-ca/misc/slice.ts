import { createSlice } from '@reduxjs/toolkit';
import { getPhoneCountryCode, setLocalPhoneCountryCodeAction } from './actions';
import { MiscState } from './types';
import { DefaultCountry } from '@portkey-wallet/constants/constants-ca/country';
import { NetworkType } from '@portkey-wallet/types';

const initialState: MiscState = {
  phoneCountryCodeListChainMap: {},
  defaultPhoneCountryCode: DefaultCountry,
  sideChainTokenReceiveTipMap: {
    MAINNET: true,
    TESTNET: true,
  },
};
export const miscSlice = createSlice({
  name: 'misc',
  initialState,
  reducers: {
    setSideChainTokenReceiveTipMap: (state, { payload }: { payload: { network: NetworkType; value: boolean } }) => {
      const { network, value } = payload;
      state.sideChainTokenReceiveTipMap = {
        ...state.sideChainTokenReceiveTipMap,
        [network]: value,
      };
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
