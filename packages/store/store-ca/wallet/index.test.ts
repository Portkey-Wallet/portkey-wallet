import { ChainId, NetworkType } from '@portkey-wallet/types';
import { VerificationType } from '@portkey-wallet/types/verifier';
import {
  changeNetworkType,
  resetWallet,
  setManagerInfo,
  setCAInfo,
  changePin,
  setCAInfoType,
  setWalletNameAction,
  setOriginChainId,
  resetCaInfo,
  getWalletNameAsync,
} from './actions';
import { changeEncryptStr } from '../../wallet/utils';
import { walletSlice } from './slice';
import { WalletError, WalletType } from './type';
import { checkPassword } from './utils';
import { getCaHolder } from '@portkey-wallet/api/api-did/es/utils';
import { configureStore } from '@reduxjs/toolkit';

const reducer = walletSlice.reducer;
jest.mock('./utils');
jest.mock('../../wallet/utils');
jest.mock('@portkey-wallet/api/api-did/es/utils');

beforeEach(() => {
  jest.restoreAllMocks();
});
describe('changeNetworkType', () => {
  const state = {
    walletAvatar: 'master6',
    walletType: 'aelf' as WalletType,
    walletName: 'Wallet 01',
    currentNetwork: 'MAIN' as NetworkType,
    chainList: [],
  };
  test('Pre network is MAIN. set current network MAIN', () => {
    expect(reducer(state, changeNetworkType('MAIN'))).toEqual(state);
  });
  test('Pre network is MAIN. set current network TESTNET', () => {
    expect(reducer(state, changeNetworkType('TESTNET'))).toEqual({ ...state, currentNetwork: 'TESTNET' });
  });
});

describe('resetWallet', () => {
  const curState = {
    walletAvatar: 'master6',
    walletType: 'aelf' as WalletType,
    walletName: 'Wallet Name',
    currentNetwork: 'TESTNET' as NetworkType,
    chainList: [],
  };
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test('WalletInfo will be reset', () => {
    const res = reducer(curState, resetWallet());
    expect(res.walletName).toEqual('Wallet 01');
    expect(res.currentNetwork).toEqual('MAIN');
  });
});

describe('setCAInfo', () => {
  const payload = {
    caInfo: {
      caAddress: 'caAddress',
      caHash: 'caHash',
    },
    pin: 'pin',
    chainId: 'AELF' as ChainId,
  };
  test('AESEncryptMnemonic does not exist, throw error', () => {
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
    };
    expect(() => reducer(mockState, setCAInfo(payload))).toThrowError(WalletError.noCreateWallet);
  });

  test('payload `s current network dose not exist, update default current network', () => {
    jest.mocked(checkPassword).mockReturnValue('true');
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      chainList: [],
      walletInfo: {
        BIP44Path: 'BIP44Path',
        address: 'address',
        AESEncryptPrivateKey: 'AESEncryptPrivateKey',
        AESEncryptMnemonic: 'AESEncryptMnemonic',
        caInfo: {
          TESTNET: {},
          MAIN: {},
        },
      },
    };
    expect(reducer(mockState as any, setCAInfo(payload)).walletInfo?.caInfo.MAIN.AELF).toEqual({
      caAddress: 'caAddress',
      caHash: 'caHash',
    });
  });
  test('Update chainInfo', () => {
    jest.mocked(checkPassword).mockReturnValue('true');
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
      walletInfo: {
        BIP44Path: 'BIP44Path',
        address: 'address',
        AESEncryptPrivateKey: 'AESEncryptPrivateKey',
        AESEncryptMnemonic: 'AESEncryptMnemonic',
        caInfo: {
          TESTNET: {},
          MAIN: {},
        },
      },
    };
    expect(reducer(mockState, setCAInfo(payload)).walletInfo?.caInfo.TESTNET.AELF).toEqual({
      caAddress: 'caAddress',
      caHash: 'caHash',
    });
  });
});

describe('setManageInfo', () => {
  test('AESEncryptMnemonic does not exist, throw error', () => {
    jest.mocked(checkPassword).mockReturnValue('true');
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
    };
    const payload = {
      managerInfo: {
        managerUniqueId: 'managerUniqueId',
        loginAccount: '1@q.com',
        type: 0,
        verificationType: VerificationType.addGuardian,
      },
      pin: 'pin',
      chainId: 'AELF' as ChainId,
      networkType: 'TESTNET' as NetworkType,
    };
    expect(() => reducer(mockState, setManagerInfo(payload))).toThrowError(WalletError.noCreateWallet);
  });
  test('Ca account does not exist, throw error', () => {
    jest.mocked(checkPassword).mockReturnValue('true');
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
      walletInfo: {
        BIP44Path: 'BIP44Path',
        address: 'address',
        AESEncryptPrivateKey: 'AESEncryptPrivateKey',
        AESEncryptMnemonic: 'AESEncryptMnemonic',
        caInfo: {
          TESTNET: {},
          MAIN: {},
        },
      },
    };
    const payload = {
      managerInfo: {
        managerUniqueId: 'managerUniqueId',
        loginAccount: '1@q.com',
        type: 0,
        verificationType: VerificationType.addGuardian,
      },
      pin: 'pin',
      chainId: 'AELF' as ChainId,
      networkType: 'TESTNET' as NetworkType,
    };
    expect(() => reducer(mockState, setManagerInfo(payload))).toThrowError(WalletError.caAccountExists);
  });
  test('Current network does not exist, will update default chainInfo', () => {
    jest.mocked(checkPassword).mockReturnValue('true');
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      chainList: [],
      originChainId: 'AELF' as ChainId,
      walletInfo: {
        BIP44Path: 'BIP44Path',
        address: 'address',
        AESEncryptPrivateKey: 'AESEncryptPrivateKey',
        AESEncryptMnemonic: 'AESEncryptMnemonic',
        caInfo: {
          TESTNET: {},
        },
      },
    };
    const payload = {
      managerInfo: {
        managerUniqueId: 'managerUniqueId',
        loginAccount: '1@q.com',
        type: 0,
        verificationType: VerificationType.addGuardian,
      },
      pin: 'pin',
      chainId: 'AELF' as ChainId,
    };
    expect(reducer(mockState as any, setManagerInfo(payload))?.walletInfo?.caInfo.MAIN).toEqual({
      originChainId: 'AELF',
      managerInfo: {
        managerUniqueId: 'managerUniqueId',
        loginAccount: '1@q.com',
        type: 0,
        verificationType: VerificationType.addGuardian,
      },
    });
  });
  test('Update chainInfo', () => {
    jest.mocked(checkPassword).mockReturnValue('true');
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
      originChainId: 'AELF' as ChainId,
      walletInfo: {
        BIP44Path: 'BIP44Path',
        address: 'address',
        AESEncryptPrivateKey: 'AESEncryptPrivateKey',
        AESEncryptMnemonic: 'AESEncryptMnemonic',
        caInfo: {
          // TESTNET: {},
          MAIN: {},
        },
      },
    };
    const payload = {
      managerInfo: {
        managerUniqueId: 'managerUniqueId',
        loginAccount: '1@q.com',
        type: 0,
        verificationType: VerificationType.addGuardian,
      },
      pin: 'pin',
      chainId: 'AELF' as ChainId,
      networkType: 'TESTNET' as NetworkType,
    };
    expect(reducer(mockState as any, setManagerInfo(payload))?.walletInfo?.caInfo.TESTNET).toEqual({
      originChainId: 'AELF',
      managerInfo: {
        managerUniqueId: 'managerUniqueId',
        loginAccount: '1@q.com',
        type: 0,
        verificationType: VerificationType.addGuardian,
      },
    });
  });
});

describe('changePin', () => {
  const payload = {
    pin: '111111',
    newPin: '222222',
  };
  const mockState = {
    walletAvatar: 'master1',
    walletType: 'aelf' as WalletType,
    walletName: 'Wallet 02',
    currentNetwork: 'TESTNET' as NetworkType,
    chainList: [],
    walletInfo: {
      BIP44Path: 'BIP44Path',
      address: 'address',
      AESEncryptPrivateKey: '111111',
      AESEncryptMnemonic: '222222',
      caInfo: {
        TESTNET: {},
        MAIN: {},
      },
    },
  };
  test('WalletInfo does not exist, throw error', () => {
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
    };
    expect(() => reducer(mockState, changePin(payload))).toThrowError(WalletError.noCreateWallet);
  });
  test('WalletInfo does not exist, update AESEncryptMnemonic', () => {
    jest.mocked(changeEncryptStr).mockReturnValue('AESEncryptMnemonic');
    expect(reducer(mockState, changePin(payload)).walletInfo?.AESEncryptMnemonic).toEqual('AESEncryptMnemonic');
  });
  test('WalletInfo does not exist, update AESEncryptPrivateKey', () => {
    jest.mocked(changeEncryptStr).mockReturnValue('AESEncryptPrivateKey');
    expect(reducer(mockState, changePin(payload)).walletInfo?.AESEncryptPrivateKey).toEqual('AESEncryptPrivateKey');
  });
});

describe('setCAInfoType', () => {
  jest.mocked(checkPassword).mockReturnValue('true');
  const payload = {
    caInfo: {
      AELF: {
        caAddress: 'caAddress',
        caHash: 'caHash',
      },
    },
    pin: 'pin',
    networkType: 'TESTNET' as NetworkType,
  };
  test('WalletInfo does not exist, throw error', () => {
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
    };
    expect(() => reducer(mockState, setCAInfoType(payload))).toThrowError(WalletError.noCreateWallet);
  });
  test('Current network does not exist, will update MAIN caInfo', () => {
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      chainList: [],
      walletInfo: {
        BIP44Path: 'BIP44Path',
        address: 'address',
        AESEncryptPrivateKey: 'AESEncryptPrivateKey',
        AESEncryptMnemonic: 'AESEncryptMnemonic',
        caInfo: {
          TESTNET: {},
          MAIN: {},
        },
      },
    };
    const payload = {
      caInfo: {
        AELF: {
          caAddress: 'caAddress',
          caHash: 'caHash',
        },
      },
      pin: 'pin',
    };
    expect(reducer(mockState as any, setCAInfoType(payload)).walletInfo?.caInfo.MAIN).toEqual({
      AELF: {
        caAddress: 'caAddress',
        caHash: 'caHash',
      },
    });
  });
  test('WalletInfo exist, update caInfo', () => {
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
      walletInfo: {
        BIP44Path: 'BIP44Path',
        address: 'address',
        AESEncryptPrivateKey: 'AESEncryptPrivateKey',
        AESEncryptMnemonic: 'AESEncryptMnemonic',
        caInfo: {
          TESTNET: {},
          MAIN: {},
        },
      },
    };
    expect(reducer(mockState, setCAInfoType(payload)).walletInfo?.caInfo.TESTNET).toEqual({
      AELF: {
        caAddress: 'caAddress',
        caHash: 'caHash',
      },
    });
  });
});

describe('getWalletNameAsync', () => {
  const preloadedState = {
    wallet: {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
      walletInfo: {
        BIP44Path: 'BIP44Path',
        address: 'address',
        AESEncryptPrivateKey: 'AESEncryptPrivateKey',
        AESEncryptMnemonic: 'AESEncryptMnemonic',
        caInfo: {
          TESTNET: {
            AELF: {
              caAddress: 'caAddress',
              caHash: 'caHash',
            },
          },
          MAIN: {},
        },
      },
    },
  };
  const store = configureStore({ reducer, preloadedState: preloadedState as any });
  test('Update walletName resolved', async () => {
    jest.mocked(getCaHolder).mockResolvedValue({
      items: [
        {
          userId: 'userId',
          caAddress: 'caAddress',
          caHash: 'caHash',
          id: 'id',
          nickName: 'nickName',
        },
      ],
    });
    await store.dispatch(getWalletNameAsync());
    expect(getCaHolder).toBeCalled();
    expect(store.getState().walletName).toEqual('nickName');
  });
  test('Update walletName rejected', async () => {
    jest.mocked(getCaHolder).mockRejectedValue({
      error: 'error',
    });
    await store.dispatch(getWalletNameAsync());
    expect(getCaHolder).toBeCalled();
  });
});

describe('setWalletNameAction', () => {
  test('Update walletName', () => {
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
    };
    expect(reducer(mockState, setWalletNameAction('new WalletName')).walletName).toEqual('new WalletName');
  });
});

describe('setOriginChainId', () => {
  test('Set originChainId successful', () => {
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
    };
    expect(reducer(mockState, setOriginChainId('tDVV')).originChainId).toEqual('tDVV');
  });
});

describe('resetCaInfo', () => {
  test('AESEncryptMnemonic does not exist, throw error', () => {
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
    };
    const payload = 'MAIN';
    expect(() => reducer(mockState, resetCaInfo(payload))).toThrow(WalletError.noCreateWallet);
  });

  test('Reset current network caInfo', () => {
    const mockState = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
      walletInfo: {
        BIP44Path: 'BIP44Path',
        address: 'address',
        AESEncryptPrivateKey: 'AESEncryptPrivateKey',
        AESEncryptMnemonic: 'AESEncryptMnemonic',
        caInfo: {
          TESTNET: {},
          MAIN: {},
        },
      },
    };
    const payload = 'TESTNET';
    expect(reducer(mockState, resetCaInfo(payload)).walletInfo?.caInfo).not.toHaveProperty('TESTNET');
  });
});
