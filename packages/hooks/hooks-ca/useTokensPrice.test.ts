import {
  useGetCurrentAccountTokenPrice,
  useFreshTokenPrice,
  useAmountInUsdShow,
  useIsTokenHasPrice,
} from './useTokensPrice';
import * as assetSlice from '@portkey-wallet/store/store-ca/assets/slice';
import * as baseHooks from '../index';
import { renderHookWithProvider } from '../../../test/utils/render';
import { setupStore } from '../../../test/utils/setup';
import { AssetsState } from '../../../test/data/assetsState';
import * as networkHooks from './network';

describe('useGetCurrentAccountTokenPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('complete data, and return successfully', () => {
    jest.spyOn(baseHooks, 'useAppCommonDispatch').mockReturnValue(() => async (call: () => void) => {
      return call;
    });
    jest.spyOn(assetSlice, 'fetchTokensPriceAsync').mockReturnValue({} as any);
    const { result } = renderHookWithProvider(useGetCurrentAccountTokenPrice, setupStore(AssetsState));
    expect(result.current[1]).toBeInstanceOf(Function);

    result.current[1]();
    expect(assetSlice.fetchTokensPriceAsync).toHaveBeenCalledTimes(1);
  });

  test('set ELF params, and return successfully', () => {
    jest.spyOn(baseHooks, 'useAppCommonDispatch').mockReturnValue(() => async (call: () => void) => {
      return call;
    });
    jest.spyOn(assetSlice, 'fetchTokensPriceAsync').mockReturnValue({} as any);
    const { result } = renderHookWithProvider(useGetCurrentAccountTokenPrice, setupStore(AssetsState));
    expect(result.current[1]).toBeInstanceOf(Function);

    result.current[1]('ELF');
    expect(assetSlice.fetchTokensPriceAsync).toHaveBeenCalledTimes(1);
  });

  test('no accountToken data, and do not call fetchTokensPriceAsync method', () => {
    jest.spyOn(baseHooks, 'useAppCommonDispatch').mockReturnValue(() => async (call: () => void) => {
      return call;
    });
    const { result } = renderHookWithProvider(
      useGetCurrentAccountTokenPrice,
      setupStore({ assets: { ...AssetsState.assets, accountToken: [] } }),
    );
    expect(result.current[1]).toBeInstanceOf(Function);

    result.current[1]();
    expect(assetSlice.fetchTokensPriceAsync).toHaveBeenCalledTimes(0);
  });
});

describe('useFreshTokenPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Mainnet, and fetchTokensPriceAsync method is called', () => {
    jest.spyOn(baseHooks, 'useAppCommonDispatch').mockReturnValue(() => async (call: () => void) => {
      return call;
    });
    jest.spyOn(assetSlice, 'fetchTokensPriceAsync').mockReturnValue({} as any);
    jest.spyOn(networkHooks, 'useIsMainnet').mockReturnValue(true);

    renderHookWithProvider(useFreshTokenPrice, setupStore(AssetsState));

    expect(assetSlice.fetchTokensPriceAsync).toBeCalledTimes(1);
  });

  test('Testnet, and fetchTokensPriceAsync method is not called', () => {
    jest.spyOn(baseHooks, 'useAppCommonDispatch').mockReturnValue(() => async (call: () => void) => {
      return call;
    });
    jest.spyOn(networkHooks, 'useIsMainnet').mockReturnValue(false);

    renderHookWithProvider(useFreshTokenPrice, setupStore({ assets: { ...AssetsState.assets, accountToken: [] } }));

    expect(assetSlice.fetchTokensPriceAsync).toBeCalledTimes(0);
  });
});

describe('useAmountInUsdShow', () => {
  test('ELF price is 0.294964, and return successful usd', () => {
    jest.spyOn(baseHooks, 'useAppCommonDispatch').mockReturnValue(() => async (call: () => void) => {
      return call;
    });
    jest.spyOn(assetSlice, 'fetchTokensPriceAsync').mockReturnValue({} as any);
    const { result } = renderHookWithProvider(useAmountInUsdShow, setupStore(AssetsState));
    const res = result.current(100, 0, 'ELF');
    expect(res).toEqual('$ 29.49');
  });
  test('ELF price is 0, and return empty string', () => {
    jest.spyOn(baseHooks, 'useAppCommonDispatch').mockReturnValue(() => async (call: () => void) => {
      return call;
    });
    jest.spyOn(assetSlice, 'fetchTokensPriceAsync').mockReturnValue({} as any);
    const { result } = renderHookWithProvider(
      useAmountInUsdShow,
      setupStore({
        assets: { ...AssetsState.assets, tokenPrices: { isFetching: false, tokenPriceObject: { ELF: 0 } } },
      }),
    );
    const res = result.current(100, 0, 'ELF');
    expect(res).toEqual('');
  });
});

describe('useIsTokenHasPrice', () => {
  test('complete data, and return successfully', () => {
    const { result } = renderHookWithProvider(useIsTokenHasPrice, setupStore(AssetsState));
    expect(result.current).toBeFalsy();
  });

  test('complete data, and return successfully', () => {
    const { result } = renderHookWithProvider(() => useIsTokenHasPrice('ETH'), setupStore(AssetsState));
    expect(result.current).toBeFalsy();
  });

  test('complete data, and return successfully', () => {
    const { result } = renderHookWithProvider(() => useIsTokenHasPrice('ELF'), setupStore(AssetsState));
    expect(result.current).toBeTruthy();
  });
});
