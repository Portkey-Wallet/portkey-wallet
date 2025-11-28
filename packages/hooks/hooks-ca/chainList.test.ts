import {
  useChainListFetch,
  useCurrentChainList,
  useCurrentChain,
  useDefaultToken,
  useIsValidSuffix,
  useGetChainInfo,
} from './chainList';
import { renderHook } from '@testing-library/react';
import { useAppCommonDispatch } from '../index';
import { getChainListAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useCurrentWallet, useOriginChainId, useWallet } from './wallet';
import { currentWallet } from '../../../test/data/chainInfo';

jest.mock('@portkey-wallet/store/store-ca/wallet/actions', () => {
  return {
    getChainListAsync: jest.fn(async () => {
      return { payload: [[{ chainId: 'AELF' }, { chainId: 'tDVV' }], { chainId: 'AELF' }] };
    }),
  };
});
jest.mock('./wallet');
jest.mock('../index');
jest.mocked(useAppCommonDispatch).mockReturnValue(async (call: () => void) => {
  return call;
});

describe('useChainListFetch', () => {
  test('check normal flow', () => {
    jest.mocked(useWallet).mockReturnValue({
      currentNetwork: 'TESTNET',
      walletAvatar: '',
      walletType: 'aelf',
      chainList: [],
    });

    renderHook(() => useChainListFetch());
    expect(getChainListAsync).toHaveBeenCalled();
  });
});

describe('useCurrentChainList', () => {
  test('no chainInfo.TESTNET, and return undefined', () => {
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('TESTNET'));
    const { result } = renderHook(() => useCurrentChainList());
    expect(result.current).toBeUndefined();
  });
  test('have chainInfo.MAINNET, and return []', () => {
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('MAINNET'));
    const { result } = renderHook(() => useCurrentChainList());
    expect(result.current).toHaveLength(1);
  });
});

describe('useCurrentChain', () => {
  test('chainInfo have AELF info, and return AELF', () => {
    jest.mocked(useOriginChainId).mockReturnValue('AELF');
    const { result } = renderHook(() => useCurrentChain('AELF'));
    expect(result.current?.chainId).toBe('AELF');
  });
  test('chainInfo not have tDVV info, and return undefined', () => {
    jest.mocked(useOriginChainId).mockReturnValue('tDVV');
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('MAINNET'));
    const { result } = renderHook(() => useCurrentChain());
    expect(result.current).toBeUndefined();
  });
});

describe('useDefaultToken', () => {
  test('chainInfo have AELF info, and return AELF', () => {
    jest.mocked(useOriginChainId).mockReturnValue('AELF');
    const { result } = renderHook(() => useDefaultToken('AELF'));
    expect(result.current?.decimals).toBe('8');
  });
});

describe('useIsValidSuffix', () => {
  test('in TESTNET, chainInfo do not have AELF info, cant get suffix', () => {
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('TESTNET'));
    const { result } = renderHook(() => useIsValidSuffix());
    const res = result.current('AELF');
    expect(res).toBeFalsy();
  });
  test('in MAINNET, chainInfo have AELF info, can get suffix', () => {
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('MAINNET'));
    const { result } = renderHook(() => useIsValidSuffix());
    const res = result.current('AELF');
    expect(res).toBeTruthy();
  });
});

describe('useGetChainInfo', () => {
  test('get AELF MAINNET ChainInfo, and return successfully', async () => {
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('MAINNET'));
    const { result } = renderHook(() => useGetChainInfo());
    const res = await result.current('AELF');
    expect(res).toHaveProperty('chainId', 'AELF');
  });
  test('get tDVV TESTNET ChainInfo, and return successfully', async () => {
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('TESTNET'));
    const { result } = renderHook(() => useGetChainInfo());
    const res = await result.current('tDVV');
    expect(res).toHaveProperty('chainId', 'tDVV');
  });
  test('get tDVW TESTNET ChainInfo, and return undefined', async () => {
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('TESTNET'));
    const { result } = renderHook(() => useGetChainInfo());
    const res = await result.current('tDVW');
    expect(res).toBeUndefined();
  });
});
