import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { NFTCollectionItemShowType } from '@portkey-wallet/types/types-ca/assets';
import {
  fetchAssetList,
  fetchAssetListV2,
  fetchCryptoBoxAssetList,
  fetchNFTSeriesList,
  fetchNFTList,
  fetchTokenList,
  fetchTokenPrices,
  fetchTokenBalance,
} from './api';
import { ITokenSectionResponse, TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { TAssetsState } from './type';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { NEW_CLIENT_MOCK_ELF_LIST, PAGE_SIZE_IN_NFT_ITEM } from '@portkey-wallet/constants/constants-ca/assets';
import { IUserTokenItem } from '@portkey-wallet/types/types-eoa/token';
// import { WalletState } from '../wallet/type';

export const INIT_ACCOUNT_TOKEN_INFO = {
  skipCount: 0,
  maxResultCount: 10,
  accountTokenList: NEW_CLIENT_MOCK_ELF_LIST,
  totalRecordCount: 0,
  totalDisplayCount: 0,
};

export const INIT_ACCOUNT_NFT_INFO = {
  skipCount: 0,
  maxResultCount: 10,
  accountNFTList: [],
  totalRecordCount: 0,
  totalNftItemCount: 0,
};

export const INIT_ACCOUNT_ASSETS_INFO = {
  skipCount: 0,
  maxResultCount: 1000,
  accountAssetsList: [],
  totalRecordCount: 0,
};

export const INIT_ACCOUNT_ASSETS_INFO_V2 = {
  skipCount: 0,
  maxResultCount: 1000,
  accountAssetsList: {
    nftInfos: [],
    tokenInfos: [],
  },
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
  accountAssetsV2: {
    ...INIT_ACCOUNT_ASSETS_INFO_V2,
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
  nftSectionUiType: 'Collections',
};
// fetch tokenList on Dashboard
export const fetchTokenListAsync = createAsyncThunk(
  'fetchTokenListAsync',
  async ({
    addressInfos,
    skipCount = 0,
    maxResultCount = 1000,
    identify,
  }: {
    addressInfos: { chainId: ChainId; address: string }[];
    skipCount?: number;
    maxResultCount?: number;
    identify: string;
  }) => {
    console.log('fetchTokenList===== start!!');
    const response = await fetchTokenList({ addressInfos, skipCount, maxResultCount });
    console.log('fetchTokenList===== end!!', JSON.stringify(response));
    // // mock data fro new account
    if (response.data.length === 0) {
      return {
        list: NEW_CLIENT_MOCK_ELF_LIST,
        totalRecordCount: NEW_CLIENT_MOCK_ELF_LIST.length,
        totalDisplayCount: NEW_CLIENT_MOCK_ELF_LIST[0].tokens?.length || 0,
        skipCount,
        maxResultCount,
        identify,
        totalBalanceInUsd: '',
      };
    }
    return {
      list: response.data,
      totalRecordCount: response.totalRecordCount,
      totalDisplayCount: response.totalDisplayCount,
      skipCount,
      maxResultCount,
      identify,
      totalBalanceInUsd: response.totalBalanceInUsd,
    };
  },
);

// fetch nftCollectionList on Dashboard
export const fetchNFTCollectionsAsync = createAsyncThunk(
  'fetchNFTCollectionsAsync',
  async (
    {
      addressInfos,
      maxNFTCount = PAGE_SIZE_IN_NFT_ITEM,
      skipCount = 0,
      maxResultCount = 1000,
      identify,
    }: {
      addressInfos: { chainId: ChainId; address: string }[];
      maxNFTCount?: number;
      skipCount?: number;
      maxResultCount?: number;
      identify: string;
    },
    { getState },
  ) => {
    // const { wallet } = getState() as { wallet: WalletState };
    const response = await fetchNFTSeriesList({ addressInfos, skipCount, maxResultCount });
    return {
      list: response.data,
      totalRecordCount: response.totalRecordCount,
      totalNftItemCount: response.totalNftItemCount,
      maxNFTCount,
      skipCount,
      maxResultCount,
      identify,
    };
  },
);

// fetch current nftItem on Dashboard
export const fetchNFTAsync = createAsyncThunk(
  'fetchNFTAsync',
  async (
    {
      symbol,
      addressInfos,
      chainId,
      pageNum = 0,
      identify,
    }: {
      symbol: string;
      addressInfos: { chainId: ChainId; address: string }[];
      chainId: ChainId;
      pageNum: number;
      identify: string;
    },
    { getState },
  ) => {
    const { assets } = getState() as { assets: TAssetsState };
    const {
      accountNFT: { accountNFTInfo },
    } = assets;
    const preAccountNFTCollectionList = accountNFTInfo?.[identify]?.accountNFTList || [];
    const targetNFTCollection = preAccountNFTCollectionList.find(
      item => item.symbol === symbol && item.chainId === chainId,
    );
    if (!targetNFTCollection) return;

    const { skipCount, maxResultCount, totalRecordCount, children } = targetNFTCollection;
    // has cache data
    if ((pageNum + 1) * maxResultCount <= children.length) return;

    if (totalRecordCount === 0 || Number(totalRecordCount) > children.length) {
      const response = await fetchNFTList({ symbol, addressInfos, skipCount, maxResultCount });
      return {
        symbol,
        chainId,
        list: response.data,
        totalRecordCount: response.totalRecordCount,
        skipCount,
        identify,
      };
    }
    return { symbol, chainId, list: [], totalRecordCount, skipCount, identify };
  },
);

// fetch current assets when add sent button
export const fetchAssetAsync = createAsyncThunk(
  'fetchAssetsAsync',
  async (
    {
      keyword,
      addressInfos,
      skipCount = 0,
      maxResultCount = 1000,
      identify,
    }: {
      keyword: string;
      addressInfos: { chainId: ChainId; address: string }[];
      skipCount?: number;
      maxResultCount?: number;
      identify: string;
    },
    { getState },
  ) => {
    const response = await fetchAssetList({ addressInfos, keyword, skipCount, maxResultCount });

    return {
      list: response.data,
      totalRecordCount: response.totalRecordCount,
      keyword,
      skipCount,
      maxResultCount,
      identify,
    };
  },
);

export const fetchAssetV2Async = createAsyncThunk(
  'fetchAssetV2Async',
  async (
    {
      keyword,
      addressInfos,
      skipCount = 0,
      maxResultCount = 1000,
      identify,
    }: {
      keyword: string;
      addressInfos: { chainId: ChainId; address: string }[];
      skipCount?: number;
      maxResultCount?: number;
      identify: string;
    },
    { getState },
  ) => {
    const response = await fetchAssetListV2({ addressInfos, keyword, skipCount, maxResultCount });

    return {
      ...response,
      keyword,
      skipCount,
      maxResultCount,
      identify,
    };
  },
);

// fetch current cryptoBox assets when add sent button
export const fetchCryptoBoxAssetAsync = createAsyncThunk(
  'fetchCryptoBoxAssetAsync',
  async ({ keyword, addressInfos }: { keyword: string; addressInfos: { chainId: ChainId; address: string }[] }) => {
    const response = await fetchCryptoBoxAssetList({ addressInfos, keyword, skipCount: 0, maxResultCount: 1000 });

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
    identify,
  }: {
    symbol: string;
    chainId: ChainId;
    currentCaAddress: string;
    identify: string;
  }) => {
    const response = await fetchTokenBalance({ symbol, chainId, currentCaAddress });
    return { symbol, chainId, response, identify };
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
      const tokenInfo = state.accountToken.accountTokenInfoV2;
      if (tokenInfo?.[action.payload]) delete tokenInfo[action.payload];
      state.accountToken.accountTokenInfoV2 = tokenInfo;
    },
    clearAccountAssetsInfo: (state, action: PayloadAction<NetworkType>) => {
      const assetsInfo = state.accountAssets.accountAssetsInfo;
      if (assetsInfo?.[action.payload]) delete assetsInfo[action.payload];
      state.accountAssets.accountAssetsInfo = assetsInfo;
      const assetsInfoV2 = state.accountAssetsV2.accountAssetsInfo;
      if (assetsInfoV2?.[action.payload]) delete assetsInfoV2[action.payload];
      state.accountAssetsV2.accountAssetsInfo = assetsInfoV2;
    },
    changeNftSectionUiType: (state, action: PayloadAction<'Collections' | 'NFTs'>) => {
      const payload = action.payload;
      state.nftSectionUiType = payload;
    },
    showLocalShowTokenInfo: (state, action: PayloadAction<{ identify: string; token: IUserTokenItem }>) => {
      const { token, identify } = action.payload;
      const preLocalShowTokenInfo = state.localShowTokenInfo?.[identify];
      // if (!preLocalShowTokenInfo) {
      //   preLocalShowTokenInfo = [];
      // }
      if (preLocalShowTokenInfo) {
        const existToken = preLocalShowTokenInfo.find(
          item => item.symbol === token.symbol && item.chainId === token.chainId,
        );
        if (existToken) {
          state.localShowTokenInfo = {
            ...state.localShowTokenInfo,
            [identify]: preLocalShowTokenInfo.map(item =>
              item.symbol === token.symbol && item.chainId === token.chainId ? { ...item, isAdded: true } : item,
            ),
          };
          // existToken.isAdded = true;
        } else {
          preLocalShowTokenInfo.push({ ...token, isAdded: true });
          state.localShowTokenInfo = {
            ...state.localShowTokenInfo,
            [identify]: [...preLocalShowTokenInfo, { ...token, isAdded: true }],
          };
        }
      } else {
        const tempLocalShowTokenInfo = [];
        tempLocalShowTokenInfo.push({ ...token, isAdded: true });
        state.localShowTokenInfo = {
          ...state.localShowTokenInfo,
          [identify]: tempLocalShowTokenInfo,
        };
      }
    },
    hideLocalShowTokenInfo: (state, action: PayloadAction<{ identify: string; token: IUserTokenItem }>) => {
      const { token, identify } = action.payload;
      const preLocalShowTokenInfo = state.localShowTokenInfo?.[identify];
      console.log('hideLocalShowTokenInfo====preLocalShowTokenInfo', preLocalShowTokenInfo, 'token', token);
      if (preLocalShowTokenInfo) {
        const fundedToken = preLocalShowTokenInfo.find(
          item => item.symbol === token.symbol && item.chainId === token.chainId,
        );
        console.log('fundedToken===', fundedToken);
        if (fundedToken) {
          state.localShowTokenInfo = {
            ...state.localShowTokenInfo,
            [identify]: preLocalShowTokenInfo.map(item =>
              item.symbol === token.symbol && item.chainId === token.chainId ? { ...item, isAdded: false } : item,
            ),
          };
        } else {
          state.localShowTokenInfo = {
            ...state.localShowTokenInfo,
            [identify]: [...preLocalShowTokenInfo, { ...token, isAdded: false }],
          };
        }
      } else {
        const tempLocalShowTokenInfo = [];
        tempLocalShowTokenInfo.push({ ...token, isAdded: false });
        state.localShowTokenInfo = {
          ...state.localShowTokenInfo,
          [identify]: tempLocalShowTokenInfo,
        };
      }
      console.log('state.localShowTokenInfo=====', state.localShowTokenInfo);
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
          totalDisplayCount,
          skipCount,
          maxResultCount,
          identify,
          totalBalanceInUsd = '',
        } = action.payload;
        const preAccountTokenList = state.accountToken.accountTokenInfoV2?.[identify]?.accountTokenList || [];
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
            [identify]: totalBalanceInUsd,
          },
        };

        const newTokenList = skipCount === 0 ? list : [...preAccountTokenList, ...list];
        state.tokenPrices.tokenPriceObject = { ...state.tokenPrices.tokenPriceObject, ...priceObj };

        if (!state.accountToken.accountTokenInfoV2) state.accountToken.accountTokenInfoV2 = {};
        state.accountToken.accountTokenInfoV2[identify] = {
          accountTokenList: newTokenList as ITokenSectionResponse[],
          skipCount,
          totalRecordCount,
          totalDisplayCount,
          maxResultCount,
        };
        state.accountToken.isFetching = false;
        console.log('state.accountToken.accountTokenInfoV2', JSON.stringify(state.accountToken.accountTokenInfoV2));
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
        const { list, totalRecordCount, totalNftItemCount, maxNFTCount, skipCount, maxResultCount, identify } =
          action.payload;
        const preAccountNFTCollectionList = state.accountNFT.accountNFTInfo?.[identify]?.accountNFTList || [];
        if (skipCount !== 0 && preAccountNFTCollectionList.length === totalRecordCount) {
          state.accountNFT.isFetching = false;
          return;
        }
        const newAccountList: NFTCollectionItemShowType[] = list.map(item => {
          const targetItem = preAccountNFTCollectionList.find(
            preItem => preItem.collectionName === item.collectionName && preItem.chainId === item.chainId,
          );
          return {
            isFetching: false,
            skipCount: 0,
            maxResultCount: maxNFTCount,
            // prevTotalRecordCount: targetItem?.totalRecordCount || targetItem?.children || 0,
            prevChildren: targetItem?.children || targetItem?.prevChildren || [],
            totalRecordCount: 0,
            children: [],
            // children: [],
            ...item,
          };
        });
        const newAllAccountList =
          skipCount === 0 ? newAccountList : [...preAccountNFTCollectionList, ...newAccountList];
        if (!state.accountNFT.accountNFTInfo) state.accountNFT.accountNFTInfo = {};
        state.accountNFT.accountNFTInfo[identify] = {
          accountNFTList: newAllAccountList,
          skipCount,
          totalRecordCount,
          totalNftItemCount,
          maxResultCount,
        };
        state.accountNFT.isFetching = false;
      })
      .addCase(fetchNFTAsync.pending, (state, action) => {
        if (!action.meta.arg) return;
        const { symbol, chainId, identify } = action.meta.arg;
        const preNFTCollection = state.accountNFT.accountNFTInfo?.[identify]?.accountNFTList;
        const currentNFTSeriesItem = preNFTCollection?.find(ele => ele.symbol === symbol && ele.chainId === chainId);
        if (currentNFTSeriesItem) {
          currentNFTSeriesItem.isFetching = true;
        }
      })
      .addCase(fetchNFTAsync.fulfilled, (state, action) => {
        if (!action.meta.arg) return;
        const { symbol, chainId, identify } = action.meta.arg;
        const preNFTCollection = state.accountNFT.accountNFTInfo?.[identify]?.accountNFTList;
        const currentNFTSeriesItem = preNFTCollection?.find(ele => ele.symbol === symbol && ele.chainId === chainId);
        if (currentNFTSeriesItem) {
          currentNFTSeriesItem.isFetching = false;
        }
        if (!action.payload) return;
        const { list, totalRecordCount, skipCount } = action.payload;
        if (currentNFTSeriesItem) {
          if (currentNFTSeriesItem?.children?.length > skipCount) return;
          if (currentNFTSeriesItem.children.length > 0) {
            currentNFTSeriesItem.prevChildren = [...currentNFTSeriesItem.children];
          }
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
        const { list, totalRecordCount, skipCount, maxResultCount, identify } = action.payload;
        const preAccountAssetsList = state.accountAssets.accountAssetsInfo?.[identify]?.accountAssetsList || [];
        if (skipCount !== 0 && preAccountAssetsList.length === totalRecordCount) {
          state.accountAssets.isFetching = false;
          return;
        }
        const newList = skipCount === 0 ? list : [...preAccountAssetsList, ...list];
        if (!state.accountAssets.accountAssetsInfo) state.accountAssets.accountAssetsInfo = {};
        state.accountAssets.accountAssetsInfo[identify] = {
          accountAssetsList: newList,
          skipCount,
          totalRecordCount,
          maxResultCount,
        };
        state.accountAssets.isFetching = false;
      })
      .addCase(fetchAssetAsync.rejected, state => {
        state.accountAssets.isFetching = false;
      })
      .addCase(fetchAssetV2Async.pending, state => {
        if (!state.accountAssetsV2) {
          state.accountAssetsV2 = {
            ...INIT_ACCOUNT_ASSETS_INFO_V2,
            isFetching: false,
          };
        }
        state.accountAssetsV2.isFetching = true;
      })
      .addCase(fetchAssetV2Async.fulfilled, (state, action) => {
        const { nftInfos, tokenInfos, totalRecordCount, skipCount, maxResultCount, identify } = action.payload;
        if (!state.accountAssetsV2.accountAssetsInfo) state.accountAssetsV2.accountAssetsInfo = {};

        state.accountAssetsV2.accountAssetsInfo[identify] = {
          accountAssetsList: { nftInfos, tokenInfos },
          skipCount,
          totalRecordCount,
          maxResultCount,
        };
        state.accountAssetsV2.isFetching = false;
      })
      .addCase(fetchAssetV2Async.rejected, state => {
        state.accountAssetsV2.isFetching = false;
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
        const { chainId, symbol, response, identify } = action.payload;

        const newTokens = ({
          tokens,
          chainId,
          balance,
          balanceInUsd,
        }: {
          tokens?: TokenItemShowType[];
          chainId: ChainId;
          balance: string;
          balanceInUsd: string;
        }) => {
          if (!tokens) return [];
          return tokens.map(ele => {
            if (ele.chainId === chainId && ele.symbol === symbol) {
              return { ...ele, balance, balanceInUsd };
            }
            return ele;
          });
        };
        const tmpList = state.accountToken?.accountTokenInfoV2?.[identify]?.accountTokenList?.map(ele =>
          ele.symbol === symbol
            ? {
                ...ele,
                tokens: newTokens({
                  tokens: ele.tokens,
                  chainId,
                  balance: response.balance,
                  balanceInUsd: response.balanceInUsd,
                }),
              }
            : ele,
        );
        state.accountToken.accountTokenInfoV2 = {
          ...(state.accountToken.accountTokenInfoV2 || {}),
          [identify]: {
            ...(state?.accountToken?.accountTokenInfoV2?.[identify] || {}),
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
  changeNftSectionUiType,
  showLocalShowTokenInfo,
  hideLocalShowTokenInfo,
} = assetsSlice.actions;

export default assetsSlice;
