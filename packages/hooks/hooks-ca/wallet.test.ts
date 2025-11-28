import { act } from '@testing-library/react';
import { WalletType } from '@portkey-wallet/store/store-ca/wallet/type';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { useCurrentNetworkInfo } from './network';
import {
  useCurrentWalletInfo,
  useCurrentWallet,
  useDeviceList,
  useCaAddresses,
  useCaAddressInfoList,
  useChainIdList,
  useCaInfo,
  useOriginChainId,
  useOtherNetworkLogged,
} from './wallet';
import { setupStore } from '../../../test/utils/setup';
import { renderHookWithProvider } from '../../../test/utils/render';
import { getApolloClient } from '@portkey-wallet/graphql/contract/apollo';
import { extraDataListDecode } from '@portkey-wallet/utils/device';
import { useCaHolderManagerInfoQuery } from '@portkey-wallet/graphql/contract/__generated__/hooks/caHolderManagerInfo';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { ExtraDataDecodeType } from '@portkey-wallet/types/types-ca/device';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { TestnetNetworkInfo } from '../../../test/data/networkState';

jest.mock('./network');
jest.mock('@portkey-wallet/api/api-did');
jest.mock('@portkey-wallet/graphql/contract/apollo');
jest.mock('@portkey-wallet/graphql/contract/__generated__/hooks/caHolderManagerInfo');
jest.mock('@portkey-wallet/utils/device');
const COMPLETE_WALLET_STATE = {
  wallet: {
    chainInfo: {
      TESTNET: [
        {
          caContractAddress: '2w13D...iw4ZF',
          chainId: 'AELF' as ChainId,
          chainName: 'AELF',
          endPoint: 'https://localhost',
          explorerUrl: 'https://localhost',
          id: 'AELF',
          lastModifyTime: '2023-02-25T07:15:23.6079047Z',
        },
        {
          caContractAddress: '2TtDQ...WppP',
          chainId: 'tDVW' as ChainId,
          chainName: 'tDVW',
          endPoint: 'https://localhost',
          explorerUrl: 'https://localhost',
          id: 'tDVW',
          lastModifyTime: '2023-02-25T07:18:48.0341696Z',
        },
      ],
    },
    chainList: [],
    currentNetwork: 'TESTNET' as NetworkType,
    walletAvatar: 'master6',
    walletInfo: {
      AESEncryptMnemonic: 'U6Fs...zHss',
      AESEncryptPrivateKey: 'U6Fs...OxA',
      BIP44Path: "m/44'/1616'/0'/0/0",
      address: '2ZpT...3Udb',
      caInfo: {
        TESTNET: {
          AELF: {
            caAddress: 'hpB...NoVE',
            caHash: '2cd...ec7',
          },
          managerInfo: {
            loginAccount: 'aurora@portkey.finance',
            managerUniqueId: 'f60...66b5',
            requestId: '965...c0be',
            type: 0,
            verificationType: 1,
          },
          tDVW: {
            caAddress: 'c8W...Nkg6',
            caHash: '2cd...ec7',
          },
        },
        MAINNET: undefined,
      },
      publicKey: {
        x: 'abc...bca',
        y: 'abc...bca',
      },
    },
    walletName: 'Wallet k',
    walletType: 'aelf' as WalletType,
    _persist: { version: -1, rehydrated: true },
    originChainId: 'AELF',
  },
};

const INCOMPLETE_WALLET_STATE = {
  wallet: {
    currentNetwork: 'MAINNET' as NetworkType,
    walletInfo: {
      caInfo: {
        TESTNET: undefined,
        MAINNET: undefined,
      },
    },
  },
};

const NO_WALLET_INFO_STATE = {
  wallet: {
    currentNetwork: 'MAINNET' as NetworkType,
    walletInfo: undefined,
  },
};

const EXTRA_DATA_LIST: ExtraDataDecodeType[] = [
  { transactionTime: 1681891953548, deviceInfo: { deviceName: 'Other', deviceType: 0 }, version: '2.0.0' },
];

describe('useCurrentWalletInfo', () => {
  test('complete wallet data, and return successfully', () => {
    const { result } = renderHookWithProvider(useCurrentWalletInfo, setupStore(COMPLETE_WALLET_STATE));
    expect(result.current).toHaveProperty('caHash', '2cd...ec7');
  });

  test('no caInfo.[currentNetwork] data, and return caHash:undefined', () => {
    const { result } = renderHookWithProvider(useCurrentWalletInfo, setupStore(INCOMPLETE_WALLET_STATE));
    expect(result.current).toHaveProperty('caHash', undefined);
  });
});

describe('useCurrentWallet', () => {
  test('complete wallet data, and return successfully', () => {
    const { result } = renderHookWithProvider(useCurrentWallet, setupStore(COMPLETE_WALLET_STATE));
    expect(result.current.chainList).toHaveLength(2);
  });
});

describe('useDeviceList', () => {
  let CA_HOLDER_MANAGER_INFO_DATA: any;
  beforeEach(() => {
    CA_HOLDER_MANAGER_INFO_DATA = {
      caHolderManagerInfo: [
        {
          __typename: 'CAHolderManagerDto',
          id: 'AELF-e6ausH...5FMEXt',
          chainId: 'AELF',
          caHash: 'a0a96f...7b67fa',
          caAddress: 'e6a...MEXt',
          managerInfos: [
            {
              __typename: 'ManagerInfo',
              address: '2n9...fS2e',
              extraData: '{"transactionTime":1681891953548,"deviceInfo":"WjW...zxg","version":"2.0.0"}',
            },
          ],
          originChainId: 'AELF',
        },
      ],
    };
  });
  test('useCaHolderManagerInfoQuery.data is undefined, and return deviceAmount is 0', () => {
    jest.mocked(useCurrentNetworkInfo).mockReturnValue(TestnetNetworkInfo);
    jest
      .mocked(useCaHolderManagerInfoQuery)
      .mockReturnValue({ data: undefined, error: undefined, refetch: jest.fn(), loading: true } as any);

    const { result } = renderHookWithProvider(useDeviceList, setupStore(COMPLETE_WALLET_STATE));
    expect(result.current.deviceList).toHaveLength(0);
    expect(result.current.loading).toBe(true);
  });

  test('complete wallet data, and return deviceAmount is 1', async () => {
    jest.mocked(useCurrentNetworkInfo).mockReturnValue(TestnetNetworkInfo);
    jest.mocked(useCaHolderManagerInfoQuery).mockReturnValue({
      data: CA_HOLDER_MANAGER_INFO_DATA,
      error: undefined,
      refetch: jest.fn(),
      loading: false,
    } as any);
    jest.mocked(extraDataListDecode).mockResolvedValue(EXTRA_DATA_LIST);
    jest.mocked(getApolloClient).mockReturnValue({} as ApolloClient<NormalizedCacheObject>);

    const res = await act(async () => renderHookWithProvider(useDeviceList, setupStore(COMPLETE_WALLET_STATE)));

    expect(res.result.current.deviceList).toHaveLength(1);
    expect(res.result.current.deviceAmount).toBe(1);
    expect(res.result.current.loading).toBe(false);
  });

  test('managerInfos is undefined, and return deviceAmount is 0', async () => {
    jest.mocked(useCurrentNetworkInfo).mockReturnValue(TestnetNetworkInfo);
    const caHolderManagerInfoData = {
      caHolderManagerInfo: [{ ...CA_HOLDER_MANAGER_INFO_DATA.caHolderManagerInfo[0], managerInfos: undefined }],
    };
    jest.mocked(useCaHolderManagerInfoQuery).mockReturnValue({
      data: caHolderManagerInfoData,
      error: undefined,
      refetch: jest.fn(),
      loading: false,
    } as any);
    jest.mocked(extraDataListDecode).mockResolvedValue(EXTRA_DATA_LIST);
    jest.mocked(getApolloClient).mockReturnValue({} as ApolloClient<NormalizedCacheObject>);

    const res = await act(async () => renderHookWithProvider(useDeviceList, setupStore(COMPLETE_WALLET_STATE)));

    expect(res.result.current.deviceList).toHaveLength(0);
    expect(res.result.current.deviceAmount).toBe(0);
    expect(res.result.current.loading).toBe(false);
  });

  test('complete wallet data, and return deviceAmount is 1', async () => {
    jest.mocked(useCurrentNetworkInfo).mockReturnValue(TestnetNetworkInfo);
    const caHolderManagerInfoData = {
      caHolderManagerInfo: [
        {
          ...CA_HOLDER_MANAGER_INFO_DATA.caHolderManagerInfo[0],
          managerInfos: [
            {
              __typename: 'ManagerInfo',
              address: '2n9...fS2e',
            },
          ],
        },
      ],
    };
    jest.mocked(useCaHolderManagerInfoQuery).mockReturnValue({
      data: caHolderManagerInfoData,
      error: undefined,
      refetch: jest.fn(),
      loading: false,
    } as any);
    jest.mocked(extraDataListDecode).mockResolvedValue(EXTRA_DATA_LIST);
    jest.mocked(getApolloClient).mockReturnValue({} as ApolloClient<NormalizedCacheObject>);

    const res = await act(async () => renderHookWithProvider(useDeviceList, setupStore(COMPLETE_WALLET_STATE)));

    expect(res.result.current.deviceList).toHaveLength(1);
    expect(res.result.current.deviceAmount).toBe(1);
    expect(res.result.current.loading).toBe(false);
  });
});

describe('useCaAddressInfoList', () => {
  test('complete wallet data, and return successfully', () => {
    const { result } = renderHookWithProvider(useCaAddressInfoList, setupStore(COMPLETE_WALLET_STATE));
    expect(result.current).toHaveLength(2);
    expect(result.current[0].caAddress).toBe(COMPLETE_WALLET_STATE.wallet.walletInfo.caInfo.TESTNET.AELF.caAddress);
  });
  test('no caInfo.[currentNetwork] data, and return []', () => {
    const { result } = renderHookWithProvider(useCaAddressInfoList, setupStore(INCOMPLETE_WALLET_STATE));
    expect(result.current).toHaveLength(0);
  });
});

describe('useCaAddresses', () => {
  test('complete wallet data, and return successfully', () => {
    const { result } = renderHookWithProvider(useCaAddresses, setupStore(COMPLETE_WALLET_STATE));
    expect(result.current).toHaveLength(2);
  });
  test('no caInfo, and return empty array', () => {
    const { result } = renderHookWithProvider(useCaAddresses, setupStore(INCOMPLETE_WALLET_STATE));
    expect(result.current).toHaveLength(0);
  });
});

describe('useChainIdList', () => {
  test('complete wallet data, and return successfully', () => {
    const { result } = renderHookWithProvider(useChainIdList, setupStore(COMPLETE_WALLET_STATE));
    expect(result.current).toHaveLength(2);
  });
  test('no caInfo, and return empty array', () => {
    const { result } = renderHookWithProvider(useChainIdList, setupStore(INCOMPLETE_WALLET_STATE));
    expect(result.current).toHaveLength(0);
  });
});

describe('useCaInfo', () => {
  test('complete wallet data, and return successfully', () => {
    const { result } = renderHookWithProvider(useCaInfo, setupStore(COMPLETE_WALLET_STATE));
    expect(result.current).toBe(COMPLETE_WALLET_STATE.wallet.chainInfo);
  });
  test('no chainInfo data, and return undefined', () => {
    const { result } = renderHookWithProvider(useCaInfo, setupStore(INCOMPLETE_WALLET_STATE));
    expect(result.current).toBeUndefined();
  });
});

describe('useOriginChainId', () => {
  test('complete wallet data, and return successfully', () => {
    const { result } = renderHookWithProvider(useOriginChainId, setupStore(COMPLETE_WALLET_STATE));
    expect(result.current).toBe(COMPLETE_WALLET_STATE.wallet.originChainId);
  });
  test('no wallet.originChainId data, and return undefined', () => {
    const { result } = renderHookWithProvider(useOriginChainId, setupStore(INCOMPLETE_WALLET_STATE));
    expect(result.current).toBe(DefaultChainId);
  });
});

describe('useOtherNetworkLogged', () => {
  test('complete wallet data, and return true', () => {
    const { result } = renderHookWithProvider(useOtherNetworkLogged, setupStore(COMPLETE_WALLET_STATE));
    expect(result.current).toBe(true);
  });
  test('no walletInfo data, and return false', () => {
    const { result } = renderHookWithProvider(useOtherNetworkLogged, setupStore(NO_WALLET_INFO_STATE));
    expect(result.current).toBe(false);
  });
});
