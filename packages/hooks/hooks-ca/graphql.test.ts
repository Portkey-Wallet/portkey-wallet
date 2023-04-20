jest.mock('./chainList');
jest.mock('@portkey-wallet/graphql/index');
jest.mock('../index');

import { renderHook, act } from '@testing-library/react';
import { useIntervalQueryCAInfoByAddress } from './graphql';
import { useCurrentChain } from './chainList';
import { useAppCommonDispatch } from '../index';
import { contractQueries } from '@portkey-wallet/graphql/index';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { CaHolderWithGuardian } from '@portkey-wallet/graphql/contract/types';

jest.mock('@portkey-wallet/store/store-ca/wallet/actions', () => {
  return {
    getChainListAsync: jest.fn(() => {
      return [];
    }),
  };
});
jest.mocked(useAppCommonDispatch).mockReturnValue(async (call: () => void) => {
  return call;
});

const NETWORK: NetworkType = 'TESTNET';
const ADDRESS = '2ZpT...3Udb';
const CHAIN_INFO = {
  caContractAddress: '2w13...w4ZF',
  chainId: 'AELF' as ChainId,
  chainName: 'AELF',
  endPoint: 'https://aelf-test-node.aelf.io',
  explorerUrl: 'https://explorer-test.aelf.io',
  id: 'AELF',
  lastModifyTime: '2023-02-25T07:15:23.6079047Z',
};

describe('useIntervalQueryCAInfoByAddress', () => {
  test('no address, and return undefined', () => {
    jest.mocked(useCurrentChain).mockReturnValue(CHAIN_INFO);

    const { result } = renderHook(() => useIntervalQueryCAInfoByAddress(NETWORK, ''));
    expect(result.current).toBeUndefined();
  });
  test('no chainInfo, and return undefined', () => {
    jest.mocked(useCurrentChain).mockReturnValue(undefined);
    jest.mocked(contractQueries.getCAHolderByManager).mockReturnValue(Promise.resolve({ caHolderManagerInfo: [] }));

    const { result } = renderHook(() => useIntervalQueryCAInfoByAddress(NETWORK, ADDRESS));
    expect(result.current).toBeUndefined();
  });
  test('caHolderManagerInfo.length = 0, and return undefined', () => {
    const caHolderManagerInfo: CaHolderWithGuardian[] = [];
    jest.mocked(useCurrentChain).mockReturnValue(CHAIN_INFO);
    jest
      .mocked(contractQueries.getCAHolderByManager)
      .mockReturnValue(Promise.resolve({ caHolderManagerInfo: caHolderManagerInfo }));

    const { result } = renderHook(() => useIntervalQueryCAInfoByAddress(NETWORK, ADDRESS));
    expect(result.current).toBeUndefined();
  });
  test('have address, but caHolderManagerInfo missing information, and return undefined', () => {
    const caHolderManagerInfo: CaHolderWithGuardian[] = [
      {
        __typename: 'CAHolderManagerDto',
        loginGuardianInfo: [],
      },
    ];

    jest.mocked(useCurrentChain).mockReturnValue(CHAIN_INFO);
    jest
      .mocked(contractQueries.getCAHolderByManager)
      .mockReturnValue(Promise.resolve({ caHolderManagerInfo: caHolderManagerInfo }));

    const { result } = renderHook(() => useIntervalQueryCAInfoByAddress(NETWORK, ADDRESS));
    expect(result.current).toBeUndefined();
  });
  test('have total data, and return successfully', async () => {
    const caHolderManagerInfo: CaHolderWithGuardian[] = [
      {
        __typename: 'CAHolderManagerDto',
        caAddress: 'string',
        caHash: 'string',
        loginGuardianInfo: [
          {
            __typename: 'LoginGuardianDto',
            caAddress: '',
            caHash: '',
            chainId: '',
            id: '',
            loginGuardian: {
              __typename: 'GuardianDto',
              identifierHash: '',
              isLoginGuardian: true,
              salt: '',
              type: 0,
              verifierId: '',
            },
            manager: '',
          },
        ],
      },
    ];

    jest.mocked(useCurrentChain).mockReturnValue(CHAIN_INFO);
    jest
      .mocked(contractQueries.getCAHolderByManager)
      .mockReturnValue(Promise.resolve({ caHolderManagerInfo: caHolderManagerInfo }));

    // When testing, code that causes React state updates should be wrapped into act()
    const res = await act(async () => renderHook(() => useIntervalQueryCAInfoByAddress(NETWORK, ADDRESS)));
    expect(res.result.current).toHaveProperty('AELF', { caAddress: 'string', caHash: 'string' });
  });
  test('getCAHolderByManager reject, and throw error', () => {
    jest.mocked(useCurrentChain).mockReturnValue(CHAIN_INFO);
    jest.mocked(contractQueries.getCAHolderByManager).mockReturnValue(Promise.reject('error'));

    const { result } = renderHook(() => useIntervalQueryCAInfoByAddress(NETWORK, ADDRESS));
    expect(result.current).toBeUndefined();
  });
});
