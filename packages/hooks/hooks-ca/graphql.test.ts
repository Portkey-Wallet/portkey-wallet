import { renderHook, act } from '@testing-library/react';
import { useIntervalQueryCAInfoByAddress, useCheckManager } from './graphql';
import { useCurrentChain } from './chainList';
import { useAppCommonDispatch } from '../index';
import * as graphqlQuery from '@portkey-wallet/graphql/index';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { CaHolderWithGuardian } from '@portkey-wallet/graphql/contract/types';
import * as chainListHooks from './chainList';
import { AELFChainInfo, currentWallet } from '../../../test/data/chainInfo';
import { useCurrentWallet, useOriginChainId } from './wallet';

jest.mock('./chainList');
jest.mock('../index');
jest.mock('./wallet');
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
  endPoint: 'https://localhost',
  explorerUrl: 'https://localhost',
  id: 'AELF',
  lastModifyTime: '2023-02-25T07:15:23.6079047Z',
};

const CA_HOLDER_MANAGER_INFO: CaHolderWithGuardian[] = [
  {
    __typename: 'CAHolderManagerDto',
    caAddress: 'string',
    caHash: 'string',
    loginGuardianInfo: [
      {
        __typename: 'LoginGuardianDto',
        caAddress: '',
        caHash: '',
        chainId: 'AELF',
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
    chainId: 'AELF',
  },
];

describe('useIntervalQueryCAInfoByAddress', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
  test('no address, and return undefined', () => {
    jest.mocked(useCurrentChain).mockReturnValue(CHAIN_INFO);
    const { result } = renderHook(() => useIntervalQueryCAInfoByAddress(NETWORK, ''));
    expect(result.current).toBeUndefined();
  });
  test('no chainInfo, and return undefined', () => {
    jest.mocked(useCurrentChain).mockReturnValue(undefined);
    jest
      .spyOn(graphqlQuery.contractQueries, 'getCAHolderByManager')
      .mockReturnValue(Promise.resolve({ caHolderManagerInfo: [] }));
    const { result } = renderHook(() => useIntervalQueryCAInfoByAddress(NETWORK, ADDRESS));
    expect(result.current).toBeUndefined();
  });
  test('caHolderManagerInfo.length = 0, and return undefined', () => {
    const caHolderManagerInfo: CaHolderWithGuardian[] = [];
    jest.mocked(useCurrentChain).mockReturnValue(CHAIN_INFO);
    jest
      .spyOn(graphqlQuery.contractQueries, 'getCAHolderByManager')
      .mockReturnValue(Promise.resolve({ caHolderManagerInfo: caHolderManagerInfo }));
    const { result } = renderHook(() => useIntervalQueryCAInfoByAddress(NETWORK, ADDRESS));
    expect(result.current).toBeUndefined();
  });
  test('caHolderManagerInfo.length = 0, and return undefined', () => {
    const caHolderManagerInfo: CaHolderWithGuardian[] = [
      {
        ...CA_HOLDER_MANAGER_INFO[0],
        loginGuardianInfo: [{ chainId: 'tDVV' }],
      },
    ];
    jest.mocked(useCurrentChain).mockReturnValue(CHAIN_INFO);
    jest
      .spyOn(graphqlQuery.contractQueries, 'getCAHolderByManager')
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
      .spyOn(graphqlQuery.contractQueries, 'getCAHolderByManager')
      .mockReturnValue(Promise.resolve({ caHolderManagerInfo: caHolderManagerInfo }));
    const { result } = renderHook(() => useIntervalQueryCAInfoByAddress(NETWORK, ADDRESS));
    expect(result.current).toBeUndefined();
  });
  test('have total data, and return successfully', async () => {
    jest.mocked(useCurrentChain).mockReturnValue(CHAIN_INFO);
    jest
      .spyOn(graphqlQuery.contractQueries, 'getCAHolderByManager')
      .mockReturnValue(Promise.resolve({ caHolderManagerInfo: CA_HOLDER_MANAGER_INFO }));
    jest.spyOn(chainListHooks, 'useGetChainInfo').mockReturnValue(() => {
      return Promise.resolve(AELFChainInfo);
    });
    // When testing, code that causes React state updates should be wrapped into act()
    const res = await act(async () => renderHook(() => useIntervalQueryCAInfoByAddress(NETWORK, ADDRESS)));
    expect(res.result.current).toHaveProperty('caInfo');
    expect(res.result.current).toHaveProperty('originChainId', 'AELF');
  });
  test('have no return validateManager, and return undefined', async () => {
    jest.mocked(useCurrentChain).mockReturnValue(CHAIN_INFO);
    jest
      .spyOn(graphqlQuery.contractQueries, 'getCAHolderByManager')
      .mockReturnValue(Promise.resolve({ caHolderManagerInfo: CA_HOLDER_MANAGER_INFO }));
    jest.spyOn(chainListHooks, 'useGetChainInfo').mockReturnValue(() => {
      return Promise.reject({ code: 500 });
    });
    // When testing, code that causes React state updates should be wrapped into act()
    const res = await act(async () => renderHook(() => useIntervalQueryCAInfoByAddress(NETWORK, ADDRESS, jest.fn())));
    expect(res.result.current).toBeUndefined();
  });
  test('no originChainId, and originChainId = DefaultChainId', async () => {
    jest.mocked(useCurrentChain).mockReturnValue(CHAIN_INFO);
    jest
      .spyOn(graphqlQuery.contractQueries, 'getCAHolderByManager')
      .mockReturnValue(Promise.resolve({ caHolderManagerInfo: CA_HOLDER_MANAGER_INFO }));
    jest.spyOn(chainListHooks, 'useGetChainInfo').mockReturnValue(() => {
      return Promise.resolve(AELFChainInfo);
    });
    // When testing, code that causes React state updates should be wrapped into act()
    const res = await act(async () => renderHook(() => useIntervalQueryCAInfoByAddress(NETWORK, ADDRESS)));
    expect(res.result.current).toHaveProperty('caInfo');
    expect(res.result.current).toHaveProperty('originChainId', 'AELF');
  });
  test('getCAHolderByManager reject, and throw error', () => {
    jest.mocked(useCurrentChain).mockReturnValue(CHAIN_INFO);
    jest.spyOn(graphqlQuery.contractQueries, 'getCAHolderByManager').mockReturnValue(Promise.reject('error'));
    const { result } = renderHook(() => useIntervalQueryCAInfoByAddress(NETWORK, ADDRESS));
    expect(result.current).toBeUndefined();
  });
});

describe('useCheckManager', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
  test('complete data, and return successfully', () => {
    const CAHolderManagerInfoRes = {
      data: {
        caHolderManagerInfo: [
          {
            __typename: 'CAHolderManagerDto' as any,
            id: 'AEL...rETp',
            chainId: 'AELF',
            caHash: '2ed...4a71',
            caAddress: 'A4p...rETp',
            managerInfos: [
              {
                __typename: 'ManagerInfo' as any,
                address: 's3m...BojY',
                extraData: '1,1679043726757',
              },
              {
                __typename: 'ManagerInfo' as any,
                address: '2Vv...e2sR',
                extraData: '1,1679380781160',
              },
            ],
            originChainId: 'AELF',
          },
        ],
      },
      loading: false,
      networkStatus: 7,
    };
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('TESTNET'));
    jest.mocked(useOriginChainId).mockReturnValue('AELF');
    jest.spyOn(graphqlQuery.contractQueries, 'getCAHolderManagerInfo').mockResolvedValue(CAHolderManagerInfoRes);

    const mockFun = jest.fn();
    renderHook(() => useCheckManager(mockFun));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(graphqlQuery.contractQueries.getCAHolderManagerInfo).toHaveBeenCalledTimes(1);
  });
  test('caHolderManagerInfo.length is 0, and return successfully', () => {
    const CAHolderManagerInfoRes = {
      data: {
        caHolderManagerInfo: [],
      },
      loading: false,
      networkStatus: 7,
    };
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('TESTNET'));
    jest.mocked(useOriginChainId).mockReturnValue('AELF');
    jest.spyOn(graphqlQuery.contractQueries, 'getCAHolderManagerInfo').mockResolvedValue(CAHolderManagerInfoRes);

    const mockFun = jest.fn();
    renderHook(() => useCheckManager(mockFun));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(graphqlQuery.contractQueries.getCAHolderManagerInfo).toHaveBeenCalledTimes(1);
  });
  test('getCAHolderManagerInfo.data is undefined, and return successfully', () => {
    const CAHolderManagerInfoRes: any = {
      data: undefined,
      loading: false,
      networkStatus: 7,
    };
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('TESTNET'));
    jest.mocked(useOriginChainId).mockReturnValue('AELF');
    jest.spyOn(graphqlQuery.contractQueries, 'getCAHolderManagerInfo').mockResolvedValue(CAHolderManagerInfoRes);

    const mockFun = jest.fn();
    renderHook(() => useCheckManager(mockFun));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(graphqlQuery.contractQueries.getCAHolderManagerInfo).toHaveBeenCalledTimes(1);
    expect(mockFun).toHaveBeenCalledTimes(0);
  });
  test('getCAHolderManagerInfo reject, and catch error', () => {
    jest.mocked(useCurrentWallet).mockReturnValue(currentWallet('TESTNET'));
    jest.mocked(useOriginChainId).mockReturnValue('AELF');
    jest.spyOn(graphqlQuery.contractQueries, 'getCAHolderManagerInfo').mockRejectedValue({ error: {} });

    const mockFun = jest.fn();
    renderHook(() => useCheckManager(mockFun));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(graphqlQuery.contractQueries.getCAHolderManagerInfo).toHaveBeenCalledTimes(1);
  });
  test('no caHash, and do not call getCAHolderManagerInfo', () => {
    jest.mocked(useCurrentWallet).mockReturnValue({
      ...currentWallet('TESTNET'),
      walletInfo: undefined,
    } as any);
    jest.mocked(useOriginChainId).mockReturnValue('AELF');
    jest.spyOn(graphqlQuery.contractQueries, 'getCAHolderManagerInfo').mockRejectedValue({ error: {} });

    const mockFun = jest.fn();
    renderHook(() => useCheckManager(mockFun));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(graphqlQuery.contractQueries.getCAHolderManagerInfo).toHaveBeenCalledTimes(0);
  });
});
