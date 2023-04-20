import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '@portkey-wallet/api/api-did';

export type SwitchStateTypes = {
  isShowBuyFeature: boolean;
};

const initialState: SwitchStateTypes = {
  isShowBuyFeature: false,
};

export const fetchIsShowBuyFeatureAsync = createAsyncThunk('fetchTokenListAsync', async () => {
  const result = await request.switch.checkButtonBuy({});
  return result.data;
});

export const switchSlice = createSlice({
  name: 'switch',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchIsShowBuyFeatureAsync.fulfilled, (state, action) => {
      state.isShowBuyFeature = action.payload;
    });
  },
});

export default switchSlice;
