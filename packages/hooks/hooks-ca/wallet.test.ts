import { act } from '@testing-library/react';
import { WalletType } from '@portkey-wallet/store/store-ca/wallet/type';
import { ChainId, ChainType, NetworkType } from '@portkey-wallet/types';
import { request } from '@portkey-wallet/api/api-did';
import { useCurrentNetworkInfo } from './network';
import {
  useCurrentWalletInfo,
  useCurrentWallet,
  useDeviceList,
  useSetWalletName,
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
          endPoint: 'https://aelf-test-node.aelf.io',
          explorerUrl: 'https://explorer-test.aelf.io',
          id: 'AELF',
          lastModifyTime: '2023-02-25T07:15:23.6079047Z',
        },
        {
          caContractAddress: '2TtDQ...WppP',
          chainId: 'tDVW' as ChainId,
          chainName: 'tDVW',
          endPoint: 'https://tdvw-test-node.aelf.io',
          explorerUrl: 'https://explorer-test-side02.aelf.io',
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
            caAddress: 'hpBcYBkhACfrPV3LjK8ePV6CzaMsNopsNungea6w3PFJuNoVE',
            caHash: '2cd...ec7',
          },
          managerInfo: {
            loginAccount: 'yangkexin@portkey.finance',
            managerUniqueId: 'f606b4c8-038d-a830-c470-3a09b34d66b5',
            requestId: '965580154d7943b18813bfc031cfc0be',
            type: 0,
            verificationType: 1,
          },
          tDVW: {
            caAddress: 'c8WTWYtpLAsiVT32CtpQeqXgbv3GDYpzQa8zEWECSHq3ZNkg6',
            caHash: '2cd...ec7',
          },
        },
        MAIN: undefined,
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
    currentNetwork: 'MAIN' as NetworkType,
    walletInfo: {
      caInfo: {
        TESTNET: undefined,
        MAIN: undefined,
      },
    },
  },
};

const NO_WALLET_INFO_STATE = {
  wallet: {
    currentNetwork: 'MAIN' as NetworkType,
    walletInfo: undefined,
  },
};

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
    expect(result.current.chainList.length).toBe(2);
  });
});

describe('useDeviceList', () => {
  test('complete wallet data, and return successfully', () => {
    const networkInfo = {
      apiUrl: 'https://did-portkey-test.portkey.finance',
      connectUrl: 'https://auth-portkey-test.portkey.finance',
      graphqlUrl: 'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql',
      isActive: true,
      name: 'aelf Testnet',
      networkType: 'TESTNET' as NetworkType,
      walletType: 'aelf' as ChainType,
    };
    jest.mocked(useCurrentNetworkInfo).mockReturnValue(networkInfo);
    jest
      .mocked(useCaHolderManagerInfoQuery)
      .mockReturnValue({ data: undefined, error: undefined, refetch: jest.fn(), loading: true } as any);
    const extraDataList: ExtraDataDecodeType[] = [
      { transactionTime: 1681891953548, deviceInfo: { deviceName: 'Other', deviceType: 0 }, version: '2.0.0' },
    ];
    jest.mocked(extraDataListDecode).mockResolvedValue(extraDataList);
    jest.mocked(getApolloClient).mockReturnValue({} as ApolloClient<NormalizedCacheObject>);

    const { result } = renderHookWithProvider(useDeviceList, setupStore(COMPLETE_WALLET_STATE));
    expect(result.current.deviceList.length).toBe(0);
    expect(result.current.loading).toBe(true);
  });

  test('complete wallet data, and return successfully', async () => {
    const networkInfo = {
      apiUrl: 'https://did-portkey-test.portkey.finance',
      connectUrl: 'https://auth-portkey-test.portkey.finance',
      graphqlUrl: 'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql',
      isActive: true,
      name: 'aelf Testnet',
      networkType: 'TESTNET' as NetworkType,
      walletType: 'aelf' as ChainType,
    };
    jest.mocked(useCurrentNetworkInfo).mockReturnValue(networkInfo);
    const useCaHolderManagerInfoQueryData = {
      caHolderManagerInfo: [
        {
          __typename: 'CAHolderManagerDto',
          id: 'AELF-e6ausHQXshHhWdkMX3AsQc6zy3W4418k2axY8c9tUY15FMEXt',
          chainId: 'AELF',
          caHash: 'a0a96f0c4b45719091ede2634dc05b277df4c68c39e2a3465c0c38f61a7b67fa',
          caAddress: 'e6ausHQXshHhWdkMX3AsQc6zy3W4418k2axY8c9tUY15FMEXt',
          managerInfos: [
            {
              __typename: 'ManagerInfo',
              address: '2n9fgWhGos3bHFJieuz6HgfmYV7dbF9DEpkRA4EtVghPgSfS2e',
              extraData:
                '{"transactionTime":1681891953548,"deviceInfo":"WjWf5TwN4/UhaYpuLGlKfaOCdQB1leN3hWJKxa1gEdN/mP82cPAyPdTLxaYa/zxg","version":"2.0.0"}',
            },
          ],
          originChainId: 'AELF',
        },
      ],
    };
    jest.mocked(useCaHolderManagerInfoQuery).mockReturnValue({
      data: useCaHolderManagerInfoQueryData,
      error: undefined,
      refetch: jest.fn(),
      loading: false,
    } as any);
    const extraDataList: ExtraDataDecodeType[] = [
      { transactionTime: 1681891953548, deviceInfo: { deviceName: 'Other', deviceType: 0 }, version: '2.0.0' },
    ];
    jest.mocked(extraDataListDecode).mockResolvedValue(extraDataList);
    jest.mocked(getApolloClient).mockReturnValue({} as ApolloClient<NormalizedCacheObject>);

    const res = await act(async () => renderHookWithProvider(useDeviceList, setupStore(COMPLETE_WALLET_STATE)));
    expect(res.result.current.deviceList.length).toBeGreaterThan(0);
    expect(res.result.current.deviceAmount).toBe(1);
    expect(res.result.current.loading).toBe(false);
  });
});

describe('useCaAddressInfoList', () => {
  test('complete wallet data, and return successfully', () => {
    const { result } = renderHookWithProvider(useCaAddressInfoList, setupStore(COMPLETE_WALLET_STATE));
    expect(result.current.length).toBe(2);
    expect(result.current[0].caAddress).toBe(COMPLETE_WALLET_STATE.wallet.walletInfo.caInfo.TESTNET.AELF.caAddress);
  });
  test('no caInfo.[currentNetwork] data, and return []', () => {
    const { result } = renderHookWithProvider(useCaAddressInfoList, setupStore(INCOMPLETE_WALLET_STATE));
    expect(result.current.length).toBe(0);
  });
});

describe('useSetWalletName', () => {
  test('the useSetWalletName method was successfully called', async () => {
    const networkInfo = {
      apiUrl: 'https://did-portkey-test.portkey.finance',
      connectUrl: 'https://auth-portkey-test.portkey.finance',
      graphqlUrl: 'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql',
      isActive: true,
      name: 'aelf Testnet',
      networkType: 'TESTNET' as NetworkType,
      walletType: 'aelf' as ChainType,
    };
    jest.mocked(useCurrentNetworkInfo).mockReturnValue(networkInfo);
    jest.mocked(request.wallet.editWalletName).mockReturnValue(Promise.resolve(() => jest.fn()));

    const { result } = renderHookWithProvider(useSetWalletName, setupStore(COMPLETE_WALLET_STATE));
    expect(result.current).toBeDefined();

    await result.current('newName');
    expect(result.current).toHaveBeenCalled;
  });
});

describe('useCaAddresses', () => {
  test('complete wallet data, and return successfully', () => {
    const { result } = renderHookWithProvider(useCaAddresses, setupStore(COMPLETE_WALLET_STATE));
    expect(result.current.length).toBe(2);
  });
  test('no caInfo, and return empty array', () => {
    const { result } = renderHookWithProvider(useCaAddresses, setupStore(INCOMPLETE_WALLET_STATE));
    expect(result.current.length).toBe(0);
  });
});

describe('useChainIdList', () => {
  test('complete wallet data, and return successfully', () => {
    const { result } = renderHookWithProvider(useChainIdList, setupStore(COMPLETE_WALLET_STATE));
    expect(result.current.length).toBe(2);
  });
  test('no caInfo, and return empty array', () => {
    const { result } = renderHookWithProvider(useChainIdList, setupStore(INCOMPLETE_WALLET_STATE));
    expect(result.current.length).toBe(0);
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
