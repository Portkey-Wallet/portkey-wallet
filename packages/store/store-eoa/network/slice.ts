import { createSlice } from '@reduxjs/toolkit';
import { TNetworkState } from './type';
import { setChainList, setCurrentNetwork } from './actions';

const initialState: TNetworkState = {
  currentNetwork: 'MAINNET',
  chainListMap: {},
};
export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setCurrentNetwork, (state, action) => {
        const { currentNetwork } = action.payload;
        return {
          ...state,
          currentNetwork,
        };
      })
      .addCase(setChainList, (state, action) => {
        const { network, chainList } = action.payload;
        return {
          ...state,
          chainListMap: {
            ...state.chainListMap,
            [network]: chainList,
          },
        };
      });
  },
});
