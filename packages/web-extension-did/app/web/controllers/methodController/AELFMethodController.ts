/**
 * @file
 * The controller that handles the aelf method
 */
import NotificationService from 'service/NotificationService';
import { SendResponseFun } from 'types';
import { IPageState, RequestCommonHandler, RequestMessageData } from 'types/SW';
import errorHandler from 'utils/errorHandler';
import { MethodsBase, ResponseCode, MethodsUnimplemented } from '@portkey/provider-types';
import { ExtensionDappManager } from './ExtensionDappManager';
import { getSWReduxState } from 'utils/lib/SWGetReduxStore';
import ApprovalController from 'controllers/approval/ApprovalController';

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
  MethodsUnimplemented.GET_WALLET_STATE,
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
      case MethodsUnimplemented.GET_WALLET_STATE:
        this.getWalletState(sendResponse, message.payload);
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

  isUnlocked = () => {
    return Boolean(this.getPassword());
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
    const data = await this.dappManager.chainsInfo();
    sendResponse({ ...errorHandler(0), data });
  };

  getAccounts: RequestCommonHandler = async (sendResponse, message) => {
    const { origin } = message;
    let accounts = {};
    const unlocked = this.isUnlocked();
    if (unlocked) accounts = await this.dappManager.accounts(origin);
    console.log(accounts, 'accounts===');
    sendResponse({ ...errorHandler(0), data: accounts });
  };

  getChainId: RequestCommonHandler = async (sendResponse) => {
    const chainId = await this.dappManager.chainId();
    sendResponse({ ...errorHandler(0), data: chainId });
  };

  getChainIds: RequestCommonHandler = async (sendResponse) => {
    const chainIds = await this.dappManager.chainIds();
    sendResponse({ ...errorHandler(0), data: chainIds });
  };

  requestAccounts: RequestCommonHandler = async (sendResponse, message) => {
    const isActive = await this.dappManager.isActive(message.origin);
    if (isActive) return sendResponse({ ...errorHandler(0), data: await this.dappManager.accounts(message.origin) });
    const result = await this.approvalController.authorizedToConnect(message);
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
    // TODO
    sendResponse(errorHandler(0));
  };

  sendTransaction: RequestCommonHandler = async (sendResponse, message) => {
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
    if (!chainInfo || !chainInfo.endPoint || !payload.params || !caInfo)
      return sendResponse({
        ...errorHandler(200005),
        data: {
          code: 40001,
          msg: 'invalid chain id',
        },
      });

    const result = await this.approvalController.authorizedToSendTransactions({
      origin,
      payload: message.payload,
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
  };
}
