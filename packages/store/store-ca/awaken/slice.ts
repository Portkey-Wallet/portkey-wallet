import { createSlice } from '@reduxjs/toolkit';

import { TAwakenState } from './type';
import { updateAwakenGasFee } from './actions';

const initialState: TAwakenState = {
  gasFee: {},
};
export const imSlice = createSlice({
  name: 'awaken',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(updateAwakenGasFee, (state, action) => {
      const { network, gasFee } = action.payload;
      return {
        ...state,
        gasFee: {
          ...state.gasFee,
          [network]: gasFee,
        },
      };
    });
  },
});

export default imSlice;
