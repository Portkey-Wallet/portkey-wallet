import { renderHookWithProvider } from '../../../test/utils/render';
import { setupStore } from '../../../test/utils/setup';
import { fetchAllTokenListAsync, getSymbolImagesAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import {
  useToken,
  useMarketTokenListInCurrentChain,
  useIsFetchingTokenList,
  useFetchSymbolImages,
  useSymbolImages,
} from './useToken';
import { TokenManagementState } from '../../../test/data/tokenManagementState';
import * as baseHooks from '../index';
import * as networkHooks from './network';
import { request } from '@portkey-wallet/api/api-did';
import { NetworkInfo } from '../../../test/data/networkState';

jest.mock('@portkey-wallet/store/store-ca/tokenManagement/action');
jest.mock('@portkey-wallet/api/api-did');

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('useToken', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  test('complete data, and return successfully', async () => {
    // mock
    jest.spyOn(baseHooks, 'useAppCommonDispatch').mockReturnValue(() => async (call: () => void) => {
      return call;
    });
    jest.spyOn(networkHooks, 'useCurrentNetworkInfo').mockReturnValue(NetworkInfo);

    jest.mocked(fetchAllTokenListAsync).mockReturnValue({ list: [{}, {}], totalRecordCount: 2 } as any);
    jest.mocked(request.token.displayUserToken).mockResolvedValue({});
    jest.spyOn(global, 'setTimeout');

    // dispatch hook
    const { result } = renderHookWithProvider(useToken, setupStore(TokenManagementState));
    // expect hook
    expect(result.current[0]).toEqual(TokenManagementState.tokenManagement);
    expect(result.current[1]).toHaveProperty('fetchTokenList');
    expect(result.current[1]).toHaveProperty('displayUserToken');

    // dispatch hook result - fetchTokenList
    await result.current[1].fetchTokenList();
    // expect hook result - fetchTokenList
    expect(fetchAllTokenListAsync).toHaveBeenCalled();

    // dispatch hook result - displayUserToken
    const params = {
      tokenItem: {
        address: 'JRm...oAaE',
        chainId: 'AELF',
        decimals: 8,
        id: '217...2bad',
        isAdded: true,
        isDefault: false,
        name: 'CPU',
        symbol: 'CPU',
        tokenName: 'CPU',
        userTokenId: 'a0a...a6d4',
      },
      keyword: '',
      chainIdArray: ['AELF', 'tDVV'],
    };
    await result.current[1].displayUserToken(params);
    jest.runAllTimers();

    // expect hook result - displayUserToken
    expect(request.token.displayUserToken).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(fetchAllTokenListAsync).toHaveBeenCalledTimes(2);
  });
});

describe('useMarketTokenListInCurrentChain', () => {
  test('get tokenManagement.tokenDataShowInMarket', () => {
    const { result } = renderHookWithProvider(useMarketTokenListInCurrentChain, setupStore(TokenManagementState));
    expect(result.current).toBe(TokenManagementState.tokenManagement.tokenDataShowInMarket);
  });
});

describe('useIsFetchingTokenList', () => {
  test('get tokenManagement.isFetching', () => {
    const { result } = renderHookWithProvider(useIsFetchingTokenList, setupStore(TokenManagementState));
    expect(result.current).toBe(TokenManagementState.tokenManagement.isFetching);
  });
});

describe('useFetchSymbolImages', () => {
  test('The getSymbolImagesAsync method is triggered successfully', () => {
    jest.spyOn(baseHooks, 'useAppCommonDispatch').mockReturnValue(() => async (call: () => void) => {
      return call;
    });
    jest.mocked(getSymbolImagesAsync).mockReturnValue('' as any);
    renderHookWithProvider(useFetchSymbolImages, setupStore({}));
    expect(getSymbolImagesAsync).toBeCalled();
  });
});

describe('useSymbolImages', () => {
  test('get tokenManagement.symbolImages', () => {
    const { result } = renderHookWithProvider(useSymbolImages, setupStore(TokenManagementState));
    expect(result.current).toBe(TokenManagementState.tokenManagement.symbolImages);
  });
});
