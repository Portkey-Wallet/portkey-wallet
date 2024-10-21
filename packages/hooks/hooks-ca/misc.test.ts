import { MiscState } from '../../../test/data/miscState';
import { renderHookWithProvider } from '../../../test/utils/render';
import { setupStore } from '../../../test/utils/setup';
import { useMisc, useSetLocalPhoneCountryCode, usePhoneCountryCode, useIsScanQRCode } from './misc';
import { useAppCommonDispatch } from '../index';
import { renderHook } from '@testing-library/react';
import { CountryItem } from '@portkey-wallet/types/types-ca/country';
import * as MiscActions from '@portkey-wallet/store/store-ca/misc/actions';
import * as indexHook from './index';
import * as networkHook from '@portkey-wallet/hooks/hooks-ca/network';
import { MainnetNetworkInfo, TestnetNetworkInfo } from '../../../test/data/networkState';
import { DefaultCountry } from '@portkey-wallet/constants/constants-ca/country';
import signalrDid from '@portkey-wallet/socket/socket-did';

jest.mock('../index', () => ({
  useAppCommonDispatch: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe('useMisc', () => {
  test('get misc data successfully', () => {
    const { result } = renderHookWithProvider(useMisc, setupStore(MiscState));

    expect(result.current).toHaveProperty('phoneCountryCodeListChainMap');
    expect(result.current).toHaveProperty('defaultPhoneCountryCode');
    expect(result.current.defaultPhoneCountryCode).toEqual(MiscState.misc.defaultPhoneCountryCode);
  });
  test('failed to get misc data', () => {
    const { result } = renderHookWithProvider(useMisc, setupStore({}));

    expect(result.current).toBeUndefined();
  });
});

describe('useSetLocalPhoneCountryCode', () => {
  it('should call useAppCommonDispatch with setLocalPhoneCountryCodeAction when called', () => {
    const dispatchMock = jest.fn();
    const countryItemMock: CountryItem = { country: 'US', code: '+1', iso: 'US' };

    (useAppCommonDispatch as jest.Mock).mockReturnValue(dispatchMock);
    jest.spyOn(MiscActions, 'setLocalPhoneCountryCodeAction').mockImplementation(jest.fn());

    const { result } = renderHook(() => useSetLocalPhoneCountryCode());
    const setLocalPhoneCountryCode = result.current;

    setLocalPhoneCountryCode(countryItemMock);

    expect(useAppCommonDispatch).toHaveBeenCalled();
    expect(MiscActions.setLocalPhoneCountryCodeAction).toHaveBeenCalled();
  });
});

describe('usePhoneCountryCode', () => {
  test('should return correct values', () => {
    const dispatchMock = jest.fn();
    const useAppCASelectorMock = jest.fn().mockReturnValue(MiscState.misc);

    jest.spyOn(indexHook, 'useAppCASelector').mockImplementation(useAppCASelectorMock);
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);
    jest.spyOn(networkHook, 'useNetworkList').mockReturnValue([TestnetNetworkInfo, MainnetNetworkInfo]);
    (useAppCommonDispatch as jest.Mock).mockReturnValue(dispatchMock);
    jest.spyOn(MiscActions, 'getPhoneCountryCode').mockImplementation(jest.fn());

    const { result } = renderHook(() => usePhoneCountryCode(true));

    expect(result.current.phoneCountryCodeList).toHaveLength(8);
    expect(result.current.phoneCountryCodeIndex).toHaveLength(7);
    expect(result.current.localPhoneCountryCode).toEqual(MiscState.misc.localPhoneCountryCode);
  });

  test('not localPhoneCountryCode, and return correct values', () => {
    const dispatchMock = jest.fn();
    const useAppCASelectorMock = jest.fn().mockReturnValue({
      phoneCountryCodeListChainMap: [MiscState.misc.phoneCountryCodeListChainMap?.MAINNET],
      defaultPhoneCountryCode: MiscState.misc.defaultPhoneCountryCode,
    });

    jest.spyOn(indexHook, 'useAppCASelector').mockImplementation(useAppCASelectorMock);
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);
    jest.spyOn(networkHook, 'useNetworkList').mockReturnValue([TestnetNetworkInfo, MainnetNetworkInfo]);
    (useAppCommonDispatch as jest.Mock).mockReturnValue(dispatchMock);
    jest.spyOn(MiscActions, 'getPhoneCountryCode').mockImplementation(jest.fn());

    const { result } = renderHook(() => usePhoneCountryCode(true));

    expect(result.current.phoneCountryCodeList).toHaveLength(0);
    expect(result.current.phoneCountryCodeIndex).toHaveLength(0);
    expect(result.current.localPhoneCountryCode).toEqual(MiscState.misc.defaultPhoneCountryCode);
  });

  test('not localPhoneCountryCode and defaultPhoneCountryCode, and return correct values', () => {
    const dispatchMock = jest.fn();
    const useAppCASelectorMock = jest.fn().mockReturnValue({
      phoneCountryCodeListChainMap: [MiscState.misc.phoneCountryCodeListChainMap?.MAINNET],
    });

    jest.spyOn(indexHook, 'useAppCASelector').mockImplementation(useAppCASelectorMock);
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);
    jest.spyOn(networkHook, 'useNetworkList').mockReturnValue([TestnetNetworkInfo, MainnetNetworkInfo]);
    (useAppCommonDispatch as jest.Mock).mockReturnValue(dispatchMock);
    jest.spyOn(MiscActions, 'getPhoneCountryCode').mockImplementation(jest.fn());

    const { result } = renderHook(() => usePhoneCountryCode(true));

    expect(result.current.phoneCountryCodeList).toHaveLength(0);
    expect(result.current.phoneCountryCodeIndex).toHaveLength(0);
    expect(result.current.localPhoneCountryCode).toEqual(DefaultCountry);
  });

  test('should dispatch getPhoneCountryCode only for current networkType when not initializing', () => {
    const dispatchMock = jest.fn();
    const useAppCASelectorMock = jest.fn().mockReturnValue(MiscState.misc);

    jest.spyOn(indexHook, 'useAppCASelector').mockImplementation(useAppCASelectorMock);
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);
    jest.spyOn(networkHook, 'useNetworkList').mockReturnValue([TestnetNetworkInfo, MainnetNetworkInfo]);
    (useAppCommonDispatch as jest.Mock).mockReturnValue(dispatchMock);
    jest.spyOn(MiscActions, 'getPhoneCountryCode').mockImplementation(jest.fn());

    const { result, rerender } = renderHook(usePhoneCountryCode);

    rerender(true);

    expect(result.current.phoneCountryCodeList).toHaveLength(8);
    expect(result.current.phoneCountryCodeIndex).toHaveLength(7);
    expect(result.current.localPhoneCountryCode).toEqual(MiscState.misc.localPhoneCountryCode);
  });
});

describe('useIsScanQRCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should return false by default', () => {
    const { result } = renderHook(() => useIsScanQRCode(undefined));
    expect(result.current).toBe(false);
  });

  it('should set isScanQRCode to true when onScanLogin is called', () => {
    jest.spyOn(signalrDid, 'stop').mockImplementation(jest.fn());
    jest.spyOn(signalrDid, 'onScanLogin').mockImplementation(
      jest.fn(callback => {
        callback?.({} as any);
        return {
          remove: jest.fn(),
        };
      }),
    );
    jest.spyOn(signalrDid, 'doOpen').mockImplementation(jest.fn());

    const { result } = renderHook(() => useIsScanQRCode('clientId'));

    expect(result.current).toBe(true);
  });

  it('signalrDid.stop throw error, and catch error', async () => {
    jest.spyOn(signalrDid, 'stop').mockImplementation(
      jest.fn(() => {
        throw Error;
      }),
    );
    jest.spyOn(signalrDid, 'onScanLogin').mockImplementation(
      jest.fn(callback => {
        callback?.({} as any);
        return {
          remove: jest.fn(),
        };
      }),
    );
    jest.spyOn(signalrDid, 'doOpen').mockRejectedValue({ error: 'signalrDid.doOpen' });

    const { result } = renderHook(() => useIsScanQRCode('clientId'));
    expect(result.current).toBe(true);
  });
});
