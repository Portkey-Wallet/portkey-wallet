import { NEW_CLIENT_MOCK_ELF_LIST } from '@portkey-wallet/constants/constants-ca/assets';
import { ChainId } from '@portkey-wallet/types';
import {
  assetsSlice,
  clearNftCollection,
  fetchNFTAsync,
  fetchNFTCollectionsAsync,
  fetchTokenListAsync,
  resetAssets,
  fetchAssetAsync,
  fetchTokensPriceAsync,
} from './slice';
import { configureStore } from '@reduxjs/toolkit';
import { fetchAssetList, fetchNFTSeriesList, fetchNFTList, fetchTokenList, fetchTokenPrices } from './api';

const mockInitState = {
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
const reducer = assetsSlice.reducer;
jest.mock('./api');
describe('resetAssets', () => {
  test('reset assets, will equal initState', () => {
    const res = reducer(mockInitState, resetAssets());
    expect(res).toEqual(mockInitState);
  });
});

describe('clearNftItem', () => {
  const newState = {
    ...mockInitState,
    accountNFT: {
      ...mockInitState.accountNFT,
      accountNFTList: [
        {
          isFetching: false,
          skipCount: 1,
          maxResultCount: 9,
          totalRecordCount: 1,
          chainId: 'AELF' as ChainId,
          collectionName: 'Nature Elves',
          imageUrl: 'https:/294xAUTO/1.jpg',
          itemCount: 1,
          symbol: 'CARD-0',
          decimals: 0,
          children: [
            {
              alias: 'Forest Warrior',
              quantity: '1',
              chainId: 'AELF' as ChainId,
              imageUrl: 'https:/294xAUTO/1.jpg',
              symbol: 'CARD-001',
              tokenContractAddress: 'aZSvoAaE',
              tokenId: '001',
              totalSupply: '',
            },
          ],
        },
      ],
    },
  };
  test('symbol and chainId have exist, will clear nftItem', () => {
    const res = reducer(newState, assetsSlice.actions.clearNftItem({ symbol: 'CARD-0', chainId: 'AELF' }));
    expect(res.accountNFT.accountNFTList[0].children).toEqual([]);
  });
  test('symbol and chainId have not exist, nft item exist', () => {
    const res = reducer(newState, assetsSlice.actions.clearNftItem({ symbol: 'CARD-1', chainId: 'AELF' }));
    expect(res.accountNFT.accountNFTList[0].children).toHaveLength(1);
  });
});

describe('clearNftCollection', () => {
  test('nft collection will reset', () => {
    const newState = {
      ...mockInitState,
      accountNFT: {
        ...mockInitState.accountNFT,
        accountNFTList: [
          {
            isFetching: false,
            skipCount: 1,
            maxResultCount: 9,
            totalRecordCount: 1,
            chainId: 'AELF' as ChainId,
            collectionName: 'Nature Elves',
            imageUrl: 'https:/294xAUTO/1.jpg',
            itemCount: 1,
            symbol: 'CARD-0',
            decimals: 0,
            children: [
              {
                alias: 'Forest Warrior',
                quantity: '1',
                chainId: 'AELF' as ChainId,
                imageUrl: 'https:/294xAUTO/1.jpg',
                symbol: 'CARD-001',
                tokenContractAddress: 'aZSvoAaE',
                tokenId: '001',
                totalSupply: '',
              },
            ],
          },
        ],
      },
    };
    const res = reducer(newState, clearNftCollection());
    expect(res.accountNFT).toEqual(mockInitState.accountNFT);
  });
});

describe('fetchTokenListAsync', () => {
  const mockStore = configureStore({ reducer });
  const mockPayload = {
    caAddresses: ['7W99faZSvoAaE'],
    caAddressInfos: [
      {
        caAddress: '7W99faZSvoAaE',
        chainId: 'AELF' as ChainId,
      },
    ],
  };
  test('fetchTokenListAsync will return accountToken successful', async () => {
    jest.mocked(fetchTokenList).mockResolvedValue({
      data: [
        {
          balance: '3092810000',
          balanceInUsd: undefined,
          chainId: 'AELF',
          decimals: 8,
          imageUrl: 'https://aelf_token_logo.png',
          price: 0.291849,
          symbol: 'ELF',
          tokenContractAddress: '7W99faZSvoAaE',
        },
      ],
      totalRecordCount: 1,
    });
    await mockStore.dispatch(fetchTokenListAsync(mockPayload));
    expect(mockStore.getState().accountToken.accountTokenList).toHaveLength(1);
  });
  test('fetchTokenListAsync return empty, accountToken will be set initState', async () => {
    jest.mocked(fetchTokenList).mockResolvedValue({
      data: [],
      totalRecordCount: 0,
    });
    await mockStore.dispatch(fetchTokenListAsync(mockPayload));
    expect(mockStore.getState().accountToken.accountTokenList).toEqual(NEW_CLIENT_MOCK_ELF_LIST);
  });
  test('fetchTokenListAsync failed', async () => {
    jest.mocked(fetchTokenList).mockRejectedValue({
      error: 'error',
    });
    const res = await mockStore.dispatch(fetchTokenListAsync(mockPayload));
    expect(res.type).toEqual('fetchTokenListAsync/rejected');
  });
});

describe('fetchNFTCollectionsAsync', () => {
  const mockStore = configureStore({
    reducer: {
      assets: assetsSlice.reducer,
    },
    preloadedState: {
      assets: mockInitState,
    },
  });
  const mockPayload = {
    caAddresses: ['7W99faZSvoAaE'],
    caAddressInfos: [
      {
        caAddress: '7W99faZSvoAaE',
        chainId: 'AELF' as ChainId,
      },
    ],
  };
  test('fetchNFTCollectionsAsync will return accountNFT successful', async () => {
    jest.mocked(fetchNFTSeriesList).mockResolvedValue({
      data: [
        {
          chainId: 'AELF',
          collectionName: 'Nature Elves',
          imageUrl: 'https://144xAUTO/3.jpg',
          itemCount: 1,
          symbol: 'CARD-0',
        },
      ],
      totalRecordCount: 1,
    });
    await mockStore.dispatch(fetchNFTCollectionsAsync(mockPayload));
    expect(mockStore.getState().assets.accountNFT.accountNFTList).toHaveLength(1);
  });
  test('fetchNFTCollectionsAsync failed', async () => {
    jest.mocked(fetchNFTSeriesList).mockRejectedValue({ error: 'error' });
    const res = await mockStore.dispatch(fetchNFTCollectionsAsync(mockPayload));
    expect(res.type).toEqual('fetchNFTCollectionsAsync/rejected');
  });
});

describe('fetchNFTAsync', () => {
  const mockPayload = {
    caAddresses: ['7W99faZSvoAaE'],
    caAddressInfos: [
      {
        caAddress: '7W99faZSvoAaE',
        chainId: 'AELF' as ChainId,
      },
    ],
    symbol: 'CARD-0',
    chainId: 'AELF' as ChainId,
    pageNum: 0,
  };
  const mockReturnNftItem = {
    alias: 'Forest Warrior',
    balance: '1',
    chainId: 'AELF',
    imageLargeUrl: 'https://1008xAUTO/1.jpg',
    imageUrl: 'https://294xAUTO/1.jpg',
    symbol: 'CARD-001',
    tokenContractAddress: '7W99faZSvoAaE',
    tokenId: '001',
    totalSupply: '',
  };
  const newState = {
    ...mockInitState,
    accountNFT: {
      ...mockInitState.accountNFT,
      accountNFTList: [
        {
          isFetching: false,
          skipCount: 1,
          maxResultCount: 9,
          totalRecordCount: 1,
          chainId: 'AELF' as ChainId,
          collectionName: 'Nature Elves',
          imageUrl: 'https:/294xAUTO/1.jpg',
          itemCount: 1,
          symbol: 'CARD-0',
          decimals: 0,
          children: [],
        },
      ],
    },
  };
  test('fetchNFTAsync will return nft item successful and nft collection exist', async () => {
    const mockStore = configureStore({
      reducer: {
        assets: assetsSlice.reducer,
      },
      preloadedState: {
        assets: newState,
      },
    });
    jest.mocked(fetchNFTList).mockResolvedValue({
      data: [mockReturnNftItem],
      totalRecordCount: 1,
    });
    await mockStore.dispatch(fetchNFTAsync(mockPayload));
    expect(mockStore.getState().assets.accountNFT.accountNFTList[0].children).toHaveLength(1);
  });
  test('fetchNFTAsync will return nft item successful and nft collection does not exist', async () => {
    const mockStore = configureStore({
      reducer: {
        assets: assetsSlice.reducer,
      },
      preloadedState: {
        assets: newState,
      },
    });

    jest.mocked(fetchNFTList).mockResolvedValue({
      data: [mockReturnNftItem],
      totalRecordCount: 1,
    });
    await mockStore.dispatch(fetchNFTAsync({ ...mockPayload, symbol: 'CARD-1', chainId: 'tDVV' }));
    expect(mockStore.getState().assets.accountNFT.accountNFTList[0].children).toHaveLength(0);
  });
  test('repeated fetch multiple times will update once', async () => {
    const state = {
      ...mockInitState,
      accountNFT: {
        ...mockInitState.accountNFT,
        accountNFTList: [
          {
            isFetching: false,
            skipCount: 0,
            maxResultCount: 2,
            totalRecordCount: 1,
            chainId: 'AELF' as ChainId,
            collectionName: 'Nature Elves',
            imageUrl: 'https:/294xAUTO/1.jpg',
            itemCount: 1,
            symbol: 'CARD-0',
            decimals: 0,
            children: [
              {
                alias: 'Forest Warrior',
                quantity: '1',
                chainId: 'AELF' as ChainId,
                imageLargeUrl: 'https://1008xAUTO/1.jpg',
                imageUrl: 'https://294xAUTO/1.jpg',
                symbol: 'CARD-001',
                tokenContractAddress: '7W99faZSvoAaE',
                tokenId: '001',
                totalSupply: '',
              },
              {
                alias: 'Forest',
                quantity: '1',
                chainId: 'AELF' as ChainId,
                imageLargeUrl: 'https://1008xAUTO/1.jpg',
                imageUrl: 'https://294xAUTO/1.jpg',
                symbol: 'CARD-002',
                tokenContractAddress: '7W99faZSvoAaE',
                tokenId: '002',
                totalSupply: '',
              },
            ],
          },
        ],
      },
    };
    jest.mocked(fetchNFTList).mockResolvedValue({
      data: [mockReturnNftItem],
      totalRecordCount: 1,
    });
    const mockStore = configureStore({
      reducer: {
        assets: assetsSlice.reducer,
      },
      preloadedState: {
        assets: state,
      },
    });
    await mockStore.dispatch(fetchNFTAsync({ ...mockPayload, pageNum: 2 }));
    expect(mockStore.getState().assets.accountNFT.accountNFTList[0].children).toHaveLength(2);
  });
  test('enough nft items so will not to fetch new nft items', async () => {
    const state = {
      ...mockInitState,
      accountNFT: {
        ...mockInitState.accountNFT,
        accountNFTList: [
          {
            isFetching: false,
            skipCount: 1,
            maxResultCount: 1,
            totalRecordCount: 10,
            chainId: 'AELF' as ChainId,
            collectionName: 'Nature Elves',
            imageUrl: 'https:/294xAUTO/1.jpg',
            itemCount: 1,
            symbol: 'CARD-0',
            decimals: 0,
            children: [
              {
                alias: 'Forest Warrior',
                quantity: '1',
                chainId: 'AELF' as ChainId,
                imageLargeUrl: 'https://1008xAUTO/1.jpg',
                imageUrl: 'https://294xAUTO/1.jpg',
                symbol: 'CARD-001',
                tokenContractAddress: '7W99faZSvoAaE',
                tokenId: '001',
                totalSupply: '',
              },
            ],
          },
        ],
      },
    };
    const mockStore = configureStore({
      reducer: {
        assets: assetsSlice.reducer,
      },
      preloadedState: {
        assets: state,
      },
    });
    const mockPayload = {
      caAddresses: ['7W99faZSvoAaE'],
      caAddressInfos: [
        {
          caAddress: '7W99faZSvoAaE',
          chainId: 'AELF' as ChainId,
        },
      ],
      symbol: 'CARD-0',
      chainId: 'AELF' as ChainId,
      pageNum: 0,
    };
    await mockStore.dispatch(fetchNFTAsync(mockPayload));
    expect(mockStore.getState().assets.accountNFT.accountNFTList[0].children).toHaveLength(1);
  });
  test('have got it all, does not need to get it again', async () => {
    const state = {
      ...mockInitState,
      accountNFT: {
        ...mockInitState.accountNFT,
        accountNFTList: [
          {
            isFetching: false,
            skipCount: 1,
            maxResultCount: 2,
            totalRecordCount: 1,
            chainId: 'AELF' as ChainId,
            collectionName: 'Nature Elves',
            imageUrl: 'https:/294xAUTO/1.jpg',
            itemCount: 1,
            symbol: 'CARD-0',
            decimals: 0,
            children: [
              {
                alias: 'Forest Warrior',
                quantity: '1',
                chainId: 'AELF' as ChainId,
                imageLargeUrl: 'https://1008xAUTO/1.jpg',
                imageUrl: 'https://294xAUTO/1.jpg',
                symbol: 'CARD-001',
                tokenContractAddress: '7W99faZSvoAaE',
                tokenId: '001',
                totalSupply: '',
              },
            ],
          },
        ],
      },
    };
    const mockStore = configureStore({
      reducer: {
        assets: assetsSlice.reducer,
      },
      preloadedState: {
        assets: state,
      },
    });
    const mockPayload = {
      caAddresses: ['7W99faZSvoAaE'],
      caAddressInfos: [
        {
          caAddress: '7W99faZSvoAaE',
          chainId: 'AELF' as ChainId,
        },
      ],
      symbol: 'CARD-0',
      chainId: 'AELF' as ChainId,
    };
    await mockStore.dispatch(fetchNFTAsync(mockPayload as any));
    expect(mockStore.getState().assets.accountNFT.accountNFTList[0].children).toHaveLength(1);
  });
  test('fetchNFTAsync failed', async () => {
    jest.mocked(fetchNFTList).mockRejectedValue({
      error: 'error',
    });
    const mockStore = configureStore({
      reducer: {
        assets: assetsSlice.reducer,
      },
      preloadedState: {
        assets: newState,
      },
    });
    const res = await mockStore.dispatch(fetchNFTAsync(mockPayload));
    expect(res.type).toEqual('fetchNFTAsync/rejected');
  });
});

describe('fetchAssetsAsync', () => {
  const mockStore = configureStore({
    reducer,
    preloadedState: mockInitState,
  });
  const mockPayload = {
    caAddresses: ['7W99faZSvoAaE'],
    caAddressInfos: [
      {
        caAddress: '7W99faZSvoAaE',
        chainId: 'AELF' as ChainId,
      },
    ],
    keyword: '',
  };
  const mockReturnValue = {
    data: [
      {
        id: 'uniqueId',
        address: 'YsB44wJetP29zHRTx9J',
        chainId: 'AELF',
        nftInfo: undefined,
        symbol: 'ELF',
        tokenInfo: {
          chainId: 'AELF',
          balance: '3092810000',
          decimals: '8',
          balanceInUsd: '9.0899850867',
          tokenContractAddress: 'f7W99faZSvoAaE',
        },
      },
    ],
    totalRecordCount: 0,
  };
  test('fetchAssetsAsync will return assets successful', async () => {
    jest.mocked(fetchAssetList).mockResolvedValue(mockReturnValue);
    await mockStore.dispatch(fetchAssetAsync(mockPayload));
    expect(mockStore.getState().accountAssets.accountAssetsList).toHaveLength(1);
  });
  test('fetchAssetsAsync will return assets failed', async () => {
    jest.mocked(fetchAssetList).mockRejectedValue({ error: 'error' });
    const res = await mockStore.dispatch(fetchAssetAsync(mockPayload));
    expect(res.type).toEqual('fetchAssetsAsync/rejected');
  });
});

describe('fetchTokensPriceAsync', () => {
  const mockStore = configureStore({
    reducer: {
      assets: assetsSlice.reducer,
    },
    preloadedState: {
      assets: mockInitState,
    },
  });
  test('fetchTokensPriceAsync will return tokens price successful', async () => {
    jest.mocked(fetchTokenPrices).mockResolvedValue({
      items: [{ symbol: 'ELF', priceInUsd: 0.293907 }],
      totalRecordCount: 1,
    });
    await mockStore.dispatch(fetchTokensPriceAsync({ symbols: undefined }));
    expect(mockStore.getState().assets.tokenPrices.tokenPriceObject).toEqual({ ELF: 0.293907 });
  });
  test('fetchTokensPriceAsync failed', async () => {
    jest.mocked(fetchTokenPrices).mockRejectedValue({
      error: 'error',
    });
    const res = await mockStore.dispatch(fetchTokensPriceAsync({ symbols: ['ELF'] }));
    expect(res.type).toEqual('fetchTokensPriceAsync/rejected');
  });
});
