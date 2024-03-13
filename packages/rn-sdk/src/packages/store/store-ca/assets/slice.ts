import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { NFTCollectionItemShowType } from 'packages/types/types-ca/assets';
import { fetchAssetList, fetchNFTSeriesList, fetchNFTList, fetchTokenList, fetchTokenPrices } from './api';
import { AccountAssets, TokenItemShowType } from 'packages/types/types-ca/token';
import { ChainId } from 'packages/types';
import { NEW_CLIENT_MOCK_ELF_LIST, PAGE_SIZE_IN_NFT_ITEM } from 'packages/constants/constants-ca/assets';
import { ZERO } from 'packages/constants/misc';
import { formatAmountShow } from 'packages/utils/converter';

// asset = token + nft
export type AssetsStateType = {
  accountToken: {
    isFetching: boolean;
    skipCount: number;
    maxResultCount: number;
    accountTokenList: TokenItemShowType[];
    totalRecordCount: number;
  };
  accountNFT: {
    isFetching: boolean;
    skipCount: number;
    maxResultCount: number;
    accountNFTList: NFTCollectionItemShowType[];
    totalRecordCount: number;
  };
  tokenPrices: {
    isFetching: boolean;
    tokenPriceObject: {
      [symbol: string]: number | string;
    };
  };
  accountAssets: {
    isFetching: boolean;
    skipCount: number;
    maxResultCount: number;
    accountAssetsList: AccountAssets;
    totalRecordCount: number;
  };
  accountBalance: number | string;
};

const initialState: AssetsStateType = {
  accountToken: {
    isFetching: false,
    skipCount: 0,
    maxResultCount: 10,
    accountTokenList: NEW_CLIENT_MOCK_ELF_LIST,
    totalRecordCount: 0,
  },
  accountNFT: {
    isFetching: false,
    skipCount: 0,
    maxResultCount: 10,
    accountNFTList: [],
    totalRecordCount: 0,
  },
  accountAssets: {
    isFetching: false,
    skipCount: 0,
    maxResultCount: 1000,
    accountAssetsList: [],
    totalRecordCount: 0,
  },
  tokenPrices: {
    isFetching: false,
    tokenPriceObject: {},
  },
  accountBalance: 0,
};

// fetch tokenList on Dashboard
export const fetchTokenListAsync = createAsyncThunk(
  'fetchTokenListAsync',
  async ({
    caAddresses,
    caAddressInfos,
    skipCount = 0,
    maxResultCount = 1000,
  }: {
    caAddresses: string[];
    caAddressInfos: { chainId: ChainId; caAddress: string }[];
    skipCount?: number;
    maxResultCount?: number;
  }) => {
    // if (totalRecordCount === 0 || totalRecordCount > accountTokenList.length) {
    const response = await fetchTokenList({ caAddresses, caAddressInfos, skipCount, maxResultCount });

    // mock data fro new account
    if (response.data.length === 0) {
      return { list: NEW_CLIENT_MOCK_ELF_LIST, totalRecordCount: NEW_CLIENT_MOCK_ELF_LIST.length };
    }

    return { list: response.data, totalRecordCount: response.totalRecordCount };
  },
);

// fetch nftSeriesList on Dashboard
export const fetchNFTCollectionsAsync = createAsyncThunk(
  'fetchNFTCollectionsAsync',
  async ({
    caAddresses,
    caAddressInfos,
    maxNFTCount = PAGE_SIZE_IN_NFT_ITEM,
  }: {
    caAddresses: string[];
    caAddressInfos: { chainId: ChainId; caAddress: string }[];
    maxNFTCount?: number;
  }) => {
    const response = await fetchNFTSeriesList({ caAddresses, caAddressInfos, skipCount: 0 });
    return { list: response.data, totalRecordCount: response.totalRecordCount, maxNFTCount };
  },
);

// fetch current nftSeries on Dashboard
export const fetchNFTAsync = createAsyncThunk(
  'fetchNFTAsync',
  async (
    {
      symbol,
      caAddresses,
      caAddressInfos,
      chainId,
      pageNum = 0,
    }: {
      symbol: string;
      caAddresses: string[];
      caAddressInfos: { chainId: ChainId; caAddress: string }[];
      chainId: ChainId;
      pageNum: number;
    },
    { getState },
  ) => {
    const { assets } = getState() as { assets: AssetsStateType };
    const {
      accountNFT: { accountNFTList },
    } = assets;
    const targetNFTCollection = accountNFTList.find(item => item.symbol === symbol && item.chainId === chainId);
    if (!targetNFTCollection) return;

    const { skipCount, maxResultCount, totalRecordCount, children } = targetNFTCollection;

    // has cache data
    if ((pageNum + 1) * maxResultCount <= children.length) return;

    if (totalRecordCount === 0 || Number(totalRecordCount) > children.length) {
      const response = await fetchNFTList({ symbol, caAddresses, caAddressInfos, skipCount, maxResultCount });
      return { symbol, chainId, list: response.data, totalRecordCount: response.totalRecordCount, skipCount };
    }
    return { symbol, chainId, list: [], totalRecordCount, skipCount };
  },
);

// fetch current assets when add sent button
export const fetchAssetAsync = createAsyncThunk(
  'fetchAssetsAsync',
  async ({
    caAddresses,
    keyword,
    caAddressInfos,
  }: {
    caAddresses: string[];
    keyword: string;
    caAddressInfos: { chainId: ChainId; caAddress: string }[];
  }) => {
    // const { assets } = getState() as { assets: AssetsStateType };
    // const {
    //   accountAssets: { totalRecordCount, accountAssetsList },
    // } = assets;

    // if (totalRecordCount === 0 || totalRecordCount > accountAssetsList.length) {
    const response = await fetchAssetList({ caAddresses, caAddressInfos, keyword, skipCount: 0, maxResultCount: 1000 });

    return { list: response.data, totalRecordCount: response.totalRecordCount };
    // }

    // return { list: [], totalRecordCount };
  },
);

// fetch current tokenRate
export const fetchTokensPriceAsync = createAsyncThunk(
  'fetchTokensPriceAsync',
  async ({ symbols }: { symbols?: string[] }, { getState }) => {
    const {
      assets: {
        accountToken: { accountTokenList },
      },
    } = getState() as { assets: AssetsStateType };
    // const {
    //   accountAssets: { totalRecordCount, accountAssetsList },
    // } = assets;

    const response = await fetchTokenPrices({ symbols: symbols || accountTokenList.map(ele => ele.symbol) });

    return { list: response.items };

    // return { list: [], totalRecordCount };
  },
);

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    resetAssets: () => initialState,
    clearNftItem: (state, action: PayloadAction<any>) => {
      const { symbol, chainId } = action.payload;

      if (symbol && chainId) {
        const newAccountNFTList = state.accountNFT.accountNFTList.map(item =>
          item.symbol === symbol && item.chainId === chainId
            ? {
                ...item,
                skipCount: 0,
                maxResultCount: 9,
                totalRecordCount: 0,
                children: [],
              }
            : item,
        );

        state.accountNFT.accountNFTList = newAccountNFTList;
      }
    },
    // about handle the NFT
    clearNftCollection: state => {
      state.accountNFT = initialState.accountNFT;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTokenListAsync.pending, state => {
        state.accountToken.isFetching = true;
        // state.status = 'loading';
      })
      .addCase(fetchTokenListAsync.fulfilled, (state, action) => {
        const { list, totalRecordCount } = action.payload;

        // get token Price && calc total
        const priceObj: Record<string, string | number> = {};
        const totalBalanceInUsd = list.reduce((acc, ele) => {
          if (ele.symbol) priceObj[ele.symbol] = ele.price ?? 0;
          return acc.plus(ele?.balanceInUsd ?? ZERO);
        }, ZERO);

        state.accountBalance = formatAmountShow(totalBalanceInUsd, 2);
        state.tokenPrices.tokenPriceObject = { ...state.tokenPrices.tokenPriceObject, ...priceObj };

        state.accountToken.accountTokenList = list as [];
        state.accountToken.skipCount = state.accountToken.accountTokenList.length;
        state.accountToken.totalRecordCount = totalRecordCount;
        state.accountToken.isFetching = false;
      })
      .addCase(fetchTokenListAsync.rejected, state => {
        state.accountToken.isFetching = false;
      })
      .addCase(fetchNFTCollectionsAsync.pending, state => {
        state.accountToken.isFetching = true;
      })
      .addCase(fetchNFTCollectionsAsync.fulfilled, (state, action) => {
        const { list, totalRecordCount, maxNFTCount } = action.payload;
        const newAccountList: NFTCollectionItemShowType[] = list.map(item => ({
          isFetching: false,
          skipCount: 0,
          maxResultCount: maxNFTCount,
          totalRecordCount: 0,
          children: [],
          ...item,
        }));
        state.accountNFT.accountNFTList = newAccountList;
        // state.accountNFT.accountNFTList = [...state.accountNFT.accountNFTList, ...newAccountList];
        // state.accountNFT.skipCount = state.accountNFT.accountNFTList.length;
        state.accountNFT.totalRecordCount = totalRecordCount;
        state.accountNFT.isFetching = false;
      })
      .addCase(fetchNFTAsync.pending, state => {
        state.accountToken.isFetching = true;
      })
      .addCase(fetchNFTAsync.fulfilled, (state, action) => {
        if (!action.payload) return;
        const { list, totalRecordCount, symbol, chainId, skipCount } = action.payload;
        const currentNFTSeriesItem = state.accountNFT.accountNFTList.find(
          ele => ele.symbol === symbol && ele.chainId === chainId,
        );
        if (currentNFTSeriesItem) {
          if (currentNFTSeriesItem?.children?.length > skipCount) return;
          currentNFTSeriesItem.children = [...currentNFTSeriesItem.children, ...list];
          currentNFTSeriesItem.skipCount = currentNFTSeriesItem.children.length;
          currentNFTSeriesItem.totalRecordCount = totalRecordCount;
          currentNFTSeriesItem.isFetching = false;
        }
      })
      .addCase(fetchNFTAsync.rejected, state => {
        state.accountToken.isFetching = false;
      })
      .addCase(fetchAssetAsync.pending, state => {
        state.accountToken.isFetching = true;
        // state.status = 'loading';
      })
      .addCase(fetchAssetAsync.fulfilled, (state, action) => {
        const { list, totalRecordCount } = action.payload;

        state.accountAssets.accountAssetsList = list as AccountAssets;
        // state.accountAssets.accountAssetsList = [...state.accountAssets.accountAssetsList, ...list];
        state.accountAssets.skipCount = state.accountAssets.accountAssetsList.length;
        state.accountAssets.totalRecordCount = totalRecordCount;
        state.accountAssets.isFetching = false;
      })
      .addCase(fetchAssetAsync.rejected, state => {
        state.accountToken.isFetching = false;
      })
      .addCase(fetchTokensPriceAsync.pending, state => {
        state.accountToken.isFetching = true;
      })
      .addCase(fetchTokensPriceAsync.fulfilled, (state, action) => {
        const { list } = action.payload;

        list.map(ele => {
          state.tokenPrices.tokenPriceObject[ele?.symbol] = ele?.priceInUsd;
        });
        // state.accountAssets.accountAssetsList = [...state.accountAssets.accountAssetsList, ...list];
        state.accountAssets.skipCount = state.accountAssets.accountAssetsList.length;
        state.accountAssets.isFetching = false;
      })
      .addCase(fetchTokensPriceAsync.rejected, state => {
        state.accountToken.isFetching = false;
      });
  },
});

export const { clearNftItem, resetAssets, clearNftCollection } = assetsSlice.actions;

export default assetsSlice;
