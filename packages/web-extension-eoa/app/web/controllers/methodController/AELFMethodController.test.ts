import AELFMethodController from './AELFMethodController';
import NotificationService from 'service/NotificationService';
import ApprovalController from 'controllers/approval/ApprovalController';
import errorHandler from 'utils/errorHandler';
import { MethodsBase, MethodsWallet, ResponseCode } from '@portkey/provider-types';
import SWEventController from 'controllers/SWEventController';
import * as utils from '@portkey-wallet/utils';
import { removeLocalStorage, setLocalStorage } from 'utils/storage/chromeStorage';

jest.mock('service/NotificationService', () => {
  return jest.fn().mockImplementation(() => ({
    openPrompt: jest.fn(),
  }));
});
jest.mock('controllers/SWEventController', () => ({
  dispatchEvent: jest.fn().mockImplementation(() => ({})),
}));
jest.mock('utils/storage/chromeStorage', () => ({
  setLocalStorage: jest.fn(),
  removeLocalStorage: jest.fn(),
}));

describe('AELFMethodController', () => {
  describe('dispenseMessage', () => {
    const getPageState = jest.fn().mockReturnValue({
      lockTime: 60,
      registerStatus: undefined,
      wallet: {},
    });
    const getPassword = jest.fn().mockReturnValue('123456');
    const aelfMethodController = new AELFMethodController({
      notificationService: new NotificationService(),
      approvalController: new ApprovalController({
        notificationService: new NotificationService(),
        getPageState,
      }),
      getPageState,
      getPassword,
    });
    let sendResponse: any;
    const chainIds = ['AELF', 'tDVW'];
    const mockDappManager = {
      chainIds: jest.fn().mockResolvedValue(chainIds),
      locked: jest.fn().mockReturnValue(false),
    };
    (aelfMethodController as any).dappManager = mockDappManager;
    beforeEach(() => {
      sendResponse = jest.fn();
    });
    test('message.type is not exist', async () => {
      const message = {};
      aelfMethodController.dispenseMessage(message as any, sendResponse);
      expect(sendResponse).toHaveBeenCalledWith(errorHandler(700001, 'Not Support'));
    });
    test('message.type is MethodsBase.CHAIN_ID', async () => {
      const message = {
        type: MethodsBase.CHAIN_ID,
      };
      jest.spyOn(aelfMethodController, 'getChainId');
      aelfMethodController.dispenseMessage(message as any, sendResponse);
      expect(aelfMethodController.getChainId).toHaveBeenCalled();
    });
    test('message.type is MethodsBase.CHAIN_IDS', async () => {
      const message = {
        type: MethodsBase.CHAIN_IDS,
      };
      jest.spyOn(aelfMethodController, 'getChainIds');
      aelfMethodController.dispenseMessage(message as any, sendResponse);
      expect(aelfMethodController.getChainIds).toHaveBeenCalled();
    });
    test('message.type is MethodsBase.ACCOUNTS', async () => {
      const message = {
        type: MethodsBase.ACCOUNTS,
      };
      jest.spyOn(aelfMethodController, 'getAccounts');
      aelfMethodController.dispenseMessage(message as any, sendResponse);
      expect(aelfMethodController.getAccounts).toHaveBeenCalled();
    });
    test('message.type is MethodsBase.CHAINS_INFO', async () => {
      const message = {
        type: MethodsBase.CHAINS_INFO,
      };
      jest.spyOn(aelfMethodController, 'getChainsInfo');
      aelfMethodController.dispenseMessage(message as any, sendResponse);
      expect(aelfMethodController.getChainsInfo).toHaveBeenCalled();
    });
    test('message.type is MethodsBase.SEND_TRANSACTION', async () => {
      const message = {
        type: MethodsBase.SEND_TRANSACTION,
      };
      jest.spyOn(aelfMethodController, 'sendTransaction');
      aelfMethodController.dispenseMessage(message as any, sendResponse);
      expect(aelfMethodController.sendTransaction).toHaveBeenCalled();
    });
    test('message.type is MethodsBase.REQUEST_ACCOUNTS', async () => {
      const message = {
        type: MethodsBase.REQUEST_ACCOUNTS,
      };
      jest.spyOn(aelfMethodController, 'requestAccounts');
      aelfMethodController.dispenseMessage(message as any, sendResponse);
      expect(aelfMethodController.requestAccounts).toHaveBeenCalled();
    });
    test('message.type is MethodsBase.NETWORK', async () => {
      const message = {
        type: MethodsBase.NETWORK,
      };
      jest.spyOn(aelfMethodController, 'getNetwork');
      aelfMethodController.dispenseMessage(message as any, sendResponse);
      expect(aelfMethodController.getNetwork).toHaveBeenCalled();
    });
    test('message.type is MethodsWallet.GET_WALLET_SIGNATURE', async () => {
      const message = {
        type: MethodsWallet.GET_WALLET_SIGNATURE,
      };
      jest.spyOn(aelfMethodController, 'getSignature');
      aelfMethodController.dispenseMessage(message as any, sendResponse);
      expect(aelfMethodController.getSignature).toHaveBeenCalled();
    });
    test('message.type is MethodsWallet.GET_WALLET_STATE', async () => {
      const message = {
        type: MethodsWallet.GET_WALLET_STATE,
      };
      jest.spyOn(aelfMethodController, 'getWalletState');
      aelfMethodController.dispenseMessage(message as any, sendResponse);
      expect(aelfMethodController.getWalletState).toHaveBeenCalled();
    });
    test('message.type is MethodsWallet.GET_WALLET_NAME', async () => {
      const message = {
        type: MethodsWallet.GET_WALLET_NAME,
      };
      jest.spyOn(aelfMethodController, 'getWalletName');
      aelfMethodController.dispenseMessage(message as any, sendResponse);
      expect(aelfMethodController.getWalletName).toHaveBeenCalled();
    });
    test('message.type is other type', async () => {
      const message = {
        type: 'OTHER',
      };
      aelfMethodController.dispenseMessage(message as any, sendResponse);
      expect(sendResponse).toHaveBeenCalledWith(errorHandler(700001, 'Not Support'));
    });
  });

  describe('isUnlocked', () => {
    const getPageState = jest.fn().mockReturnValue({
      lockTime: 60,
      registerStatus: undefined,
      wallet: {},
    });
    test('should return true if the password is exist', () => {
      const getPassword = jest.fn().mockReturnValue('123456');
      const aelfMethodController = new AELFMethodController({
        notificationService: new NotificationService(),
        approvalController: new ApprovalController({
          notificationService: new NotificationService(),
          getPageState,
        }),
        getPageState,
        getPassword,
      });
      expect(aelfMethodController.isUnlocked()).toBe(true);
    });
    test('should return false if the password is not exist', () => {
      const getPassword = jest.fn().mockReturnValue(null);
      const aelfMethodController = new AELFMethodController({
        notificationService: new NotificationService(),
        approvalController: new ApprovalController({
          notificationService: new NotificationService(),
          getPageState,
        }),
        getPageState,
        getPassword,
      });
      expect(aelfMethodController.isUnlocked()).toBe(false);
    });
  });

  describe('getWalletName', () => {
    const getPageState = jest.fn().mockReturnValue({
      lockTime: 60,
      registerStatus: undefined,
      wallet: {},
    });
    const getPassword = jest.fn().mockReturnValue('123456');
    const aelfMethodController = new AELFMethodController({
      notificationService: new NotificationService(),
      approvalController: new ApprovalController({
        notificationService: new NotificationService(),
        getPageState,
      }),
      getPageState,
      getPassword,
    });
    const message = {
      origin: 'origin',
    };
    let sendResponse: any;
    beforeEach(() => {
      sendResponse = jest.fn();
    });
    test('isActive return true', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        walletName: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      const sendResponse = jest.fn();
      await aelfMethodController.getWalletName(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(0),
        data: await mockDappManager.walletName(),
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('isActive return false', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(false),
        walletName: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.getWalletName(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(400001),
        data: {
          code: ResponseCode.UNAUTHENTICATED,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('isActive throw error', async () => {
      const mockDappManager = {
        isActive: jest.fn(() => {
          throw new Error('error');
        }),
        walletName: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.getWalletName(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(500001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
  });

  describe('getWalletState', () => {
    const getPageState = jest.fn().mockReturnValue({
      lockTime: 60,
      registerStatus: undefined,
      wallet: {},
    });
    const getPassword = jest.fn().mockReturnValue('123456');
    const aelfMethodController = new AELFMethodController({
      notificationService: new NotificationService(),
      approvalController: new ApprovalController({
        notificationService: new NotificationService(),
        getPageState,
      }),
      getPageState,
      getPassword,
    });
    const message = {
      origin: 'origin',
    };
    let sendResponse: any;
    beforeEach(() => {
      sendResponse = jest.fn();
    });
    test('isActive return true', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        accounts: jest.fn().mockResolvedValue({}),
        chainId: jest.fn().mockResolvedValue({}),
        getWallet: jest.fn().mockResolvedValue({ currentNetwork: 'MAINNET' }),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      aelfMethodController.isUnlocked = jest.fn().mockReturnValue(true);
      await aelfMethodController.getWalletState(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(0),
        data: {
          isUnlocked: true,
          isConnected: true,
          accounts: {},
          chainIds: {},
          networkType: 'MAINNET',
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('isActive return false', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(false),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      aelfMethodController.isUnlocked = jest.fn().mockReturnValue(true);
      await aelfMethodController.getWalletState(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(0),
        data: {
          isUnlocked: true,
          isConnected: false,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('isActive throw error', async () => {
      const errorMsg = {
        message: 'get accounts error',
      };
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        accounts: jest.fn().mockRejectedValue(errorMsg),
        chainId: jest.fn().mockResolvedValue({}),
        getWallet: jest.fn().mockResolvedValue({ currentNetwork: 'MAINNET' }),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      aelfMethodController.isUnlocked = jest.fn().mockReturnValue(true);
      await aelfMethodController.getWalletState(sendResponse, message as any);
      const expectParams = {
        error: 200002,
        message: errorMsg.message,
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
  });

  describe('getChainsInfo', () => {
    const getPageState = jest.fn().mockReturnValue({
      lockTime: 60,
      registerStatus: undefined,
      wallet: {},
    });
    const getPassword = jest.fn().mockReturnValue('123456');
    const aelfMethodController = new AELFMethodController({
      notificationService: new NotificationService(),
      approvalController: new ApprovalController({
        notificationService: new NotificationService(),
        getPageState,
      }),
      getPageState,
      getPassword,
    });
    const message = {
      origin: 'origin',
    };
    let sendResponse: any;
    beforeEach(() => {
      sendResponse = jest.fn();
    });
    test('get chainsInfo successful', async () => {
      const mockDappManager = {
        chainsInfo: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.getChainsInfo(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(0),
        data: {},
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('chainsInfo throw error', async () => {
      const mockDappManager = {
        chainsInfo: jest.fn().mockRejectedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.getChainsInfo(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
  });

  describe('getAccounts', () => {
    const getPageState = jest.fn().mockReturnValue({
      lockTime: 60,
      registerStatus: undefined,
      wallet: {},
    });
    const getPassword = jest.fn().mockReturnValue('123456');
    const aelfMethodController = new AELFMethodController({
      notificationService: new NotificationService(),
      approvalController: new ApprovalController({
        notificationService: new NotificationService(),
        getPageState,
      }),
      getPageState,
      getPassword,
    });
    const message = {
      origin: 'origin',
    };
    let sendResponse: any;
    beforeEach(() => {
      sendResponse = jest.fn();
    });
    test('return accounts if isUnlocked return true', async () => {
      const mockDappManager = {
        accounts: jest.fn().mockResolvedValue({ AELF: {} }),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      aelfMethodController.isUnlocked = jest.fn().mockReturnValue(true);
      await aelfMethodController.getAccounts(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(0),
        data: { AELF: {} },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('return {} if isUnlocked return false', async () => {
      const mockDappManager = {
        accounts: jest.fn().mockResolvedValue({ AELF: {} }),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      aelfMethodController.isUnlocked = jest.fn().mockReturnValue(false);
      await aelfMethodController.getAccounts(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(0),
        data: {},
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('accounts throw error', async () => {
      const mockDappManager = {
        accounts: jest.fn().mockRejectedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      aelfMethodController.isUnlocked = jest.fn().mockReturnValue(true);
      await aelfMethodController.getAccounts(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
  });

  describe('getChainId', () => {
    const getPageState = jest.fn().mockReturnValue({
      lockTime: 60,
      registerStatus: undefined,
      wallet: {},
    });
    const getPassword = jest.fn().mockReturnValue('123456');
    const aelfMethodController = new AELFMethodController({
      notificationService: new NotificationService(),
      approvalController: new ApprovalController({
        notificationService: new NotificationService(),
        getPageState,
      }),
      getPageState,
      getPassword,
    });
    const message = {
      origin: 'origin',
    };
    let sendResponse: any;
    beforeEach(() => {
      sendResponse = jest.fn();
    });
    test('return chainId successful', async () => {
      const chainIds = ['AELF', 'tDVW'];
      const mockDappManager = {
        chainId: jest.fn().mockResolvedValue(chainIds),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.getChainId(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(0),
        data: chainIds,
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('chainId throw error', async () => {
      const chainIds = ['AELF', 'tDVW'];
      const mockDappManager = {
        chainId: jest.fn().mockRejectedValue(chainIds),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.getChainId(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
  });

  describe('getChainIds', () => {
    const getPageState = jest.fn().mockReturnValue({
      lockTime: 60,
      registerStatus: undefined,
      wallet: {},
    });
    const getPassword = jest.fn().mockReturnValue('123456');
    const aelfMethodController = new AELFMethodController({
      notificationService: new NotificationService(),
      approvalController: new ApprovalController({
        notificationService: new NotificationService(),
        getPageState,
      }),
      getPageState,
      getPassword,
    });
    const message = {
      origin: 'origin',
    };
    let sendResponse: any;
    beforeEach(() => {
      sendResponse = jest.fn();
    });
    test('return chainIds successful', async () => {
      const chainIds = ['AELF', 'tDVW'];
      const mockDappManager = {
        chainIds: jest.fn().mockResolvedValue(chainIds),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.getChainIds(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(0),
        data: chainIds,
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('chainIds throw error', async () => {
      const chainIds = ['AELF', 'tDVW'];
      const mockDappManager = {
        chainIds: jest.fn().mockRejectedValue(chainIds),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.getChainIds(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
  });

  describe('requestAccounts', () => {
    const getPageState = jest.fn().mockReturnValue({
      lockTime: 60,
      registerStatus: undefined,
      wallet: {},
    });
    const getPassword = jest.fn().mockReturnValue('123456');
    const aelfMethodController = new AELFMethodController({
      notificationService: new NotificationService(),
      approvalController: new ApprovalController({
        notificationService: new NotificationService(),
        getPageState,
      }),
      getPageState,
      getPassword,
    });
    const message = {
      origin: 'origin',
    };
    let sendResponse: any;
    beforeEach(() => {
      sendResponse = jest.fn();
      jest.clearAllMocks();
    });
    test('isActive return true and return successful', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        accounts: jest.fn().mockResolvedValue({}),
        chainIds: jest.fn().mockResolvedValue(['AELF', 'tDVW']),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.requestAccounts(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(0),
        data: {},
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('SWEventController.dispatchEvent is called if isActive return true', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        accounts: jest.fn().mockResolvedValue({}),
        chainIds: jest.fn().mockResolvedValue(['AELF', 'tDVW']),
        getWallet: jest.fn().mockResolvedValue({ currentNetwork: 'MAINNET' }),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.requestAccounts(sendResponse, message as any);
      const expectParams = {
        eventName: 'connected',
        data: { chainIds: ['AELF', 'tDVW'], origin: 'origin' },
      };
      expect(SWEventController.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('SWEventController.dispatchEvent is not called if isActive return false', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(false),
        accounts: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.requestAccounts(sendResponse, message as any);
      expect(SWEventController.dispatchEvent).not.toHaveBeenCalled();
    });
    test('approvalController.authorizedToConnect is called if isActive return false', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(false),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      jest.spyOn((aelfMethodController as any).approvalController, 'authorizedToConnect');
      await aelfMethodController.requestAccounts(sendResponse, message as any);
      expect((aelfMethodController as any).approvalController.authorizedToConnect).toHaveBeenCalled();
    });
    test('approvalController.authorizedToConnect is called and return 200003 error', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(false),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      jest.spyOn((aelfMethodController as any).approvalController, 'authorizedToConnect').mockResolvedValue({
        error: 200003,
      });
      const expectParams = {
        ...errorHandler(200003, 'User denied'),
        data: {
          code: ResponseCode.USER_DENIED,
        },
      };
      await aelfMethodController.requestAccounts(sendResponse, message as any);
      console.log('sendResponse.mock.calls 200003');

      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('approvalController.authorizedToConnect is called and return other error', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(false),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      jest.spyOn((aelfMethodController as any).approvalController, 'authorizedToConnect').mockResolvedValue({
        error: 1,
      });
      const expectParams = {
        ...errorHandler(700002),
        data: {
          code: ResponseCode.CONTRACT_ERROR,
        },
      };
      await aelfMethodController.requestAccounts(sendResponse, message as any);
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('approvalController.authorizedToConnect is called and return successful', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(false),
        accounts: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      jest.spyOn((aelfMethodController as any).approvalController, 'authorizedToConnect').mockResolvedValue({
        error: 0,
      });
      const expectParams = {
        ...errorHandler(0),
        data: {},
      };
      await aelfMethodController.requestAccounts(sendResponse, message as any);
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('dappManager.isActive throw error', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockRejectedValue(false),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      const expectParams = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      await aelfMethodController.requestAccounts(sendResponse, message as any);
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('dappManager.chainIds throw error', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        chainIds: jest.fn().mockRejectedValue([]),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      const expectParams = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      await aelfMethodController.requestAccounts(sendResponse, message as any);
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('dappManager.accounts throw error', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(false),
        accounts: jest.fn().mockRejectedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      const expectParams = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      await aelfMethodController.requestAccounts(sendResponse, message as any);
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('approvalController.authorizedToConnect throw error', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(false),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      const expectParams = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      jest.spyOn((aelfMethodController as any).approvalController, 'authorizedToConnect').mockRejectedValue({});
      await aelfMethodController.requestAccounts(sendResponse, message as any);
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
  });

  describe('sendTransaction', () => {
    const getPageState = jest.fn().mockReturnValue({
      lockTime: 60,
      registerStatus: undefined,
      wallet: {},
    });
    const getPassword = jest.fn().mockReturnValue('123456');
    const approvalController = new ApprovalController({
      notificationService: new NotificationService(),
      getPageState,
    });
    let message: any;
    let sendResponse: any;
    let aelfMethodController: any;
    beforeEach(() => {
      jest.clearAllMocks();
      message = {
        origin: 'origin',
        payload: {
          params: {},
          method: 'ManagerTransfer',
          contractAddress: 'caContractAddress',
        },
      };
      sendResponse = jest.fn();
      aelfMethodController = new AELFMethodController({
        notificationService: new NotificationService(),
        approvalController: approvalController,
        getPageState,
        getPassword,
      });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('message?.payload?.params is not exist', async () => {
      const message = { origin: 'origin' };
      await (aelfMethodController as any).sendTransaction(sendResponse, message);
      const res = { ...errorHandler(400001), data: { code: ResponseCode.ERROR_IN_PARAMS } };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('isActive return false', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(false),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await (aelfMethodController as any).sendTransaction(sendResponse, message);
      const res = {
        ...errorHandler(200004),
        data: {
          code: ResponseCode.UNAUTHENTICATED,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('chainInfo is not exist', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        getChainInfo: jest.fn().mockResolvedValue(undefined),
        getCaInfo: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await (aelfMethodController as any).sendTransaction(sendResponse, message);
      const res = {
        ...errorHandler(200005),
        data: {
          code: 40001,
          msg: 'invalid chain id',
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('chainInfo.endPoint is not exist', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        getChainInfo: jest.fn().mockResolvedValue({
          endPoint: undefined,
        }),
        getCaInfo: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await (aelfMethodController as any).sendTransaction(sendResponse, message);
      const res = {
        ...errorHandler(200005),
        data: {
          code: 40001,
          msg: 'invalid chain id',
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('caInfo is not exist', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        getChainInfo: jest.fn().mockResolvedValue({
          endPoint: 'http://endpoint',
        }),
        getCaInfo: jest.fn().mockResolvedValue(undefined),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await (aelfMethodController as any).sendTransaction(sendResponse, message);
      const res = {
        ...errorHandler(200005),
        data: {
          code: 40001,
          msg: 'invalid chain id',
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('the method is not in the whitelist', async () => {
      const message = {
        origin: 'origin',
        payload: {
          params: {},
          method: 'test',
        },
      };
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        getChainInfo: jest.fn().mockResolvedValue({
          endPoint: 'http://endpoint',
        }),
        getCaInfo: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await (aelfMethodController as any).sendTransaction(sendResponse, message);
      const res = {
        ...errorHandler(400001),
        data: {
          code: ResponseCode.CONTRACT_ERROR,
          msg: 'The current method is not supported',
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });

    test('setLocalStorage is called', async () => {
      jest.spyOn(utils, 'randomId').mockReturnValue('randomId');
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        getChainInfo: jest.fn().mockResolvedValue({
          endPoint: 'http://endpoint',
        }),
        getCaInfo: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      const res = { txPayload: { randomId: JSON.stringify({}) } };
      await (aelfMethodController as any).sendTransaction(sendResponse, message);
      expect(setLocalStorage).toHaveBeenCalledWith(expect.objectContaining(res));
    });

    test('approvalController.authorizedToSendTransactions is called, and removeLocalStorage is called', async () => {
      jest.spyOn(utils, 'randomId').mockReturnValue('randomId');
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        getChainInfo: jest.fn().mockResolvedValue({
          endPoint: 'http://endpoint',
        }),
        getCaInfo: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      jest
        .spyOn((aelfMethodController as any).approvalController, 'authorizedToSendTransactions')
        .mockImplementation(() => ({ error: 0 }));
      await aelfMethodController.sendTransaction(sendResponse, message);
      expect(removeLocalStorage).toHaveBeenCalled();
    });
    test('approvalController.authorizedToSendTransactions is called, and return 200003 error', async () => {
      jest.spyOn(utils, 'randomId').mockReturnValue('randomId');
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        getChainInfo: jest.fn().mockResolvedValue({
          endPoint: 'http://endpoint',
        }),
        getCaInfo: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      jest
        .spyOn((aelfMethodController as any).approvalController, 'authorizedToSendTransactions')
        .mockResolvedValue({ error: 200003 });
      const expectParams = {
        ...errorHandler(200003),
        data: {
          code: ResponseCode.USER_DENIED,
        },
      };
      await aelfMethodController.sendTransaction(sendResponse, message as any);
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('approvalController.authorizedToSendTransactions is called, and return non-0 error', async () => {
      jest.spyOn(utils, 'randomId').mockReturnValue('randomId');
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        getChainInfo: jest.fn().mockResolvedValue({
          endPoint: 'http://endpoint',
        }),
        getCaInfo: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      jest
        .spyOn((aelfMethodController as any).approvalController, 'authorizedToSendTransactions')
        .mockResolvedValue({ error: 1 });
      const expectParams = {
        ...errorHandler(700002),
        data: {
          code: ResponseCode.CONTRACT_ERROR,
        },
      };
      await aelfMethodController.sendTransaction(sendResponse, message as any);
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('approvalController.authorizedToSendTransactions is called, and return value successful', async () => {
      jest.spyOn(utils, 'randomId').mockReturnValue('randomId');
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        getChainInfo: jest.fn().mockResolvedValue({
          endPoint: 'http://endpoint',
        }),
        getCaInfo: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      const res = { error: 0, data: {} };
      jest
        .spyOn((aelfMethodController as any).approvalController, 'authorizedToSendTransactions')
        .mockResolvedValue(res);
      await aelfMethodController.sendTransaction(sendResponse, message as any);
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('isActive throw error', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockRejectedValue(false),
      };
      const aelfMethodController = new AELFMethodController({
        notificationService: new NotificationService(),
        approvalController: approvalController,
        getPageState,
        getPassword,
      });
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.sendTransaction(sendResponse, message as any);
      const res = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('getChainInfo throw error', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        getChainInfo: jest.fn().mockRejectedValue(false),
      };
      const aelfMethodController = new AELFMethodController({
        notificationService: new NotificationService(),
        approvalController: approvalController,
        getPageState,
        getPassword,
      });
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.sendTransaction(sendResponse, message as any);
      const res = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('getCaInfo throw error', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        getChainInfo: jest.fn().mockResolvedValue(true),
        getCaInfo: jest.fn().mockRejectedValue(false),
      };
      const aelfMethodController = new AELFMethodController({
        notificationService: new NotificationService(),
        approvalController: approvalController,
        getPageState,
        getPassword,
      });
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.sendTransaction(sendResponse, message as any);
      const res = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('approvalController.authorizedToSendTransactions throw error', async () => {
      jest.spyOn(utils, 'randomId').mockReturnValue('randomId');
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
        getChainInfo: jest.fn().mockResolvedValue({
          endPoint: 'http://endpoint',
        }),
        getCaInfo: jest.fn().mockResolvedValue({}),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      jest
        .spyOn((aelfMethodController as any).approvalController, 'authorizedToSendTransactions')
        .mockRejectedValue({ error: 200003 });
      const expectParams = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      await aelfMethodController.sendTransaction(sendResponse, message as any);
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
  });

  describe('getSignature', () => {
    const getPageState = jest.fn().mockReturnValue({
      lockTime: 60,
      registerStatus: undefined,
      wallet: {},
    });
    const getPassword = jest.fn().mockReturnValue('123456');
    const approvalController = new ApprovalController({
      notificationService: new NotificationService(),
      getPageState,
    });
    const message = {
      origin: 'origin',
      payload: {
        data: 1,
      },
    };
    let sendResponse: any;
    let aelfMethodController: any;
    beforeEach(() => {
      sendResponse = jest.fn();
      aelfMethodController = new AELFMethodController({
        notificationService: new NotificationService(),
        approvalController: approvalController,
        getPageState,
        getPassword,
      });
      // jest.clearAllMocks();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('message.payload.data is not exist', async () => {
      const message = { origin: 'origin' };
      await (aelfMethodController as any).getSignature(sendResponse, message);
      const res = { ...errorHandler(400001), data: { code: ResponseCode.ERROR_IN_PARAMS } };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('the type of message.payload.data is string', async () => {
      const message = {
        origin: 'origin',
        payload: {
          data: 'data',
        },
      };
      await (aelfMethodController as any).getSignature(sendResponse, message);
      const res = { ...errorHandler(400001), data: { code: ResponseCode.ERROR_IN_PARAMS } };
      expect(sendResponse).not.toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('the type of message.payload.data is number', async () => {
      const message = {
        origin: 'origin',
        payload: {
          data: 1,
        },
      };
      await (aelfMethodController as any).getSignature(sendResponse, message);
      const res = { ...errorHandler(400001), data: { code: ResponseCode.ERROR_IN_PARAMS } };
      expect(sendResponse).not.toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('the type of message.payload.data is object', async () => {
      const message = {
        origin: 'origin',
        payload: {
          data: {},
        },
      };
      await (aelfMethodController as any).getSignature(sendResponse, message);
      const res = { ...errorHandler(400001), data: { code: ResponseCode.ERROR_IN_PARAMS } };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('isActive return false', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(false),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await (aelfMethodController as any).getSignature(sendResponse, message);
      const res = {
        ...errorHandler(200004),
        data: {
          code: ResponseCode.UNAUTHENTICATED,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('approvalController.authorizedToGetSignature is called, and return 200003 error', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      jest
        .spyOn((aelfMethodController as any).approvalController, 'authorizedToGetSignature')
        .mockResolvedValue({ error: 200003 });
      const expectParams = {
        ...errorHandler(200003),
        data: {
          code: ResponseCode.USER_DENIED,
        },
      };
      await aelfMethodController.getSignature(sendResponse, message as any);
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('approvalController.authorizedToGetSignature is called, and return non-0 error', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      jest
        .spyOn((aelfMethodController as any).approvalController, 'authorizedToGetSignature')
        .mockResolvedValue({ error: 1 });
      const expectParams = {
        ...errorHandler(700002),
        data: {
          code: ResponseCode.CONTRACT_ERROR,
        },
      };
      await aelfMethodController.getSignature(sendResponse, message as any);
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('approvalController.authorizedToGetSignature is called, and return value successful', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      const res = { error: 0, data: {} };
      jest.spyOn((aelfMethodController as any).approvalController, 'authorizedToGetSignature').mockResolvedValue(res);
      await aelfMethodController.getSignature(sendResponse, message as any);
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('isActive throw error', async () => {
      const mockDappManager = {
        isActive: jest.fn(() => {
          throw new Error('');
        }),
      };
      const aelfMethodController = new AELFMethodController({
        notificationService: new NotificationService(),
        approvalController: approvalController,
        getPageState,
        getPassword,
      });
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.getSignature(sendResponse, message as any);
      const res = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
    test('approvalController.authorizedToGetSignature throw error', async () => {
      const mockDappManager = {
        isActive: jest.fn().mockResolvedValue(true),
      };
      const aelfMethodController = new AELFMethodController({
        notificationService: new NotificationService(),
        approvalController: approvalController,
        getPageState,
        getPassword,
      });
      (aelfMethodController as any).dappManager = mockDappManager;
      jest.spyOn((aelfMethodController as any).approvalController, 'authorizedToGetSignature').mockRejectedValue(false);
      await aelfMethodController.getSignature(sendResponse, message as any);
      expect(sendResponse).toHaveBeenCalled();
      const res = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(res));
    });
  });

  describe('getNetwork', () => {
    const getPageState = jest.fn().mockReturnValue({
      lockTime: 60,
      registerStatus: undefined,
      wallet: {},
    });
    const getPassword = jest.fn().mockReturnValue('123456');
    const aelfMethodController = new AELFMethodController({
      notificationService: new NotificationService(),
      approvalController: new ApprovalController({
        notificationService: new NotificationService(),
        getPageState,
      }),
      getPageState,
      getPassword,
    });
    const message = {
      origin: 'origin',
    };
    let sendResponse: any;
    beforeEach(() => {
      sendResponse = jest.fn();
      jest.clearAllMocks();
    });
    test('getNetwork successful', async () => {
      const mockDappManager = {
        networkType: jest.fn().mockResolvedValue('MAINNET'),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.getNetwork(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(0),
        data: 'MAINNET',
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
    test('getNetwork error', async () => {
      const mockDappManager = {
        networkType: jest.fn().mockRejectedValue('MAINNET'),
      };
      (aelfMethodController as any).dappManager = mockDappManager;
      await aelfMethodController.getNetwork(sendResponse, message as any);
      const expectParams = {
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      };
      expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining(expectParams));
    });
  });
});
