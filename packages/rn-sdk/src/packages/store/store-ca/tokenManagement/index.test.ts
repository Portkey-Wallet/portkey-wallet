import { ChainId } from 'packages/types';
import { clearMarketToken, resetToken, tokenManagementSlice } from './slice';
import { fetchAllTokenList } from './api';
import { configureStore } from '@reduxjs/toolkit';
import { fetchAllTokenListAsync, getSymbolImagesAsync } from './action';
import { request } from 'packages/api/api-did';
import { jest, describe, test, expect } from '@jest/globals';

jest.mock('./api');
jest.mock('packages/api/api-did');
const reducer = tokenManagementSlice.reducer;
const mockInitState = {
  tokenDataShowInMarket: [],
  isFetching: false,
  skipCount: 0,
  maxResultCount: 1000,
  totalRecordCount: 0,
  symbolImages: {},
};

describe('resetToken', () => {
  test('Reset tokenDataShowInMarket successful', () => {
    const mockPrevState = {
      ...mockInitState,
      tokenDataShowInMarket: [
        {
          chainId: 'AELF' as ChainId,
          decimals: 8,
          address: '0',
          symbol: 'ELF',
          name: 'name',
        },
      ],
    };
    const newState = reducer(mockPrevState, resetToken());
    expect(newState.tokenDataShowInMarket).toEqual([]);
  });
});
describe('clearMarketToken', () => {
  test('Reset tokenDataShowInMarket successful', () => {
    const mockPrevState = {
      ...mockInitState,
      tokenDataShowInMarket: [
        {
          chainId: 'AELF' as ChainId,
          decimals: 8,
          address: '0',
          symbol: 'ELF',
          name: 'name',
        },
      ],
    };
    const newState = reducer(mockPrevState, clearMarketToken());
    expect(newState.tokenDataShowInMarket).toEqual([]);
  });
});

describe('fetchAllTokenListAsync', () => {
  test('Fetch allTokenList successful, will update tokenDataShowInMarket', async () => {
    jest.mocked(fetchAllTokenList).mockResolvedValue({
      items: [
        {
          isDisplay: true,
          isDefault: true,
          id: 'id',
          token: {
            chainId: 'AELF' as ChainId,
            decimals: 8,
            address: 'address',
            symbol: 'ELF',
            id: 'tokenId',
          },
        },
      ],
      totalRecordCount: 0,
    });
    const mockParams = {
      keyword: '',
      chainIdArray: [],
    };
    const mockStore = configureStore({ reducer, preloadedState: mockInitState });
    await mockStore.dispatch(fetchAllTokenListAsync(mockParams));
    expect(mockStore.getState().tokenDataShowInMarket).toHaveLength(1);
  });
  test('Fetch allTokenList failed, will throw error', async () => {
    jest.mocked(fetchAllTokenList).mockRejectedValue({
      message: 'error',
    });
    const mockParams = {
      keyword: '',
      chainIdArray: [],
    };
    const mockStore = configureStore({ reducer, preloadedState: mockInitState });
    const res = await mockStore.dispatch(fetchAllTokenListAsync(mockParams));
    expect(res.type).toEqual('tokenManagement/fetchAllTokenListAsync/rejected');
  });
});

describe('getSymbolImagesAsync', () => {
  const mockStore = configureStore({ reducer });
  test('Get symbolImages successful, will update symbolImages', async () => {
    jest.mocked(request.assets.getSymbolImages).mockResolvedValue({
      symbolImages: {
        ELF: 'https://aelf.io/favicon.ico',
      },
    });
    await mockStore.dispatch(getSymbolImagesAsync());
    expect(mockStore.getState().symbolImages).toHaveProperty('ELF');
  });
  test('Get symbolImages failed, will throw error', async () => {
    jest.mocked(request.assets.getSymbolImages).mockRejectedValue({
      message: 'error',
    });
    const res = await mockStore.dispatch(getSymbolImagesAsync());
    expect(res.type).toEqual('tokenManagement/getSymbolImagesAsync/rejected');
  });
});
