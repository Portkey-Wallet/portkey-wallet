import { createSlice } from '@reduxjs/toolkit';
import { getPhoneCountryCode, setUpdateVersionInfo } from './actions';
import { MiscState } from './types';

const initialState: MiscState = {
  phoneCountryCodeIndexChainMap: {},
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
        state.phoneCountryCodeIndexChainMap = {
          ...state.phoneCountryCodeIndexChainMap,
          ...action.payload,
        };
      })
      .addCase(getPhoneCountryCode.rejected, (_state, action) => {
        console.log('getPhoneCountryCode error', action);
      });
  },
});
