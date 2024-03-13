import { createSlice } from '@reduxjs/toolkit';
import { getPhoneCountryCode, setLocalPhoneCountryCodeAction } from './actions';
import { MiscState } from './types';
import { DefaultCountry } from 'packages/constants/constants-ca/country';

const initialState: MiscState = {
  phoneCountryCodeListChainMap: {},
  defaultPhoneCountryCode: DefaultCountry,
};
export const miscSlice = createSlice({
  name: 'misc',
  initialState,
  reducers: {},
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
