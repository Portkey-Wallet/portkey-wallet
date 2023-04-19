import { WalletType } from '@portkey-wallet/store/store-ca/wallet/type';
import { ChainId, ChainType, NetworkType } from '@portkey-wallet/types';
import { request } from '@portkey-wallet/api/api-did';
import { useCurrentNetworkInfo } from './network';
import { useCurrentWalletInfo, useCurrentWallet, useSetWalletName, useCaAddresses, useChainIdList } from './wallet';
import { setupStore } from '../../../test/utils/setup';
import { renderHookWithProvider } from '../../../test/utils/render';

jest.mock('./network');
jest.mock('@portkey-wallet/api/api-did');
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
