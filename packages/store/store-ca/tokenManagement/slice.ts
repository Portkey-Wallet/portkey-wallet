import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ChainItemType } from '@portkey-wallet/types/chain';
import { AccountAssets, TokenItemType, TokenState } from '@portkey-wallet/types/types-ca/token';
import { AccountType } from '@portkey-wallet/types/wallet';
// import { isSameTypeToken } from '@portkey-wallet/utils/token';
import { fetchAllTokenListAsync, getSymbolImagesAsync } from './action';
import { TokenItemShowType } from '@portkey-wallet/types/types-eoa/token';

const initialState: TokenState = {
  // addedTokenData: {},
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
    addTokenInCurrentAccount: (
      state,
      action: PayloadAction<{
        tokenItem: TokenItemType;
        currentChain: ChainItemType;
        currentAccount: AccountType;
      }>,
    ) => {
      // const { tokenItem, currentChain } = action.payload;
      // const chainKey = currentChain.rpcUrl;
      // state.addedTokenData[chainKey].push(tokenItem);
      // state.tokenDataShowInMarket = state.tokenDataShowInMarket.map(ele => {
      //   return {
      //     ...ele,
      //     isAdded: isSameTypeToken(ele, tokenItem) ? true : ele.isAdded,
      //   };
      // });
      // state.addedTokenData = state.addedTokenData;
    },
    deleteTokenInCurrentAccount: (
      state,
      action: PayloadAction<{
        tokenItem: TokenItemType;
        currentChain: ChainItemType;
      }>,
    ) => {
      // const { tokenItem, currentChain } = action.payload;
      // const chainKey = currentChain.rpcUrl;
      // state.addedTokenData[chainKey] = state.addedTokenData[chainKey].filter(ele => !isSameTypeToken(ele, tokenItem));
      // state.tokenDataShowInMarket = state.tokenDataShowInMarket.map(ele => {
      //   return {
      //     ...ele,
      //     isAdded: isSameTypeToken(ele, tokenItem) ? false : ele.isAdded,
      //   };
      // });
      // state.addedTokenData = state.addedTokenData;
    },
    clearMarketToken: (state, action: PayloadAction<any>) => {
      console.log('initCurrentAccountToken');
      state.tokenDataShowInMarket = [];
    },
    resetToken: state => {
      // state.addedTokenData = {};
      state.tokenDataShowInMarket = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllTokenListAsync.pending, state => {
        state.isFetching = true;
        // state.status = 'loading';
      })
      .addCase(fetchAllTokenListAsync.fulfilled, (state, action) => {
        const { list, totalRecordCount } = action.payload;
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
        // state.tokenDataShowInMarket = [...state.tokenDataShowInMarket, ...tmpToken];
        // state.skipCount = tmpToken.length;
        // state.totalRecordCount = totalRecordCount;
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

export const { addTokenInCurrentAccount, deleteTokenInCurrentAccount, clearMarketToken, resetToken } =
  tokenManagementSlice.actions;

export default tokenManagementSlice;
