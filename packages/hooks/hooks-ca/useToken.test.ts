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

jest.mock('@portkey-wallet/store/store-ca/tokenManagement/action');
jest.mock('../index', () => {
  return {
    ...jest.requireActual('../index'),
    useAppCommonDispatch: jest.fn(() => async (call: () => void) => {
      return call;
    }),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useFetchSymbolImages', () => {
  test('The getSymbolImagesAsync method is triggered successfully', () => {
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
