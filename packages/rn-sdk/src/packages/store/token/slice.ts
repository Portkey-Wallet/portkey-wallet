import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ChainItemType } from 'packages/types/chain';
import { TokenItemType, TokenState } from 'packages/types/types-eoa/token';
import { AccountType } from 'packages/types/wallet';
import { fetchTokenList } from './api';
import { isSameTypeToken } from 'packages/utils/token';

const initialState: TokenState = {
  addedTokenData: {},
  tokenDataShowInMarket: [],
  isFetchingTokenList: false,
};

export const fetchTokenListAsync = createAsyncThunk(
  'token/fetchTokenList',
  async ({
    pageNo,
    pageSize,
    currentChain,
    currentAccount,
  }: {
    pageNo: number;
    pageSize: number;
    currentChain: any;
    currentAccount: any;
  }) => {
    const response = await fetchTokenList({ pageNo, pageSize, chainId: 'currentChain' });
    return { list: response.data, currentChain, currentAccount };
  },
);

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const tokenSlice = createSlice({
  name: 'token',
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
      const { tokenItem, currentChain, currentAccount } = action.payload;
      const chainKey = currentChain.rpcUrl;
      const accountKey = currentAccount.address;

      state.addedTokenData[chainKey][accountKey].push(tokenItem);
      state.tokenDataShowInMarket = state.tokenDataShowInMarket.map(ele => {
        return {
          ...ele,
          isAdded: isSameTypeToken(ele, tokenItem) ? true : ele.isAdded,
        };
      });
      // eslint-disable-next-line no-self-assign
      state.addedTokenData = state.addedTokenData;
    },
    deleteTokenInCurrentAccount: (
      state,
      action: PayloadAction<{
        tokenItem: TokenItemType;
        currentChain: ChainItemType;
        currentAccount: AccountType;
      }>,
    ) => {
      const { tokenItem, currentChain, currentAccount } = action.payload;
      const chainKey = currentChain.rpcUrl;
      const accountKey = currentAccount.address;

      state.addedTokenData[chainKey][accountKey] = state.addedTokenData[chainKey][accountKey].filter(
        ele => !isSameTypeToken(ele, tokenItem),
      );

      state.tokenDataShowInMarket = state.tokenDataShowInMarket.map(ele => {
        return {
          ...ele,
          isAdded: isSameTypeToken(ele, tokenItem) ? false : ele.isAdded,
        };
      });

      // eslint-disable-next-line no-self-assign
      state.addedTokenData = state.addedTokenData;
    },
    clearMarketToken: state => {
      console.log('initCurrentAccountToken');
      state.tokenDataShowInMarket = [];
    },
    resetToken: state => {
      state.addedTokenData = {};
      state.tokenDataShowInMarket = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTokenListAsync.pending, state => {
        state.isFetchingTokenList = true;
        // state.status = 'loading';
      })
      .addCase(fetchTokenListAsync.fulfilled, (state, action) => {
        const { list, currentChain, currentAccount } = action.payload;
        const chainKey = currentChain.rpcUrl;
        const accountKey = currentAccount.address;

        const defaultItemList = list.filter(ele => ele.isDefault);

        // init currentAccount tokenList
        if (!state.addedTokenData[chainKey]) {
          state.addedTokenData[chainKey] = {};
        }

        if (!state.addedTokenData[chainKey][accountKey]) {
          state.addedTokenData[chainKey][accountKey] = defaultItemList;
        }

        const newShowListByPage = list.map((ele: TokenItemType) => {
          return {
            ...ele,
            isAdded: !!(state?.addedTokenData[chainKey][accountKey] ?? []).find(token => isSameTypeToken(token, ele)),
          };
        });

        state.tokenDataShowInMarket = [...state.tokenDataShowInMarket, ...newShowListByPage];
        state.isFetchingTokenList = false;
      })
      .addCase(fetchTokenListAsync.rejected, state => {
        state.isFetchingTokenList = false;
        // state.status = 'failed';
      });
  },
});

export const { addTokenInCurrentAccount, deleteTokenInCurrentAccount, clearMarketToken, resetToken } =
  tokenSlice.actions;

export default tokenSlice;
