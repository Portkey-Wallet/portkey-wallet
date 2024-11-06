import { createSlice } from '@reduxjs/toolkit';

import { TAwakenState } from './type';
import {
  updateAwakenGasFee,
  updateAwakenTokenPrices,
  updateAwakenUserExpiration,
  updateAwakenUserSlippageTolerance,
} from './actions';

const initialState: TAwakenState = {
  gasFee: {},
  userSlippageTolerance: {},
  userExpiration: {},
  tokenPrices: {},
};
export const imSlice = createSlice({
  name: 'awaken',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(updateAwakenGasFee, (state, action) => {
        const { network, gasFee } = action.payload;
        return {
          ...state,
          gasFee: {
            ...state.gasFee,
            [network]: gasFee,
          },
        };
      })
      .addCase(updateAwakenUserSlippageTolerance, (state, action) => {
        const { network, userSlippageTolerance } = action.payload;
        return {
          ...state,
          userSlippageTolerance: {
            ...state.userSlippageTolerance,
            [network]: userSlippageTolerance,
          },
        };
      })
      .addCase(updateAwakenUserExpiration, (state, action) => {
        const { network, userExpiration } = action.payload;
        return {
          ...state,
          userExpiration: {
            ...state.userExpiration,
            [network]: userExpiration,
          },
        };
      })
      .addCase(updateAwakenTokenPrices, (state, action) => {
        const { network, val } = action.payload;
        const preVal = state.tokenPrices[network] || {};

        return {
          ...state,
          tokenPrices: {
            ...state.tokenPrices,
            [network]: {
              ...preVal,
              ...val,
            },
          },
        };
      });
  },
});

export default imSlice;
