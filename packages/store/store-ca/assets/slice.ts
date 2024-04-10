import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { NFTCollectionItemShowType } from '@portkey-wallet/types/types-ca/assets';
import {
  fetchAssetList,
  fetchCryptoBoxAssetList,
  fetchNFTSeriesList,
  fetchNFTList,
  fetchTokenList,
  fetchTokenPrices,
  fetchTokenBalance,
} from './api';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { TAssetsState } from './type';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { NEW_CLIENT_MOCK_ELF_LIST, PAGE_SIZE_IN_NFT_ITEM } from '@portkey-wallet/constants/constants-ca/assets';
import { WalletState } from '../wallet/type';

export const INIT_ACCOUNT_TOKEN_INFO = {
  skipCount: 0,
  maxResultCount: 10,
  accountTokenList: NEW_CLIENT_MOCK_ELF_LIST,
  totalRecordCount: 0,
};

export const INIT_ACCOUNT_NFT_INFO = {
  skipCount: 0,
  maxResultCount: 10,
  accountNFTList: [],
  totalRecordCount: 0,
};

export const INIT_ACCOUNT_ASSETS_INFO = {
  skipCount: 0,
  maxResultCount: 1000,
  accountAssetsList: [],
  totalRecordCount: 0,
};

const initialState: TAssetsState = {
  accountToken: {
    ...INIT_ACCOUNT_TOKEN_INFO,
    isFetching: false,
  },
  accountNFT: {
    ...INIT_ACCOUNT_NFT_INFO,
    isFetching: false,
  },
  accountAssets: {
    ...INIT_ACCOUNT_ASSETS_INFO,
    isFetching: false,
  },
  accountCryptoBoxAssets: {
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
  accountBalance: {},
};

// fetch tokenList on Dashboard
export const fetchTokenListAsync = createAsyncThunk(
  'fetchTokenListAsync',
  async (
    {
      caAddressInfos,
      skipCount = 0,
      maxResultCount = 1000,
      currentNetwork,
    }: {
      caAddressInfos: { chainId: ChainId; caAddress: string }[];
      skipCount?: number;
      maxResultCount?: number;
      currentNetwork?: NetworkType;
    },
    { getState },
  ) => {
    const { wallet } = getState() as { wallet: WalletState };
    currentNetwork = currentNetwork || wallet.currentNetwork || 'MAINNET';
    const response = await fetchTokenList({ caAddressInfos, skipCount, maxResultCount });

    // mock data fro new account
    if (response.data.length === 0) {
      return {
        list: NEW_CLIENT_MOCK_ELF_LIST,
        totalRecordCount: NEW_CLIENT_MOCK_ELF_LIST.length,
        skipCount,
        maxResultCount,
        currentNetwork,
        totalBalanceInUsd: '',
      };
    }

    return {
      list: response.data,
      totalRecordCount: response.totalRecordCount,
      skipCount,
      maxResultCount,
      currentNetwork,
      totalBalanceInUsd: response.totalBalanceInUsd,
    };
  },
);

// fetch nftCollectionList on Dashboard
export const fetchNFTCollectionsAsync = createAsyncThunk(
  'fetchNFTCollectionsAsync',
  async (
    {
      caAddressInfos,
      maxNFTCount = PAGE_SIZE_IN_NFT_ITEM,
      skipCount = 0,
      maxResultCount = 1000,
      currentNetwork,
    }: {
      caAddressInfos: { chainId: ChainId; caAddress: string }[];
      maxNFTCount?: number;
      skipCount?: number;
      maxResultCount?: number;
      currentNetwork?: NetworkType;
    },
    { getState },
  ) => {
    const { wallet } = getState() as { wallet: WalletState };
    currentNetwork = currentNetwork || wallet.currentNetwork || 'MAINNET';
    const response = await fetchNFTSeriesList({ caAddressInfos, skipCount, maxResultCount });
    return {
      list: response.data,
      totalRecordCount: response.totalRecordCount,
      maxNFTCount,
      skipCount,
      maxResultCount,
      currentNetwork,
    };
  },
);

// fetch current nftItem on Dashboard
export const fetchNFTAsync = createAsyncThunk(
  'fetchNFTAsync',
  async (
    {
      symbol,
      caAddressInfos,
      chainId,
      pageNum = 0,
      currentNetwork,
    }: {
      symbol: string;
      caAddressInfos: { chainId: ChainId; caAddress: string }[];
      chainId: ChainId;
      pageNum: number;
      currentNetwork?: NetworkType;
    },
    { getState },
  ) => {
    const { assets, wallet } = getState() as { assets: TAssetsState; wallet: WalletState };
    const {
      accountNFT: { accountNFTInfo },
    } = assets;
    currentNetwork = currentNetwork || wallet.currentNetwork || 'MAINNET';
    const preAccountNFTCollectionList = accountNFTInfo?.[currentNetwork]?.accountNFTList || [];
    const targetNFTCollection = preAccountNFTCollectionList.find(
      item => item.symbol === symbol && item.chainId === chainId,
    );
    if (!targetNFTCollection) return;

    const { skipCount, maxResultCount, totalRecordCount, children } = targetNFTCollection;

    // has cache data
    if ((pageNum + 1) * maxResultCount <= children.length) return;

    if (totalRecordCount === 0 || Number(totalRecordCount) > children.length) {
      const response = await fetchNFTList({ symbol, caAddressInfos, skipCount, maxResultCount });
      return {
        symbol,
        chainId,
        list: response.data,
        totalRecordCount: response.totalRecordCount,
        skipCount,
        currentNetwork,
      };
    }
    return { symbol, chainId, list: [], totalRecordCount, skipCount, currentNetwork };
  },
);

// fetch current assets when add sent button
export const fetchAssetAsync = createAsyncThunk(
  'fetchAssetsAsync',
  async (
    {
      keyword,
      caAddressInfos,
      skipCount = 0,
      maxResultCount = 1000,
      currentNetwork,
    }: {
      keyword: string;
      caAddressInfos: { chainId: ChainId; caAddress: string }[];
      skipCount?: number;
      maxResultCount?: number;
      currentNetwork?: NetworkType;
    },
    { getState },
  ) => {
    const { wallet } = getState() as { wallet: WalletState };
    currentNetwork = currentNetwork || wallet.currentNetwork || 'MAINNET';
    const response = await fetchAssetList({ caAddressInfos, keyword, skipCount, maxResultCount });

    return {
      list: response.data,
      totalRecordCount: response.totalRecordCount,
      keyword,
      skipCount,
      maxResultCount,
      currentNetwork,
    };
  },
);

// fetch current cryptoBox assets when add sent button
export const fetchCryptoBoxAssetAsync = createAsyncThunk(
  'fetchCryptoBoxAssetAsync',
  async ({
    keyword,
    caAddressInfos,
  }: {
    keyword: string;
    caAddressInfos: { chainId: ChainId; caAddress: string }[];
  }) => {
    const response = await fetchCryptoBoxAssetList({ caAddressInfos, keyword, skipCount: 0, maxResultCount: 1000 });

    return { list: response.data, totalRecordCount: response.totalRecordCount, keyword };
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
    } = getState() as { assets: TAssetsState };

    const response = await fetchTokenPrices({ symbols: symbols || accountTokenList.map(ele => ele.symbol) });

    return { list: response.items };
  },
);

// fetch tokenBalance
export const fetchTargetTokenBalanceAsync = createAsyncThunk(
  'fetchTargetTokenBalanceAsync',
  async ({
    symbol,
    chainId,
    currentCaAddress = '',
    currentNetwork,
  }: {
    symbol: string;
    chainId: ChainId;
    currentCaAddress: string;
    currentNetwork?: NetworkType;
  }) => {
    const response = await fetchTokenBalance({ symbol, chainId, currentCaAddress });
    return { symbol, chainId, response, currentNetwork };
  },
);

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    resetAssets: () => initialState,
    clearNftItem: (state, action: PayloadAction<{ symbol?: string; chainId?: ChainId; network?: NetworkType }>) => {
      const { symbol, chainId, network = 'MAINNET' } = action.payload;

      if (symbol && chainId) {
        const preNFTCollection = state.accountNFT?.accountNFTInfo?.[network]?.accountNFTList || [];
        const newAccountNFTList = preNFTCollection.map(item =>
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

        state.accountNFT.accountNFTInfo = {
          ...state.accountNFT.accountNFTInfo,
          [network]: {
            ...INIT_ACCOUNT_NFT_INFO,
            ...state.accountNFT.accountNFTInfo?.[network],
            accountNFTList: newAccountNFTList,
          },
        };
      }
    },
    // about handle the NFT
    clearAccountNftCollectionInfo: (state, action: PayloadAction<NetworkType>) => {
      const NFTCollectionInfo = state.accountNFT.accountNFTInfo;
      if (NFTCollectionInfo?.[action.payload]) delete NFTCollectionInfo[action.payload];
      state.accountNFT.accountNFTInfo = NFTCollectionInfo;
    },
    clearAccountTokenInfo: (state, action: PayloadAction<NetworkType>) => {
      const tokenInfo = state.accountToken.accountTokenInfo;
      if (tokenInfo?.[action.payload]) delete tokenInfo[action.payload];
      state.accountToken.accountTokenInfo = tokenInfo;
    },
    clearAccountAssetsInfo: (state, action: PayloadAction<NetworkType>) => {
      const assetsInfo = state.accountAssets.accountAssetsInfo;
      if (assetsInfo?.[action.payload]) delete assetsInfo[action.payload];
      state.accountAssets.accountAssetsInfo = assetsInfo;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTokenListAsync.pending, state => {
        state.accountToken.isFetching = true;
      })
      .addCase(fetchTokenListAsync.fulfilled, (state, action) => {
        const {
          list,
          totalRecordCount,
          skipCount,
          maxResultCount,
          currentNetwork,
          totalBalanceInUsd = '',
        } = action.payload;
        const preAccountTokenList = state.accountToken.accountTokenInfo?.[currentNetwork]?.accountTokenList || [];
        if (skipCount !== 0 && preAccountTokenList.length === totalRecordCount) {
          state.accountToken.isFetching = false;
          return;
        }
        // get token Price
        const priceObj: Record<string, string | number> = {};
        list.forEach(ele => {
          if (ele.symbol) priceObj[ele.symbol] = ele.price ?? 0;
        });

        state.accountBalance = {
          accountBalanceInfo: {
            ...(state.accountBalance?.accountBalanceInfo || {}),
            [currentNetwork]: totalBalanceInUsd,
          },
        };

        const newTokenList = skipCount === 0 ? list : [...preAccountTokenList, ...list];
        state.tokenPrices.tokenPriceObject = { ...state.tokenPrices.tokenPriceObject, ...priceObj };

        if (!state.accountToken.accountTokenInfo) state.accountToken.accountTokenInfo = {};
        state.accountToken.accountTokenInfo[currentNetwork] = {
          accountTokenList: newTokenList as TokenItemShowType[],
          skipCount,
          totalRecordCount,
          maxResultCount,
        };
        state.accountToken.isFetching = false;
      })
      .addCase(fetchTokenListAsync.rejected, state => {
        state.accountToken.isFetching = false;
      })
      .addCase(fetchNFTCollectionsAsync.pending, state => {
        state.accountNFT.isFetching = true;
      })
      .addCase(fetchNFTCollectionsAsync.rejected, state => {
        state.accountNFT.isFetching = false;
      })
      .addCase(fetchNFTCollectionsAsync.fulfilled, (state, action) => {
        const { list, totalRecordCount, maxNFTCount, skipCount, maxResultCount, currentNetwork } = action.payload;
        const preAccountNFTCollectionList = state.accountNFT.accountNFTInfo?.[currentNetwork]?.accountNFTList || [];
        if (skipCount !== 0 && preAccountNFTCollectionList.length === totalRecordCount) {
          state.accountNFT.isFetching = false;
          return;
        }
        const newAccountList: NFTCollectionItemShowType[] = list.map(item => ({
          isFetching: false,
          skipCount: 0,
          maxResultCount: maxNFTCount,
          totalRecordCount: 0,
          children: [],
          ...item,
        }));
        const newAllAccountList =
          skipCount === 0 ? newAccountList : [...preAccountNFTCollectionList, ...newAccountList];
        if (!state.accountNFT.accountNFTInfo) state.accountNFT.accountNFTInfo = {};
        state.accountNFT.accountNFTInfo[currentNetwork] = {
          accountNFTList: newAllAccountList,
          skipCount,
          totalRecordCount,
          maxResultCount,
        };
        state.accountNFT.isFetching = false;
      })
      .addCase(fetchNFTAsync.pending, (state, action) => {
        if (!action.meta.arg) return;
        const { symbol, chainId, currentNetwork = 'MAINNET' } = action.meta.arg;
        const preNFTCollection = state.accountNFT.accountNFTInfo?.[currentNetwork]?.accountNFTList;
        const currentNFTSeriesItem = preNFTCollection?.find(ele => ele.symbol === symbol && ele.chainId === chainId);
        if (currentNFTSeriesItem) {
          currentNFTSeriesItem.isFetching = true;
        }
      })
      .addCase(fetchNFTAsync.fulfilled, (state, action) => {
        if (!action.meta.arg) return;
        const { symbol, chainId, currentNetwork = 'MAINNET' } = action.meta.arg;
        const preNFTCollection = state.accountNFT.accountNFTInfo?.[currentNetwork]?.accountNFTList;
        const currentNFTSeriesItem = preNFTCollection?.find(ele => ele.symbol === symbol && ele.chainId === chainId);
        if (currentNFTSeriesItem) {
          currentNFTSeriesItem.isFetching = false;
        }
        if (!action.payload) return;
        const { list, totalRecordCount, skipCount } = action.payload;
        if (currentNFTSeriesItem) {
          if (currentNFTSeriesItem?.children?.length > skipCount) return;
          currentNFTSeriesItem.children = [...currentNFTSeriesItem.children, ...list];
          currentNFTSeriesItem.skipCount = currentNFTSeriesItem.children.length;
          currentNFTSeriesItem.totalRecordCount = totalRecordCount;
          currentNFTSeriesItem.isFetching = false;
        }
      })
      // .addCase(fetchNFTAsync.rejected, state => {
      //   state.accountNFT.isFetching = false;
      // })
      .addCase(fetchAssetAsync.pending, state => {
        state.accountAssets.isFetching = true;
      })
      .addCase(fetchAssetAsync.fulfilled, (state, action) => {
        const { list, totalRecordCount, skipCount, maxResultCount, currentNetwork } = action.payload;
        const preAccountAssetsList = state.accountAssets.accountAssetsInfo?.[currentNetwork]?.accountAssetsList || [];
        if (skipCount !== 0 && preAccountAssetsList.length === totalRecordCount) {
          state.accountAssets.isFetching = false;
          return;
        }
        const newList = skipCount === 0 ? list : [...preAccountAssetsList, ...list];
        if (!state.accountAssets.accountAssetsInfo) state.accountAssets.accountAssetsInfo = {};
        state.accountAssets.accountAssetsInfo[currentNetwork] = {
          accountAssetsList: newList,
          skipCount,
          totalRecordCount,
          maxResultCount,
        };
        state.accountAssets.isFetching = false;
      })
      .addCase(fetchAssetAsync.rejected, state => {
        state.accountToken.isFetching = false;
      })
      .addCase(fetchCryptoBoxAssetAsync.fulfilled, (state, action) => {
        const { list, totalRecordCount } = action.payload;
        if (!state.accountCryptoBoxAssets)
          state.accountCryptoBoxAssets = {
            isFetching: false,
            skipCount: 0,
            maxResultCount: 1000,
            accountAssetsList: [],
            totalRecordCount: 0,
          };

        state.accountCryptoBoxAssets.accountAssetsList = list;
        state.accountCryptoBoxAssets.totalRecordCount = totalRecordCount;
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
      })
      .addCase(fetchTargetTokenBalanceAsync.fulfilled, (state, action) => {
        const { chainId, symbol, response, currentNetwork = 'MAINNET' } = action.payload;

        const tmpList = state.accountToken?.accountTokenInfo?.[currentNetwork]?.accountTokenList?.map(ele =>
          ele.chainId === chainId && ele.symbol === symbol
            ? { ...ele, balance: response.balance, balanceInUsd: response.balanceInUsd }
            : ele,
        );

        if (!state?.accountToken?.accountTokenInfo?.[currentNetwork]) {
          state.accountToken.accountTokenInfo = {
            ...(state.accountToken.accountTokenInfo || {}),
            [currentNetwork]: {},
          };
        }

        state.accountToken.accountTokenInfo = {
          ...(state.accountToken.accountTokenInfo || {}),
          [currentNetwork]: {
            ...(state.accountToken.accountTokenInfo[currentNetwork] || {}),
            accountTokenList: tmpList,
          },
        };
      });
  },
});

export const {
  clearNftItem,
  resetAssets,
  clearAccountNftCollectionInfo,
  clearAccountAssetsInfo,
  clearAccountTokenInfo,
} = assetsSlice.actions;

export default assetsSlice;
