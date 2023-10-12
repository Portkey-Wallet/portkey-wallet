/**
 * @file
 * The controller that handles the aelf method
 */
import NotificationService from 'service/NotificationService';
import { SendResponseFun } from 'types';
import { IPageState, RequestCommonHandler, RequestMessageData } from 'types/SW';
import errorHandler from 'utils/errorHandler';
import { MethodsBase, ResponseCode, MethodsWallet } from '@portkey/provider-types';
import { ExtensionDappManager } from './ExtensionDappManager';
import { getCurrentCaHash, getSWReduxState, getWalletState } from 'utils/lib/SWGetReduxStore';
import ApprovalController from 'controllers/approval/ApprovalController';
import { CA_METHOD_WHITELIST, REMEMBER_ME_ACTION_WHITELIST } from '@portkey-wallet/constants/constants-ca/dapp';
import { randomId } from '@portkey-wallet/utils';
import { removeLocalStorage, setLocalStorage } from 'utils/storage/chromeStorage';
import SWEventController from 'controllers/SWEventController';
import { checkSiteIsInBlackList, hasSessionInfoExpired, verifySession } from '@portkey-wallet/utils/session';
import getManager from 'utils/lib/getManager';
import { ChainId } from '@portkey-wallet/types';
import { contractQueries } from '@portkey-wallet/graphql';

const storeInSW = {
  getState: getSWReduxState,
  dispatch: () => {
    throw Error('Unable to use dispatch in service worker');
  },
};

const aelfMethodList = [
  MethodsBase.ACCOUNTS,
  MethodsBase.CHAIN_ID,
  MethodsBase.CHAIN_IDS,
  MethodsBase.CHAINS_INFO,
  MethodsBase.REQUEST_ACCOUNTS,
  MethodsBase.SEND_TRANSACTION,
  MethodsWallet.GET_WALLET_SIGNATURE,
  MethodsBase.NETWORK,
  MethodsWallet.GET_WALLET_STATE,
  MethodsWallet.GET_WALLET_NAME,
  MethodsWallet.GET_WALLET_CURRENT_MANAGER_ADDRESS,
  MethodsWallet.GET_WALLET_MANAGER_SYNC_STATUS,
];
interface AELFMethodControllerProps {
  notificationService: NotificationService;
  approvalController: ApprovalController;
  getPageState: () => IPageState;
  getPassword: () => string | null;
}
export default class AELFMethodController {
  protected getPageState: () => IPageState;
  protected notificationService: NotificationService;
  protected getPassword: () => string | null;
  protected dappManager: ExtensionDappManager;
  protected approvalController: ApprovalController;
  public aelfMethodList: string[];
  constructor({ notificationService, approvalController, getPassword, getPageState }: AELFMethodControllerProps) {
    this.getPageState = getPageState;
    this.approvalController = approvalController;
    this.notificationService = notificationService;
    this.getPassword = getPassword;
    this.aelfMethodList = aelfMethodList;
    this.dappManager = new ExtensionDappManager({
      locked: () => !getPassword(),
      store: storeInSW,
    });
  }

  handleRequest = async ({ params, method, callBack }: { params: any; method: any; callBack: any }) => {
    if (!REMEMBER_ME_ACTION_WHITELIST.includes(method)) {
      return await callBack(params);
    }

    const validSession = await this.verifySessionInfo(params.origin);
    let result;
    if (validSession) {
      result = await this.approvalController.authorizedToAutoExecute({
        ...params,
        method,
      });
    } else {
      result = await callBack(params);
    }
    return result;
  };

  dispenseMessage = (message: RequestMessageData, sendResponse: SendResponseFun) => {
    switch (message.type) {
      case MethodsBase.CHAIN_ID:
        this.getChainId(sendResponse, message.payload);
        break;
      case MethodsBase.CHAIN_IDS:
        this.getChainIds(sendResponse, message.payload);
        break;
      case MethodsBase.ACCOUNTS:
        this.getAccounts(sendResponse, message.payload);
        break;
      case MethodsBase.CHAINS_INFO:
        this.getChainsInfo(sendResponse, message.payload);
        break;
      case MethodsBase.SEND_TRANSACTION:
        this.sendTransaction(sendResponse, message.payload);
        break;
      case MethodsBase.REQUEST_ACCOUNTS:
        this.requestAccounts(sendResponse, message.payload);
        break;
      case MethodsBase.NETWORK:
        this.getNetwork(sendResponse, message.payload);
        break;
      case MethodsWallet.GET_WALLET_SIGNATURE:
        this.getSignature(sendResponse, message.payload);
        break;
      case MethodsWallet.GET_WALLET_STATE:
        this.getWalletState(sendResponse, message.payload);
        break;
      case MethodsWallet.GET_WALLET_NAME:
        this.getWalletName(sendResponse, message.payload);
        break;

      case MethodsWallet.GET_WALLET_CURRENT_MANAGER_ADDRESS:
        this.getCurrentManagerAddress(sendResponse, message.payload);
        break;
      case MethodsWallet.GET_WALLET_MANAGER_SYNC_STATUS:
        this.getWalletManagerSyncStatus(sendResponse, message.payload);
        break;
      default:
        sendResponse(
          errorHandler(
            700001,
            'Not Support',
            // `The current network is ${pageState.chain.currentChain.chainType}, which cannot match this method  (${message.type})`,
          ),
        );
        break;
    }
  };

  verifySessionInfo = async (origin: string) => {
    try {
      const rememberMeBlackList = await this.dappManager.getRememberMeBlackList();
      // is remember me black list
      if (checkSiteIsInBlackList(rememberMeBlackList || [], origin)) return false;

      const sessionInfo = await this.dappManager.getSessionInfo(origin);
      const wallet = await getWalletState();
      if (!wallet.walletInfo) return false;
      const pin = this.getPassword();
      if (!pin) return false;
      const manager = await getManager(pin);
      const caHash = await getCurrentCaHash();
      if (!manager?.keyPair || !caHash || !sessionInfo) return false;
      const valid = verifySession({
        keyPair: manager.keyPair,
        origin,
        managerAddress: manager.address,
        caHash,
        expiredPlan: sessionInfo.expiredPlan,
        expiredTime: sessionInfo.expiredTime,
        signature: sessionInfo.signature,
      });
      if (!valid) return valid;
      const isExpired = hasSessionInfoExpired(sessionInfo);
      return !isExpired;
    } catch (error) {
      console.log('verifySessionInfo error');
      return false;
    }
  };

  isUnlocked = () => {
    return Boolean(this.getPassword());
  };

  getCurrentManagerAddress: RequestCommonHandler = async (sendResponse: SendResponseFun, message) => {
    try {
      const isActive = await this.dappManager.isActive(message.origin);
      if (!isActive)
        return sendResponse({
          ...errorHandler(400001),
          data: {
            code: ResponseCode.UNAUTHENTICATED,
          },
        });

      const managerAddress = await this.dappManager.currentManagerAddress();
      if (!managerAddress)
        return sendResponse({
          ...errorHandler(410001),
          data: {
            code: ResponseCode.INTERNAL_ERROR,
            msg: 'Please check if the user is logged in to the wallet',
          },
        });

      sendResponse({ ...errorHandler(0), data: managerAddress });
    } catch (error) {
      sendResponse({
        ...errorHandler(500001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      });
    }
  };

  checkManagerSyncStatus = async (chainId: ChainId) => {
    const [caInfo, managerAddress, networkType] = await Promise.all([
      this.dappManager.getCaInfo(chainId),
      this.dappManager.currentManagerAddress(),
      this.dappManager.networkType(),
    ]);

    if (!caInfo?.isSync) {
      const { caHolderManagerInfo } = await contractQueries.getCAHolderByManager(networkType, {
        manager: managerAddress,
        chainId,
        caHash: caInfo?.caHash,
      });
      const info = caHolderManagerInfo[0];
      if (!info) return false;
      const managerInfos = info.managerInfos;
      return managerInfos?.some((manager) => manager?.address === managerAddress);
    }
    return caInfo?.isSync;
  };

  getWalletManagerSyncStatus: RequestCommonHandler = async (sendResponse: SendResponseFun, message) => {
    try {
      const isActive = await this.dappManager.isActive(message.origin);
      if (!isActive)
        return sendResponse({
          ...errorHandler(400001),
          data: {
            code: ResponseCode.UNAUTHENTICATED,
          },
        });
      const chainId = message.payload?.chainId;
      if (!chainId)
        return sendResponse({
          ...errorHandler(400001),
          data: {
            code: ResponseCode.ERROR_IN_PARAMS,
          },
        });
      return sendResponse({
        ...errorHandler(0),
        data: Boolean(await this.checkManagerSyncStatus(chainId)),
      });
    } catch (error) {
      return sendResponse({
        ...errorHandler(500001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      });
    }
  };

  getWalletName: RequestCommonHandler = async (sendResponse: SendResponseFun, message) => {
    try {
      const isActive = await this.dappManager.isActive(message.origin);
      if (!isActive)
        return sendResponse({
          ...errorHandler(400001),
          data: {
            code: ResponseCode.UNAUTHENTICATED,
          },
        });

      sendResponse({ ...errorHandler(0), data: await this.dappManager.walletName() });
    } catch (error) {
      sendResponse({
        ...errorHandler(500001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      });
    }
  };

  getWalletState: RequestCommonHandler = async (sendResponse: SendResponseFun, message) => {
    try {
      const origin = message.origin;
      let data: any = {
        isUnlocked: this.isUnlocked(),
        isConnected: await this.dappManager.isActive(origin),
      };
      if (data.isConnected) {
        data = {
          ...data,
          accounts: await this.dappManager.accounts(origin),
          chainIds: await this.dappManager.chainId(),
          networkType: (await this.dappManager.getWallet()).currentNetwork,
        };
      }
      sendResponse({ ...errorHandler(0), data });
    } catch (error) {
      sendResponse(errorHandler(200002, error));
    }
  };

  getChainsInfo: RequestCommonHandler = async (sendResponse) => {
    try {
      const data = await this.dappManager.chainsInfo();
      sendResponse({ ...errorHandler(0), data });
    } catch (error) {
      console.log('getChainsInfo===', error);
      sendResponse({
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      });
    }
  };

  getAccounts: RequestCommonHandler = async (sendResponse, message) => {
    try {
      const { origin } = message;
      let accounts = {};
      const unlocked = this.isUnlocked();
      if (unlocked) accounts = await this.dappManager.accounts(origin);
      console.log(accounts, 'accounts===');
      sendResponse({ ...errorHandler(0), data: accounts });
    } catch (error) {
      console.log('getAccounts===', error);
      sendResponse({
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      });
    }
  };

  getChainId: RequestCommonHandler = async (sendResponse) => {
    try {
      const chainId = await this.dappManager.chainId();
      sendResponse({ ...errorHandler(0), data: chainId });
    } catch (error) {
      console.log('getChainId===', error);
      sendResponse({
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      });
    }
  };

  getChainIds: RequestCommonHandler = async (sendResponse) => {
    try {
      const chainIds = await this.dappManager.chainIds();
      sendResponse({ ...errorHandler(0), data: chainIds });
    } catch (error) {
      console.log('getChainIds===', error);
      sendResponse({
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      });
    }
  };

  requestAccounts: RequestCommonHandler = async (sendResponse, message) => {
    try {
      const isActive = await this.dappManager.isActive(message.origin);
      if (isActive) {
        SWEventController.dispatchEvent({
          eventName: 'connected',
          data: { chainIds: await this.dappManager.chainIds(), origin: message.origin },
        });
        return sendResponse({ ...errorHandler(0), data: await this.dappManager.accounts(message.origin) });
      }
      const result = await this.approvalController.authorizedToConnect({
        ...message,
        appLogo: message?.icon || '',
      });
      if (result.error === 200003)
        return sendResponse({
          ...errorHandler(200003, 'User denied'),
          data: {
            code: ResponseCode.USER_DENIED,
          },
        });
      if (result.error !== 0)
        return sendResponse({
          ...errorHandler(700002),
          data: {
            code: ResponseCode.CONTRACT_ERROR,
          },
        });
      sendResponse({ ...errorHandler(0), data: await this.dappManager.accounts(message.origin) });
    } catch (error) {
      console.log('requestAccounts===', error);
      sendResponse({
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      });
    }
  };

  sendTransaction: RequestCommonHandler = async (sendResponse, message) => {
    try {
      if (!message?.payload?.params)
        return sendResponse({ ...errorHandler(400001), data: { code: ResponseCode.ERROR_IN_PARAMS } });

      if (!(await this.dappManager.isActive(message.origin)))
        return sendResponse({
          ...errorHandler(200004),
          data: {
            code: ResponseCode.UNAUTHENTICATED,
          },
        });
      const { payload, origin } = message;
      const chainInfo = await this.dappManager.getChainInfo(payload.chainId);
      const caInfo = await this.dappManager.getCaInfo(payload.chainId);
      if (!chainInfo || !chainInfo.endPoint || !caInfo)
        return sendResponse({
          ...errorHandler(200005),
          data: {
            code: 40001,
            msg: 'invalid chain id',
          },
        });

      const isForward = chainInfo?.caContractAddress !== payload?.contractAddress;
      const method = isForward ? 'ManagerForwardCall' : payload?.method;

      if (!CA_METHOD_WHITELIST.includes(method))
        return sendResponse({
          ...errorHandler(400001),
          data: {
            code: ResponseCode.CONTRACT_ERROR,
            msg: 'The current method is not supported',
          },
        });

      const key = randomId();
      setLocalStorage({ txPayload: { [key]: JSON.stringify(payload.params) } });
      delete message.payload?.params;

      const result = await this.handleRequest({
        params: {
          origin,
          transactionInfoId: key,
          payload: message.payload,
        },
        method: MethodsBase.SEND_TRANSACTION,
        callBack: (params: any) => this.approvalController.authorizedToSendTransactions(params),
      });

      // TODO Only support open a window
      removeLocalStorage('txPayload');
      if (result.error === 200003)
        return sendResponse({
          ...errorHandler(200003),
          data: {
            code: ResponseCode.USER_DENIED,
          },
        });
      if (result.error) {
        console.log('error', result);

        return sendResponse({
          ...errorHandler(700002),
          data: {
            code: ResponseCode.CONTRACT_ERROR,
          },
        });
      }
      sendResponse(result);
    } catch (error) {
      console.log('sendTransaction===', error);
      sendResponse({
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      });
    }
  };

  getSignature: RequestCommonHandler = async (sendResponse, message) => {
    try {
      if (
        !message?.payload?.data ||
        (typeof message.payload.data !== 'string' && typeof message.payload.data !== 'number') // The problem left over from the browser history needs to pass the number type
      )
        return sendResponse({ ...errorHandler(400001), data: { code: ResponseCode.ERROR_IN_PARAMS } });

      if (!(await this.dappManager.isActive(message.origin)))
        return sendResponse({
          ...errorHandler(200004),
          data: {
            code: ResponseCode.UNAUTHENTICATED,
          },
        });

      const result = await this.handleRequest({
        params: {
          origin: message.origin,
          payload: {
            data: message.payload.data,
            origin: message.origin,
          },
        },
        method: MethodsWallet.GET_WALLET_SIGNATURE,
        callBack: (params: any) => this.approvalController.authorizedToGetSignature(params),
      });

      if (result.error === 200003)
        return sendResponse({
          ...errorHandler(200003),
          data: {
            code: ResponseCode.USER_DENIED,
          },
        });
      if (result.error)
        return sendResponse({
          ...errorHandler(700002),
          data: {
            code: ResponseCode.CONTRACT_ERROR,
          },
        });
      sendResponse(result);
    } catch (error) {
      console.log('getSignature===', error);
      sendResponse({
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      });
    }
  };

  getNetwork: RequestCommonHandler = async (sendResponse) => {
    try {
      const networkType = await this.dappManager.networkType();
      sendResponse({ ...errorHandler(0), data: networkType });
    } catch (error) {
      console.log('getNetwork===', error);
      sendResponse({
        ...errorHandler(100001),
        data: {
          code: ResponseCode.INTERNAL_ERROR,
        },
      });
    }
  };
}
