import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { request } from 'packages/api/api-did';

export type SwitchStateTypes = {
  isShowBuyFeature: boolean;
};

const initialState: SwitchStateTypes = {
  isShowBuyFeature: false,
};

export const fetchIsShowBuyFeatureAsync = createAsyncThunk('fetchIsShowBuyFeatureAsync', async () => {
  const result = await request.switch.checkButtonBuy({
    params: {
      switchName: 'ramp',
    },
  });

  return result.isOpen;
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
