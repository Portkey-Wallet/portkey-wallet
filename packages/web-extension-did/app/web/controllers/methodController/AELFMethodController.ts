/**
 * @file
 * The controller that handles the aelf method
 */
import NotificationService from 'service/NotificationService';
import { SendResponseFun } from 'types';
import { IPageState, RequestCommonHandler, RequestMessageData } from 'types/SW';
import errorHandler from 'utils/errorHandler';
import { RPCMethodsBase, ResponseCode } from '@portkey/provider-types';
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
  RPCMethodsBase.ACCOUNTS,
  RPCMethodsBase.CHAIN_ID,
  RPCMethodsBase.CHAIN_IDS,
  RPCMethodsBase.CHAINS_INFO,
  RPCMethodsBase.REQUEST_ACCOUNTS,
  RPCMethodsBase.SEND_TRANSACTION,
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
      getPin: () => !getPassword(),
      store: storeInSW,
    });
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
      case RPCMethodsBase.CHAINS_INFO:
        this.getChainsInfo(sendResponse, message.payload);
        break;
      case RPCMethodsBase.SEND_TRANSACTION:
        this.callSendContract(sendResponse, message.payload);
        break;
      case RPCMethodsBase.REQUEST_ACCOUNTS:
        this.requestAccounts(sendResponse, message.payload);
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

  isLocked = () => {
    return !this.getPassword();
  };

  getChainsInfo: RequestCommonHandler = async (sendResponse) => {
    const data = await this.dappManager.chainsInfo();
    sendResponse({ ...errorHandler(0), data });
  };

  getAccounts: RequestCommonHandler = async (sendResponse, message) => {
    const { origin } = message;
    let accounts = {};
    const locked = this.isLocked();
    if (!locked) accounts = await this.dappManager.accounts(origin);
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
    const permissionAccount = await this.approvalController.authorizedToConnect({
      appName: 'appName',
      appLogo: 'appName',
      origin,
    });
    console.log(permissionAccount, 'permissionAccount===');

    if (permissionAccount.error !== 0) return sendResponse(permissionAccount);
    // const connectAccount: string[] = permissionAccount.data;
    // const account = pageState.wallet.accountList?.filter((item) => item.address === connectAccount[0]);
    // SWEventController.accountsChanged(account?.[0], (res) => {
    //   console.log(res, 'onDisconnect==accountsChanged');
    // });
    // console.log(connectAccount, 'connectWallet==');
    // sendResponse({
    //   ...errorHandler(0),
    //   data: {
    //     accountName: account?.[0].accountName,
    //     accountType: account?.[0].accountType,
    //     address: account?.[0].address,
    //     publicKey: account?.[0].publicKey,
    //   },
    // });
  };

  callSendContract: RequestCommonHandler = async (sendResponse, message) => {
    if (!(await this.dappManager.isActive(message.origin)))
      return sendResponse({
        ...errorHandler(200016),
        data: {
          code: ResponseCode.UNAUTHENTICATED,
        },
      });
    // const { payload } = message;
    // const chainInfo = await this.dappManager.getChainInfo(payload.chainId);
    // const caInfo = await this.dappManager.getCaInfo(payload.chainId);
    // // When methodName is Transfer, parameters need to be verified
    // if (methodName === 'Transfer') {
    //   const transferInfo = paramsOption[0];
    //   if (transferInfo && transferInfo.amount && transferInfo.to && transferInfo.symbol) {
    //     // isVerified = true;
    //   } else {
    //     return sendResponse(errorHandler(400001, 'Missing params'));
    //   }
    // }
    // const signResult = await this.notificationService.openPrompt({
    //   method: PromptRouteTypes.SIGN_MESSAGE,
    //   search: JSON.stringify({
    //     appName: appName ?? _origin,
    //     rpcUrl,
    //     methodName,
    //     appLogo,
    //     isGetSignTx,
    //     ...contracts[contractAddress][account],
    //     paramsOption,
    //   }),
    // });
    // sendResponse(signResult);
    // return this.handleSendTransaction(method, eventName, request.payload);
  };

  // handleSendTransaction = async (method: keyof IDappOverlay, eventName: string, params: SendTransactionParams) => {
  //   // user confirm
  //   try {
  //     const response = await this.userConfirmation({ eventName, method, params });
  //     if (response) return response;

  //     const chainInfo = await this.dappManager.getChainInfo(params.chainId);
  //     const caInfo = await this.dappManager.getCaInfo(params.chainId);

  //     if (!chainInfo || !chainInfo.endPoint || !params.params || !caInfo)
  //       return generateErrorResponse({ eventName, code: 40001, msg: 'invalid chain id' });

  //     const contract = await getContract({ rpcUrl: chainInfo.endPoint, contractAddress: chainInfo.caContractAddress });

  //     if (chainInfo.caContractAddress !== params.contractAddress) {
  //       const data = await contract?.callSendMethod(
  //         'ManagerForwardCall',
  //         '',
  //         {
  //           caHash: caInfo.caHash,
  //           methodName: params.method,
  //           contractAddress: params.contractAddress,
  //           args: (params.params as any).paramsOption,
  //         },
  //         {
  //           onMethod: 'transactionHash',
  //         },
  //       );
  //       if (!data?.error) {
  //         return generateNormalResponse({
  //           eventName,
  //           data,
  //         });
  //       } else {
  //         return generateErrorResponse({
  //           eventName,
  //           code: 40001,
  //           msg: handleErrorMessage(data.error),
  //         });
  //       }
  //     } else {
  //       return this.userDenied(eventName);
  //     }
  //   } catch (error) {
  //     return generateErrorResponse({
  //       eventName,
  //       code: 40001,
  //       msg: handleErrorMessage(error),
  //     });
  //   }
  // };
}
