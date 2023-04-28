import { NetworkType } from '@portkey-wallet/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPhoneCountryCode, setUpdateVersionInfo } from './actions';
import { MiscState } from './types';

const initialState: MiscState = {
  phoneCountryCodeIndex: [],
};
export const miscSlice = createSlice({
  name: 'misc',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setUpdateVersionInfo.fulfilled, (state, action) => {
        state.versionInfo = action.payload;
      })
      .addCase(getPhoneCountryCode.fulfilled, (state, action) => {
        state.phoneCountryCodeIndex = action.payload;
      });
  },
});
