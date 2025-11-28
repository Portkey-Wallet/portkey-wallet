import { createSlice } from '@reduxjs/toolkit';

import { CryptoGiftStateType } from './type';
import { setRedPackageConfig } from './actions';

const initialState: CryptoGiftStateType = {
  redPackageConfigMap: {},
};
export const cryptoGiftSlice = createSlice({
  name: 'cryptoGift',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(setRedPackageConfig, (state, action) => {
      const { network, value } = action.payload;
      return {
        ...state,
        redPackageConfigMap: {
          ...state.redPackageConfigMap,
          [network]: value,
        },
      };
    });
  },
});

export default cryptoGiftSlice;
