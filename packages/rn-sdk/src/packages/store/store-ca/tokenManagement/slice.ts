import { createSlice } from '@reduxjs/toolkit';
import { TokenState } from 'packages/types/types-ca/token';
import { fetchAllTokenListAsync, getSymbolImagesAsync } from './action';
import { TokenItemShowType } from 'packages/types/types-eoa/token';

const initialState: TokenState = {
  tokenDataShowInMarket: [],
  isFetching: false,
  skipCount: 0,
  maxResultCount: 1000,
  totalRecordCount: 0,
  symbolImages: {},
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const tokenManagementSlice = createSlice({
  name: 'tokenManagement',
  initialState,
  reducers: {
    clearMarketToken: state => {
      console.log('initCurrentAccountToken');
      state.tokenDataShowInMarket = [];
    },
    resetToken: state => {
      state.tokenDataShowInMarket = [];
    },
    resetTokenManagement: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllTokenListAsync.pending, state => {
        state.isFetching = true;
        // state.status = 'loading';
      })
      .addCase(fetchAllTokenListAsync.fulfilled, (state, action) => {
        const { list } = action.payload;
        const tmpToken: TokenItemShowType[] = list.map(item => ({
          isAdded: item.isDisplay,
          isDefault: item.isDefault,
          userTokenId: item.id,
          chainId: item.token.chainId,
          decimals: item.token.decimals,
          address: item.token.address,
          symbol: item.token.symbol,
          tokenName: item.token.symbol,
          id: item.token.id,
          name: item.token.symbol,
        }));

        state.tokenDataShowInMarket = tmpToken;
        state.isFetching = false;
      })
      .addCase(fetchAllTokenListAsync.rejected, state => {
        state.isFetching = false;
        // state.status = 'failed';
      })
      .addCase(getSymbolImagesAsync.fulfilled, (state, action) => {
        state.symbolImages = action.payload;
      })
      .addCase(getSymbolImagesAsync.rejected, (_state, action) => {
        console.log('getSymbolImagesAsync:rejected', action);
      });
  },
});

export const { clearMarketToken, resetToken, resetTokenManagement } = tokenManagementSlice.actions;

export default tokenManagementSlice;
