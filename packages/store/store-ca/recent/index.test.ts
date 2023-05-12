import { initialRecentData } from '@portkey-wallet/hooks/hooks-ca/useRecent';
import { fetchRecentListAsync, initCurrentChainRecentData, recentSlice, resetRecent } from './slice';
import { fetchRecentTransactionUsers } from './api';
import { configureStore } from '@reduxjs/toolkit';
import { ChainId } from '@portkey-wallet/types';

jest.mock('./api');
const reducer = recentSlice.reducer;

describe('initCurrentChainRecentData', () => {
  test('Init new caAddress recent data', () => {
    const newState = reducer({}, initCurrentChainRecentData({ caAddress: 'caAddress' }));
    expect(newState).toHaveProperty('caAddress');
  });
  test('add a new caAddress recent data', () => {
    const newState = reducer({ caAddress: initialRecentData }, initCurrentChainRecentData({ caAddress: 'caAddress2' }));
    expect(Object.keys(newState)).toHaveLength(2);
  });
});

describe('resetRecent', () => {
  test('Reset recent, set initialState', () => {
    const newState = reducer({ caAddress: initialRecentData }, resetRecent());
    expect(newState).toEqual({});
  });
});

describe('fetchRecentListAsync', () => {
  const mockRecentItem = {
    chainId: 'AELF' as ChainId,
    caAddress: 'caAddress',
    address: 'address',
    addressChainId: 'AELF',
    transactionTime: '123456789',
    name: '',
    addresses: [],
    id: 'id',
    index: '',
    modificationTime: 0,
    isDeleted: true,
    userId: 'userId',
  };
  test('At the first time, to get recentList successful', async () => {
    const mockStore = configureStore({ reducer });
    jest.mocked(fetchRecentTransactionUsers).mockResolvedValue({
      data: [{}],
      totalRecordCount: 1,
    });
    const mockPayload = {
      caAddress: 'caAddress',
      caAddressInfos: [{ chainId: 'AELF' as ChainId, caAddress: 'caAddress' }],
      // isFirstTime: true,
    };
    await mockStore.dispatch(fetchRecentListAsync(mockPayload as any));
    expect(fetchRecentTransactionUsers).toBeCalled();
    expect(mockStore.getState()).toHaveProperty('caAddress');
    expect(mockStore.getState().caAddress).toHaveProperty('totalRecordCount', 1);
  });
  test('Multiply get recentList successful', async () => {
    const mockStore = configureStore({
      reducer,
      preloadedState: {
        caAddress: {
          isFetching: false,
          totalRecordCount: 1,
          skipCount: 1,
          maxResultCount: 10,
          recentContactList: [mockRecentItem],
        },
      },
    });
    jest.mocked(fetchRecentTransactionUsers).mockResolvedValue({
      data: [mockRecentItem],
      totalRecordCount: 1,
    });
    const mockPayload = {
      caAddress: 'caAddress',
      caAddressInfos: [{ chainId: 'AELF' as ChainId, caAddress: 'caAddress' }],
      isFirstTime: false,
    };
    await mockStore.dispatch(fetchRecentListAsync(mockPayload as any));
    expect(fetchRecentTransactionUsers).toBeCalled();
    expect(mockStore.getState().caAddress.recentContactList).toHaveLength(2);
  });
});
