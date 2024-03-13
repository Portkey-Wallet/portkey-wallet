import { createSlice } from '@reduxjs/toolkit';
import { fetchBuyFiatListAsync, fetchSellFiatListAsync, resetPayment, setAchTokenInfo } from './actions';
import { PaymentStateType } from './type';

const initialState: PaymentStateType = {
  buyFiatList: [],
  sellFiatList: [],
  achTokenInfo: undefined,
};
export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBuyFiatListAsync.fulfilled, (state, action) => {
        state.buyFiatList = action.payload;
      })
      .addCase(fetchBuyFiatListAsync.rejected, (_state, action) => {
        console.log('fetchBuyFiatListAsync.rejected: error', action.error.message);
      })
      .addCase(fetchSellFiatListAsync.fulfilled, (state, action) => {
        state.sellFiatList = action.payload;
      })
      .addCase(fetchSellFiatListAsync.rejected, (_state, action) => {
        console.log('fetchSellFiatListAsync.rejected: error', action.error.message);
      })
      .addCase(setAchTokenInfo, (state, action) => {
        state.achTokenInfo = action.payload;
      })
      .addCase(resetPayment, state => {
        state.achTokenInfo = undefined;
      });
  },
});
