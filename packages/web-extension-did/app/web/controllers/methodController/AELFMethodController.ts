/**
 * @file
 * The controller that handles the aelf method
 */
import { PromptRouteTypes } from 'messages/InternalMessageTypes';
import NotificationService from 'service/NotificationService';
import { SendResponseFun } from 'types';
import { ConnectionsType } from 'types/storage';
import { InternalMessagePayload, IPageState, RequestCommonHandler, RequestMessageData } from 'types/SW';
import errorHandler, { PortKeyResultType } from 'utils/errorHandler';
import { getLocalStorage } from 'utils/storage/chromeStorage';
import { RPCMethodsBase } from '@portkey/provider-types';
import { ExtensionDappManager } from './ExtensionDappManager';

const dappManager = new ExtensionDappManager();

const aelfMethodList = [RPCMethodsBase.ACCOUNTS, RPCMethodsBase.CHAIN_ID, RPCMethodsBase.CHAIN_IDS];
interface AELFMethodControllerProps {
  notificationService: NotificationService;
  getPageState: () => IPageState;
  getPassword: () => string | null;
}
export default class AELFMethodController {
  protected getPageState: () => IPageState;
  protected notificationService: NotificationService;
  protected getPassword: () => string | null;
  public aelfMethodList: string[];
  constructor({ getPassword, notificationService, getPageState }: AELFMethodControllerProps) {
    this.getPageState = getPageState;
    this.notificationService = notificationService;
    this.getPassword = getPassword;
    this.aelfMethodList = aelfMethodList;
  }
  dispenseMessage = (message: RequestMessageData, sendResponse: SendResponseFun) => {
    switch (message.type) {
      case RPCMethodsBase.CHAIN_ID:
        this.getChainId(sendResponse, message.payload);
        break;
      case RPCMethodsBase.CHAIN_IDS:
        this.getChainIds(sendResponse, message.payload);
        break;

      case RPCMethodsBase.ACCOUNTS:
        this.getAccounts(sendResponse, message.payload);
        break;
      // case RPCMethodsBase.CHAINS_INFO:
      //   this.callSendContract(sendResponse, message.payload);
      //   break;
      // case RPCMethodsBase.SEND_TRANSACTION:
      //   this.callSendContract(sendResponse, message.payload);
      //   break;
      // case RPCMethodsBase.REQUEST_ACCOUNTS:
      //   this.getSignature(sendResponse, message.payload);
      //   break;
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

  isLocked = () => {
    return !this.getPassword();
  };

  getAccounts: RequestCommonHandler = async (sendResponse, message) => {
    const { origin } = message;
    let accounts = {};
    const locked = this.isLocked();
    if (!locked) accounts = await dappManager.accounts(origin);
    console.log(accounts, 'accounts===');
    sendResponse({ ...errorHandler(0), data: accounts });
  };

  getChainId: RequestCommonHandler = async (sendResponse) => {
    const chainId = await dappManager.chainId();
    sendResponse({ ...errorHandler(0), data: chainId });
  };

  getChainIds: RequestCommonHandler = async (sendResponse) => {
    const chainIds = await dappManager.chainIds();
    sendResponse({ ...errorHandler(0), data: chainIds });
  };

  /**
   *
   * @param {Function} sendResponse sendResponse sendResponse
   * @param callInfo
   */
  callSendContract = async (
    sendResponse: SendResponseFun,
    callInfo: InternalMessagePayload,
    isGetSignTx: 0 | 1 = 0,
  ) => {
    console.log(callInfo, 'callSendContract');
    const params = callInfo.params as {
      account: string;
      appName?: string;
      chainId: string;
      appLogo?: string;
      contractAddress: string;
      contractName: string;
      method: string;
      rpcUrl: string;
      params: any[];
    };
    const { account, appName, contractAddress, method: methodName, rpcUrl, appLogo, params: paramsOption } = params;
    const { origin: _origin } = callInfo;
    const checkResult = await this._checkParamsAndReturnPermission(params, _origin);
    const connections = checkResult.data;
    if (checkResult.error !== 0 || !connections) return sendResponse(checkResult);
    const permission = connections[_origin].permission ?? {};
    console.log(permission, 'permission===');
    const { contracts = {} } = permission;
    if (!contracts[contractAddress]?.[account])
      return sendResponse(errorHandler(700001, 'Please initialize the contract first'));
    // When methodName is Transfer, parameters need to be verified
    if (methodName === 'Transfer') {
      const transferInfo = paramsOption[0];
      if (transferInfo && transferInfo.amount && transferInfo.to && transferInfo.symbol) {
        // isVerified = true;
      } else {
        return sendResponse(errorHandler(400001, 'Missing params'));
      }
    }
    const signResult = await this.notificationService.openPrompt({
      method: PromptRouteTypes.SIGN_MESSAGE,
      search: JSON.stringify({
        appName: appName ?? _origin,
        rpcUrl,
        methodName,
        appLogo,
        isGetSignTx,
        ...contracts[contractAddress][account],
        paramsOption,
      }),
    });
    sendResponse(signResult);
  };

  _checkParamsAndReturnPermission = async (
    params: any,
    origin: string,
  ): Promise<PortKeyResultType & { data?: ConnectionsType }> => {
    // const pageState = this._getPageState();
    if (!params.contractAddress) return errorHandler(410003);
    if (!params.account) return errorHandler(410002);
    // if (params.rpcUrl !== pageState.chain.currentChain.rpcUrl)
    //   return {
    //     ...errorHandler(200017),
    //   };
    const connections: ConnectionsType = (await getLocalStorage('connections')) ?? {};
    const { permission } = connections[origin] ?? {};
    const accountList = permission?.accountList ?? [];
    console.log(accountList, connections, '_checkParamsAndReturnPermission');
    if (!accountList?.some((address) => params.account === address)) {
      return errorHandler(200016, `${params.account} is not connected to Portkey, please connect the user first`);
    }
    return {
      ...errorHandler(0),
      data: connections,
    };
  };
}
