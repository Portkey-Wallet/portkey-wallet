import { ChainId, ChainType } from '@portkey-wallet/types';
import { activitySlice, addFailedActivity, removeFailedActivity, resetActivity } from './slice';
import { fetchActivities } from './api';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';
import { getActivityListAsync } from './action';
import { configureStore } from '@reduxjs/toolkit';
import { TransactionTypes } from '@portkey-wallet/constants/constants-ca/activity';

const reducer = activitySlice.reducer;
const mockInitState = {
  activityMap: {},
  isFetchingActivities: false,
  failedActivityMap: {},
  isLoading: false,
};
jest.mock('./api');
jest.mock('@portkey-wallet/utils/activity');

describe('addFailedActivity', () => {
  test('Prev failedActivityMap is empty, add a failedActivity', () => {
    const mockPayload = {
      transactionId: '0x1234567890',
      params: {
        chainType: 'aelf' as ChainType,
        managerAddress: 'mangerAddress',
        tokenInfo: {
          id: 'id',
          chainId: 'AELF' as ChainId,
          decimals: 8,
          address: 'address',
          symbol: 'ELF',
          name: 'name',
        },
        amount: 0,
        toAddress: 'toAddress',
      },
    };
    const res = reducer(mockInitState, addFailedActivity(mockPayload));
    expect(res.failedActivityMap[mockPayload.transactionId]).toEqual(mockPayload);
  });
});

describe('removeFailedActivity', () => {
  const mockState = {
    activityMap: {},
    isFetchingActivities: false,
    failedActivityMap: {
      '0x1234567890': {
        transactionId: '0x1234567890',
        params: {
          chainType: 'aelf' as ChainType,
          managerAddress: 'mangerAddress',
          tokenInfo: {
            id: 'id',
            chainId: 'AELF' as ChainId,
            decimals: 8,
            address: 'address',
            symbol: 'ELF',
            name: 'name',
          },
          amount: 0,
          toAddress: 'toAddress',
        },
      },
    },
    isLoading: false,
  };
  test('The key is not exist', () => {
    const mockState = {
      activityMap: {},
      isFetchingActivities: false,
      failedActivityMap: {
        '0x1234567890': {
          transactionId: '0x1234567890',
          params: {
            chainType: 'aelf' as ChainType,
            managerAddress: 'mangerAddress',
            tokenInfo: {
              id: 'id',
              chainId: 'AELF' as ChainId,
              decimals: 8,
              address: 'address',
              symbol: 'ELF',
              name: 'name',
            },
            amount: 0,
            toAddress: 'toAddress',
          },
        },
      },
      isLoading: false,
    };
    const res = reducer(mockState, removeFailedActivity('0x1'));
    expect(res.failedActivityMap).toHaveProperty('0x1234567890');
  });
  test('The key exist, will remove successful', () => {
    const res = reducer(mockState, removeFailedActivity('0x1234567890'));
    expect(res.failedActivityMap).not.toHaveProperty('0x1234567890');
  });
});

describe('resetActivity', () => {
  const mockPrevState = {
    activityMap: {},
    isFetchingActivities: false,
    failedActivityMap: {
      '0x1234567890': {
        transactionId: '0x1234567890',
        params: {
          chainType: 'aelf' as ChainType,
          managerAddress: 'mangerAddress',
          tokenInfo: {
            id: 'id',
            chainId: 'AELF' as ChainId,
            decimals: 8,
            address: 'address',
            symbol: 'ELF',
            name: 'name',
          },
          amount: 0,
          toAddress: 'toAddress',
        },
      },
    },
    isLoading: false,
  };
  test('Reset activity', () => {
    const res = reducer(mockPrevState, resetActivity());
    expect(res).toEqual(mockInitState);
  });
});

describe('activitySlice', () => {
  const mockPrevState = {
    // activityMap: {},
    isFetchingActivities: false,
    failedActivityMap: {},
    isLoading: false,
  };

  const mockStore = configureStore({ reducer, preloadedState: mockPrevState });
  test('ActivityMap is empty, fetch and update activityMap', async () => {
    jest.mocked(fetchActivities).mockResolvedValue({
      data: [
        {
          chainId: 'AELF',
          transactionType: 'SocialRecovery' as TransactionTypes,
          transactionName: 'Social Recovery',
          from: 'wallet01',
          to: 'wallet02',
          fromAddress: 'fromAddress',
          toAddress: 'toAddress',
          fromChainId: 'AELF',
          toChainId: 'AELF',
          status: '',
          transactionId: '',
          blockHash: 'blockHash',
          timestamp: '',
          isReceived: true,
          amount: '1',
          symbol: '',
          transactionFees: [
            {
              symbol: 'ELF',
              fee: 87385000,
              feeInUsd: '0.256879427979178',
              decimals: '8',
            },
          ],
        },
      ],
      totalRecordCount: 1,
    });
    jest.mocked(getCurrentActivityMapKey).mockReturnValue('AELF_ELF');
    const mockPayload = {
      maxResultCount: 1000,
      skipCount: 0,
    };
    await mockStore.dispatch(getActivityListAsync(mockPayload));
    expect(fetchActivities).toBeCalled();
    expect(getCurrentActivityMapKey).toBeCalled();
    const res = mockStore.getState().activityMap;
    expect(res).toHaveProperty('AELF_ELF');
  });
  test('ActivityMap is empty, fetch failed', async () => {
    jest.mocked(fetchActivities).mockRejectedValue({
      code: 500,
      errMsg: 'Service Error',
    });
    const mockPayload = {
      maxResultCount: 1000,
      skipCount: 0,
    };
    await mockStore.dispatch(getActivityListAsync(mockPayload));
    expect(fetchActivities).toBeCalled();
  });
  test('ActivityMap is empty, fetch failed, return error.type', async () => {
    jest.mocked(fetchActivities).mockRejectedValue({
      type: 'Service Error',
    });
    const mockPayload = {
      maxResultCount: 1000,
      skipCount: 0,
    };
    await mockStore.dispatch(getActivityListAsync(mockPayload));
    expect(fetchActivities).toBeCalled();
  });
  test('ActivityMap is empty, fetch failed, return error.error.type', async () => {
    jest.mocked(fetchActivities).mockRejectedValue({
      error: {
        message: 'Service Error',
      },
    });
    const mockPayload = {
      maxResultCount: 1000,
      skipCount: 0,
    };
    await mockStore.dispatch(getActivityListAsync(mockPayload));
    expect(fetchActivities).toBeCalled();
  });

  test('ActivityMap is empty, fetch successful, return no data', async () => {
    jest.mocked(fetchActivities).mockResolvedValue({
      data: [],
      totalRecordCount: 0,
    });
    const mockPayload = {
      maxResultCount: 1000,
      skipCount: 0,
    };
    await mockStore.dispatch(getActivityListAsync(mockPayload));
    expect(fetchActivities).toBeCalled();
  });
  test('ActivityMap exist, fetch and will add a new activityItem', async () => {
    const mockPrevState = {
      activityMap: {
        AELF_ELF: {
          maxResultCount: 10,
          skipCount: 1,
          data: [
            {
              chainId: 'AELF',
              transactionType: 'SocialRecovery' as TransactionTypes,
              transactionName: 'Social Recovery',
              from: 'wallet01',
              to: 'wallet02',
              fromAddress: 'fromAddress',
              toAddress: 'toAddress',
              fromChainId: 'AELF',
              toChainId: 'AELF',
              status: 'MINED',
              transactionId: '',
              blockHash: 'blockHash',
              timestamp: '1682323412',
              isReceived: true,
              amount: '1',
              symbol: 'ELF',
              transactionFees: [
                {
                  symbol: 'ELF',
                  fee: 87385000,
                  feeInUsd: '0.256879427979178',
                  decimals: '8',
                },
              ],
            },
          ],
          totalRecordCount: 100,
          chainId: 'AELF',
          symbol: 'ELF',
        },
      },
      isFetchingActivities: false,
      failedActivityMap: {},
      isLoading: false,
    };
    const mockStore = configureStore({ reducer, preloadedState: mockPrevState as any });
    jest.mocked(fetchActivities).mockResolvedValue({
      data: [
        {
          chainId: 'AELF',
          transactionType: 'SocialRecovery' as TransactionTypes,
          transactionName: 'Social Recovery',
          from: 'wallet01',
          to: 'wallet02',
          fromAddress: 'fromAddress',
          toAddress: 'toAddress',
          fromChainId: 'AELF',
          toChainId: 'AELF',
          status: '',
          transactionId: '',
          blockHash: 'blockHash',
          timestamp: '',
          isReceived: true,
          amount: '1',
          symbol: '',
          transactionFees: [
            {
              symbol: 'ELF',
              fee: 87385000,
              feeInUsd: '0.256879427979178',
              decimals: '8',
            },
          ],
        },
      ],
      totalRecordCount: 1,
    });
    jest.mocked(getCurrentActivityMapKey).mockReturnValue('AELF_ELF');
    const mockPayload = {
      maxResultCount: 10,
      skipCount: 1,
    };
    await mockStore.dispatch(getActivityListAsync(mockPayload));
    expect(fetchActivities).toBeCalled();
    expect(getCurrentActivityMapKey).toBeCalled();
    const res = mockStore.getState().activityMap;
    expect(res['AELF_ELF'].data).toHaveLength(2);
  });
});
