import { useRecent, initialRecentData } from './useRecent';
import { useAppCommonDispatch } from '../index';
import { initCurrentChainRecentData } from '@portkey-wallet/store/store-ca/recent/slice';
import { setupStore } from '../../../test/utils/setup';
import { renderHookWithProvider } from '../../../test/utils/render';

jest.mock('../index');
jest.mock('@portkey-wallet/store/store-ca/recent/slice', () => {
  return {
    initCurrentChainRecentData: jest.fn(),
  };
});
jest.mocked(useAppCommonDispatch).mockReturnValue(async (call: () => void) => {
  return call;
});

describe('useRecent', () => {
  it('should return initialRecentData when recentState is undefined', () => {
    const state = { recent: undefined };

    const { result } = renderHookWithProvider(() => useRecent('caAddress'), setupStore(state));

    expect(initCurrentChainRecentData).toHaveBeenCalled();
    expect(result.current).toEqual(initialRecentData);
  });

  it('should return recentState when it exists', () => {
    const data = {
      isFetching: true,
      skipCount: 5,
      maxResultCount: 20,
      totalRecordCount: 10,
      recentContactList: ['1', '2', '3'],
    };
    const state = {
      recent: {
        caAddress: data,
      },
    };

    const { result } = renderHookWithProvider(() => useRecent('caAddress'), setupStore(state));

    expect(result.current).toEqual(data);
  });
});
