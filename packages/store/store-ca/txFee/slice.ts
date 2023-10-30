import { createSlice } from '@reduxjs/toolkit';
import { fetchTxFeeAsync, resetTxFee } from './actions';
import { TxFeeType } from './type';

const initialState: TxFeeType = {};

export const txFeeSlice = createSlice({
  name: 'txFee',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTxFeeAsync.fulfilled, (state, action) => {
        const { currentNetwork, fee } = action.payload;
        state[currentNetwork] = fee;
      })
      .addCase(fetchTxFeeAsync.rejected, () => {
        console.log('get txFee error');
      })
      .addCase(resetTxFee, (state, action) => {
        if (action.payload) {
          const txFeeValue = Object.assign({}, state);
          if (txFeeValue?.[action.payload]) delete txFeeValue[action.payload];
          state = txFeeValue;
        } else {
          state = initialState;
        }
      });
  },
});

export default txFeeSlice;
