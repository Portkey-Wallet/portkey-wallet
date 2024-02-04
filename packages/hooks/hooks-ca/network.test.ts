import { useCurrentWallet } from './wallet';
import { NetworkList } from '@portkey-wallet/constants/constants-ca/network';
import { useCurrentNetworkInfo, useCurrentApiUrl, useVerifierList, useIsMainnet } from './network';
import { renderHook } from '@testing-library/react';
import { renderHookWithProvider } from '../../../test/utils/render';
import { setupStore } from '../../../test/utils/setup';
import { currentWallet } from '../../../test/data/chainInfo';

jest.mock('./wallet');

/**
 * useNetworkList method, tested by executing the useCurrentNetworkInfo method
 */

describe('useCurrentNetworkInfo', () => {
  it('currentNetwork is TESTNET, and return successfully', () => {
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('TESTNET'));
    const { result } = renderHook(() => useCurrentNetworkInfo());
    expect(result.current).toEqual(NetworkList[1]);
  });
  it('currentNetwork is MAINNET, and return successfully', () => {
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('MAINNET'));
    const { result } = renderHook(() => useCurrentNetworkInfo());
    expect(result.current).toEqual(NetworkList[0]);
  });
  it('currentNetwork is not exist in NetworkList, and return default NetworkList item', () => {
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('XXX' as any));
    const { result } = renderHook(() => useCurrentNetworkInfo());
    expect(result.current).toEqual(NetworkList[0]);
  });
});

describe('useCurrentApiUrl', () => {
  it('currentNetwork is TESTNET, and return NetworkList[0].apiUrl', () => {
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('TESTNET'));
    const { result } = renderHook(() => useCurrentApiUrl());
    expect(result.current).toEqual(NetworkList[1].apiUrl);
  });
});

describe('useVerifierList', () => {
  it('verifierMap is undefined, and return []', () => {
    const state = {
      guardians: {},
    };

    const { result } = renderHookWithProvider(useVerifierList, setupStore(state));

    expect(result.current).toEqual([]);
  });
  it('verifierMap is , and return ', () => {
    const verifierMapItem = {
      '2ded6...68dbda8': {
        id: '2ded6...68dbda8', //aelf.Hash
        name: 'CryptoGuardian',
        imageUrl: 'https://localhost/CryptoGuardian.png',
        endPoints: ['http://localhost'],
        verifierAddresses: ['2bWw...dSb4hJz'],
      },
    };
    const state = {
      guardians: {
        verifierMap: [verifierMapItem],
      },
    };

    const { result } = renderHookWithProvider(useVerifierList, setupStore(state));

    expect(result.current).toEqual([verifierMapItem]);
  });
});

describe('useIsMainnet', () => {
  it('currentNetwork is TESTNET, and return false', () => {
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('TESTNET'));
    const { result } = renderHook(() => useIsMainnet());
    expect(result.current).toEqual(false);
  });
  it('currentNetwork is MAINNET, and return true', () => {
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('MAINNET'));
    const { result } = renderHook(() => useIsMainnet());
    expect(result.current).toEqual(true);
  });
});
