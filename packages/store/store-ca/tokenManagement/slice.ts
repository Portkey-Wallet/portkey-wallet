import { createSlice } from '@reduxjs/toolkit';
import { IUserTokenItemResponse, TokenItemShowType, TokenState } from '@portkey-wallet/types/types-ca/token';
import { fetchAllTokenListAsync, fetchAllTokenListV2Async, getSymbolImagesAsync, resetTokenInfo } from './action';

export const INITIAL_TOKEN_INFO = {
  tokenDataShowInMarket: [],
  skipCount: 0,
  maxResultCount: 1000,
  totalRecordCount: 0,
};

const initialState: TokenState = {
  ...INITIAL_TOKEN_INFO,
  isFetching: false,
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
      })
      .addCase(fetchAllTokenListAsync.fulfilled, (state, action) => {
        const { list, totalRecordCount, skipCount, maxResultCount, currentNetwork = 'MAINNET' } = action.payload;
        const preTokenDataShowInMarket = state.tokenInfo?.[currentNetwork]?.tokenDataShowInMarket || [];
        if (skipCount !== 0 && preTokenDataShowInMarket?.length === totalRecordCount) return;
        const tmpToken: TokenItemShowType[] = list.map(item => ({
          isAdded: item.isDisplay,
          isDefault: item.isDefault,
          userTokenId: item?.id,
          chainId: item.chainId,
          decimals: item.decimals,
          address: item.address,
          symbol: item.symbol,
          tokenName: item.symbol,
          id: item?.id,
          name: item?.symbol,
          imageUrl: item.imageUrl,
          label: item.label,
          displayChainName: item.displayChainName,
          chainImageUrl: item.chainImageUrl,
        }));
        const newList = skipCount === 0 ? tmpToken : [...preTokenDataShowInMarket, ...tmpToken];
        if (!state.tokenInfo) state.tokenInfo = {};
        state.tokenInfo[currentNetwork] = {
          tokenDataShowInMarket: newList,
          totalRecordCount,
          skipCount,
          maxResultCount,
          isFetching: false,
        };
        state.isFetching = false;
      })
      .addCase(fetchAllTokenListAsync.rejected, state => {
        state.isFetching = false;
      })
      .addCase(fetchAllTokenListV2Async.pending, state => {
        state.isFetching = true;
      })
      .addCase(fetchAllTokenListV2Async.fulfilled, (state, action) => {
        const { list, totalRecordCount, skipCount, maxResultCount, currentNetwork = 'MAINNET' } = action.payload;
        const preTokenDataShowInMarket = state.tokenInfoV2?.[currentNetwork]?.tokenDataShowInMarket || [];
        if (skipCount !== 0 && preTokenDataShowInMarket?.length === totalRecordCount) return;
        const tmpToken: IUserTokenItemResponse[] = list.map(item => ({
          tokens: item.tokens,
          symbol: item.symbol,
          displayStatus: item.displayStatus,
          label: item.label,
          imageUrl: item.imageUrl,
          isDefault: item.isDefault,
        }));
        const newList = skipCount === 0 ? tmpToken : [...preTokenDataShowInMarket, ...tmpToken];
        if (!state.tokenInfoV2) state.tokenInfoV2 = {};
        state.tokenInfoV2[currentNetwork] = {
          tokenDataShowInMarket: newList,
          totalRecordCount,
          skipCount,
          maxResultCount,
          isFetching: false,
        };
        state.isFetching = false;
      })
      .addCase(fetchAllTokenListV2Async.rejected, state => {
        state.isFetching = false;
      })
      .addCase(resetTokenInfo, (state, action) => {
        const tokenInfo = state.tokenInfo;
        if (tokenInfo?.[action.payload]) delete tokenInfo[action.payload];
        state.tokenInfo = tokenInfo;
      })
      .addCase(getSymbolImagesAsync.fulfilled, (state, action) => {
        state.symbolImages = {
          ...state.symbolImages,
          ...action.payload,
        };
      })
      .addCase(getSymbolImagesAsync.rejected, (_state, action) => {
        console.log('getSymbolImagesAsync:rejected', action);
      });
  },
});

export const { clearMarketToken, resetToken, resetTokenManagement } = tokenManagementSlice.actions;

export default tokenManagementSlice;
