import { NetworkType } from '@portkey-wallet/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setUpdateVersionInfo } from './actions';
import { MiscState } from './types';

const initialState: MiscState = {};
export const miscSlice = createSlice({
  name: 'misc',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(setUpdateVersionInfo.fulfilled, (state, action) => {
      state.versionInfo = action.payload;
    });
  },
});
