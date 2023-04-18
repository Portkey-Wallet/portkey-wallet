/**
 * @file
 * The controller that handles the aelf method
 */
import { AelfMessageTypes, PromptRouteTypes } from 'messages/InternalMessageTypes';
import NotificationService from 'service/NotificationService';
import { SendResponseFun } from 'types';
import { ConnectionsType, ContractsItem } from 'types/storage';
import { BaseInternalMessagePayload, InternalMessageData, InternalMessagePayload, IPageState } from 'types/SW';
import errorHandler, { PortKeyResultType } from 'utils/errorHandler';
import { getLocalStorage, setLocalStorage } from 'utils/storage/chromeStorage';

interface AELFMethodControllerProps {
  notificationService: NotificationService;
  methodList: string[];
  getPageState: () => IPageState;
  getPassword: () => string | null;
}
export default class AELFMethodController {
  protected methodList: string[];
  protected _getPageState: () => IPageState;
  protected notificationService: NotificationService;
  protected _getPassword: () => string | null;
  constructor({ methodList, getPassword, notificationService, getPageState }: AELFMethodControllerProps) {
    this.methodList = methodList;
    this._getPageState = getPageState;
    this.notificationService = notificationService;
    this._getPassword = getPassword;
  }
  dispenseMessage = (message: InternalMessageData, sendResponse: SendResponseFun) => {
    // const pageState = this._getPageState();
    switch (message.type) {
      case AelfMessageTypes.INIT_AELF_CONTRACT:
        this.initAelfContractCallOnly(sendResponse, message.payload);
        break;
      case AelfMessageTypes.CALL_SEND_CONTRACT:
        this.callSendContract(sendResponse, message.payload);
        break;
      case AelfMessageTypes.GET_SEND_CONTRACT_SIGN_TX:
        this.callSendContract(sendResponse, message.payload, 1);
        break;
      case AelfMessageTypes.GET_SIGNATURE:
        this.getSignature(sendResponse, message.payload);
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

  /**
   * initAelfContract
   *
   * @param {Function} sendResponse sendResponse
   * @param {Object} callInfo callInfo
   *
   */
  initAelfContractCallOnly = async (sendResponse: SendResponseFun, callInfo: InternalMessagePayload) => {
    try {
      const params: {
        appName?: string;
        chainId: string;
        account: string;
        method: string;
        contractName: string;
        contractAddress: string;
        rpcUrl: string;
      } = callInfo.params;
      const { account, contractName = '', contractAddress } = params;
      const { origin: _origin } = callInfo;
      console.log('>>>>>>>>>>>>>>>>>initAelfContract', params);
      const checkResult = await this._checkParamsAndReturnPermission(params, _origin);
      const connections = checkResult.data;
      if (checkResult.error !== 0 || !connections) return sendResponse(checkResult);
      let contracts: ContractsItem;
      const contractNew = {
        account,
        contractName,
        contractAddress,
      };
      const { permission } = connections[_origin] ?? {};
      if (!permission || !permission?.contracts) {
        const contract = {
          [account]: contractNew,
        };
        contracts = {
          [contractAddress]: contract,
        };
      } else {
        contracts = permission.contracts;
        if (!contracts[contractAddress]) contracts[contractAddress] = {};
        contracts[contractAddress][account] = contractNew;
      }
      const newConnections = connections;
      newConnections[_origin].permission.contracts = contracts;
      setLocalStorage({
        connections: newConnections,
      });
      sendResponse({ ...errorHandler(0), data: contractNew });
    } catch (error) {
      sendResponse({
        ...errorHandler(100001),
        data: error,
      });
    }
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

  getSignature = async (
    sendResponse: SendResponseFun,
    signatureInfo: BaseInternalMessagePayload & {
      hexToBeSign: string;
      account: string;
      appLogo?: string;
      appName: string;
    },
  ) => {
    console.log(signatureInfo);
    sendResponse(errorHandler(700001));
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
