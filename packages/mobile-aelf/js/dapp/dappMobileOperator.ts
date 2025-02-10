/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  IDappInteractionStream,
  IRequestParams,
  IResponseType,
  ResponseCode,
  MethodsBase,
  MethodsWallet,
  SendTransactionParams,
  NotificationEvents,
  WalletState,
  GetSignatureParams,
  MethodsType,
} from '@portkey/provider-types';
import DappEventBus from './dappEventBus';
import { generateNormalResponse, generateErrorResponse } from '@portkey/provider-utils';
import { IDappManager } from '@portkey-wallet/types/types-eoa/dapp';
import { IDappOverlay } from './dappOverlay';
import { Operator } from '@portkey/providers';
import { DappStoreItem } from '@portkey-wallet/store/store-eoa/dapp/type';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { getCurrentCaHash, getManagerAccount, getPin } from 'utils/redux';
import { checkIsCipherText, handleErrorMessage } from '@portkey-wallet/utils';
import { isEqDapp } from '@portkey-wallet/utils/dapp/browser';
import {
  ApproveMethod,
  DAPP_WHITELIST,
  DAPP_WHITELIST_ACTION_WHITELIST,
  REMEMBER_ME_ACTION_WHITELIST,
} from '@portkey-wallet/constants/constants-eoa/dapp';
import { checkSiteIsInBlackList, hasSessionInfoExpired, verifySession } from '@portkey-wallet/utils/session';
import { ZERO } from '@portkey-wallet/constants/misc';
import { ChainId } from '@portkey-wallet/types';
import AElf from 'aelf-sdk';
import { getApproveSymbol } from '@portkey-wallet/utils/token';
import { Share } from 'react-native';
const NATIVE_METHOD: MethodsType[] = ['Share'];
const NATIVE_METHOD_MAP = {
  Share: 'Share',
};
const SEND_METHOD: { [key: string]: true } = {
  [MethodsBase.SEND_TRANSACTION]: true,
  [MethodsBase.REQUEST_ACCOUNTS]: true,
  [MethodsBase.SET_WALLET_CONFIG_OPTIONS]: true,
  [MethodsWallet.GET_WALLET_SIGNATURE]: true,
  [MethodsWallet.GET_WALLET_TRANSACTION_SIGNATURE]: true,
  [MethodsWallet.GET_WALLET_MANAGER_SIGNATURE]: true,
};

const ACTIVE_VIEW_METHOD: { [key: string]: true } = {
  [MethodsWallet.GET_WALLET_NAME]: true,
};

function getManager() {
  const pin = getPin();
  if (!pin) {
    return;
  }
  return getManagerAccount(pin);
}

function getContract({ rpcUrl, contractAddress }: { rpcUrl: string; contractAddress: string }) {
  const manager = getManager();
  if (!manager) {
    return;
  }
  return getContractBasic({ rpcUrl, contractAddress, account: manager });
}

type SendRequest<T = any> = (eventName: string, params: T) => Promise<IResponseType<any>>;

export type DappMobileOperatorOptions = {
  origin: string;
  stream: IDappInteractionStream;
  dappManager: IDappManager;
  dappOverlay: IDappOverlay;
  isDiscover?: boolean;
  dappWhiteList?: string[];
};
export default class DappMobileOperator extends Operator {
  public dapp: DappStoreItem;
  protected stream: IDappInteractionStream;
  protected dappManager: IDappManager;
  protected dappOverlay: IDappOverlay;
  protected dappWhiteList: string[];
  public isLockDapp?: boolean;
  public isDiscover?: boolean;
  public config: { [key: string]: boolean };
  constructor({ stream, origin, dappManager, dappOverlay, isDiscover, dappWhiteList }: DappMobileOperatorOptions) {
    super(stream);
    this.dapp = { origin };
    this.onCreate();
    this.stream = stream;
    this.dappManager = dappManager;
    this.dappOverlay = dappOverlay;
    this.isDiscover = isDiscover;
    this.config = {};
    this.dappWhiteList = dappWhiteList || DAPP_WHITELIST;
  }
  private onCreate = () => {
    DappEventBus.registerOperator(this);
  };

  public onDestroy = () => {
    DappEventBus.unregisterOperator(this);
  };

  protected userConfirmation = async ({
    eventName,
    params,
    method,
    isCipherText,
    realMethod,
  }: {
    eventName: string;
    params: any;
    method: keyof IDappOverlay;
    isCipherText?: boolean;
    realMethod: string;
  }): Promise<IResponseType | undefined> => {
    const authorized = await this.dappOverlay[method](this.dapp, params, realMethod, isCipherText || false);
    if (!authorized) {
      return this.userDenied(eventName);
    }
  };
  protected isActive = async () => {
    return this.dappManager.isActive(this.dapp.origin);
  };

  protected handleActiveViewRequest = async (request: IRequestParams): Promise<IResponseType> => {
    const { eventName, method } = request;
    const isActive = await this.isActive();
    if (!isActive) {
      return this.unauthenticated(eventName);
    }
    switch (method) {
      case MethodsWallet.GET_WALLET_NAME: {
        return generateNormalResponse({
          eventName,
          data: await this.dappManager.walletName(),
        });
      }
    }
    return generateErrorResponse({
      eventName,
      code: ResponseCode.UNIMPLEMENTED,
    });
  };

  protected handleViewRequest = async (request: IRequestParams): Promise<IResponseType> => {
    const { eventName, method } = request;
    if (ACTIVE_VIEW_METHOD[method]) {
      return this.handleActiveViewRequest(request);
    }

    switch (method) {
      case MethodsBase.ACCOUNTS: {
        if (this.dappWhiteList.includes(this.dapp.origin)) {
          await this.autoApprove();
        }

        return generateNormalResponse({
          eventName,
          data: await this.dappManager.accounts(this.dapp.origin),
        });
      }
      case MethodsBase.CHAIN_ID:
      case MethodsBase.CHAIN_IDS: {
        return generateNormalResponse({
          eventName,
          data: await this.dappManager.chainId(),
        });
      }
      case MethodsBase.CHAINS_INFO: {
        return generateNormalResponse({
          eventName,
          data: await this.dappManager.chainsInfo(),
        });
      }
      case MethodsBase.NETWORK: {
        return generateNormalResponse({
          eventName,
          data: await this.dappManager.networkType(),
        });
      }
      case MethodsWallet.GET_WALLET_STATE: {
        if (this.dappWhiteList.includes(this.dapp.origin)) {
          await this.autoApprove();
        }

        const [isActive, isLocked] = await Promise.all([this.isActive(), this.dappManager.isLocked()]);
        const data: WalletState = { isConnected: isActive, isUnlocked: !isLocked };
        if (isActive) {
          const [accounts, chainIds, networkType] = await Promise.all([
            this.dappManager.accounts(this.dapp.origin),
            this.dappManager.chainIds(),
            this.dappManager.networkType(),
          ]);
          data.accounts = accounts;
          data.chainIds = chainIds;
          data.networkType = networkType;
        }
        return generateNormalResponse({
          eventName,
          data,
        });
      }
    }
    return generateErrorResponse({
      eventName,
      code: ResponseCode.UNIMPLEMENTED,
    });
  };

  protected handleRequestAccounts: SendRequest<DappStoreItem> = async (eventName, params) => {
    await this.dappManager.addDapp(params);
    return generateNormalResponse({
      eventName,
      data: await this.dappManager.accounts(params.origin!),
    });
  };

  protected async getTokenContract(chainId: ChainId) {
    const chainInfo = await this.dappManager.getChainInfo(chainId);
    if (!chainInfo?.endPoint) {
      return 'invalid chain id';
    }
    return {
      chainInfo,
      tokenContract: await getContract({ rpcUrl: chainInfo.endPoint, contractAddress: chainInfo.defaultToken.address }),
    };
  }

  protected handleSendTransaction: SendRequest<SendTransactionParams> = async (eventName, params) => {
    try {
      const contractInfo = await this.getTokenContract(params.chainId);

      if (typeof contractInfo === 'string') {
        return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS, msg: contractInfo });
      }

      const { tokenContract: contract } = contractInfo || {};

      const paramsOption = (params.params as { paramsOption: object }).paramsOption,
        functionName = params.method;

      const data = await contract!.callSendMethod(functionName, '', paramsOption, { onMethod: 'transactionHash' });
      if (!data?.error) {
        return generateNormalResponse({
          eventName,
          data,
        });
      } else {
        return generateErrorResponse({
          eventName,
          code: ResponseCode.CONTRACT_ERROR,
          msg: handleErrorMessage(data.error),
        });
      }
    } catch (error) {
      return generateErrorResponse({
        eventName,
        code: ResponseCode.CONTRACT_ERROR,
        msg: handleErrorMessage(error),
      });
    }
  };
  protected handleSignature: SendRequest<GetSignatureParams> = async (eventName, params) => {
    try {
      if (!params.data) {
        return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
      }
      const manager = getManager();
      if (!manager?.keyPair) {
        return generateErrorResponse({ eventName, code: ResponseCode.INTERNAL_ERROR });
      }
      const data = manager.keyPair.sign(params.data);
      return generateNormalResponse({
        eventName,
        data,
      });
    } catch (error) {
      return generateErrorResponse({
        eventName,
        code: ResponseCode.CONTRACT_ERROR,
        msg: handleErrorMessage(error),
      });
    }
  };
  protected handleTransactionSignature: SendRequest<GetSignatureParams> = async (eventName, params) => {
    try {
      if (!params.data) {
        return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
      }
      const manager = getManager();
      if (!manager?.keyPair) {
        return generateErrorResponse({ eventName, code: ResponseCode.INTERNAL_ERROR });
      }
      const data = manager.keyPair.sign(AElf.utils.sha256(Buffer.from(params.data, 'hex')), {
        canonical: true,
      });
      return generateNormalResponse({
        eventName,
        data,
      });
    } catch (error) {
      return generateErrorResponse({
        eventName,
        code: ResponseCode.CONTRACT_ERROR,
        msg: handleErrorMessage(error),
      });
    }
  };
  protected handleManagerSignature: SendRequest<GetSignatureParams> = async (eventName, params) => {
    try {
      if (!params.data) {
        return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
      }
      const manager = getManager();
      if (!manager?.keyPair) {
        return generateErrorResponse({ eventName, code: ResponseCode.INTERNAL_ERROR });
      }
      const data = manager.keyPair.sign(AElf.utils.sha256(params.data), {
        canonical: true,
      });
      return generateNormalResponse({
        eventName,
        data,
      });
    } catch (error) {
      return generateErrorResponse({
        eventName,
        code: ResponseCode.CONTRACT_ERROR,
        msg: handleErrorMessage(error),
      });
    }
  };
  protected async sendRequest({
    eventName,
    params,
    method,
    callBack,
    isCipherText,
    realMethod,
  }: {
    eventName: string;
    params: any;
    method: keyof IDappOverlay;
    callBack: SendRequest;
    isCipherText?: boolean;
    realMethod: string;
  }) {
    // is whitelist && is whitelist actions
    if (this.dappWhiteList.includes(this.dapp.origin) && DAPP_WHITELIST_ACTION_WHITELIST.includes(method)) {
      return callBack(eventName, params);
    }

    const validSession = await this.verifySessionInfo();

    // valid session && is remember me actions
    if (validSession && REMEMBER_ME_ACTION_WHITELIST.includes(method)) {
      return callBack(eventName, params);
    }

    // user confirm
    const response = await this.userConfirmation({ eventName, method, params, isCipherText, realMethod });
    if (response) {
      return response;
    }
    return callBack(eventName, params);
  }

  protected handleApprove = async (request: IRequestParams) => {
    const { payload, eventName } = request || {};
    const { params } = payload || {};

    const { symbol, amount, spender } = params?.paramsOption || {};
    // check approve input && check valid amount
    if (!(symbol && amount && spender) || ZERO.plus(amount).isNaN() || ZERO.plus(amount).lte(0)) {
      return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
    }

    const contractInfo = await this.getTokenContract(payload.chainId);

    if (typeof contractInfo === 'string') {
      return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS, msg: contractInfo });
    }

    const { tokenContract: contract } = contractInfo || {};

    const tokenInfo = await contract?.callViewMethod('GetTokenInfo', { symbol });

    if (tokenInfo?.error || isNaN(tokenInfo?.data.decimals)) {
      return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS, msg: `${symbol} error` });
    }
    const info = await this.dappOverlay.approve(this.dapp, {
      approveInfo: {
        ...params?.paramsOption,
        decimals: tokenInfo?.data.decimals,
        targetChainId: payload.chainId,
      },
      isDiscover: this.isDiscover,
      eventName,
      batchApproveNFT: this.config?.batchApproveNFT,
    });

    if (!info) {
      return this.userDenied(eventName);
    }
    const { approveInfo } = info;

    const finallyApproveSymbol = this.config?.batchApproveNFT ? getApproveSymbol(approveInfo.symbol) : symbol;

    return this.handleSendTransaction(eventName, {
      ...payload,
      method: 'Approve',
      params: {
        paramsOption: {
          spender: approveInfo.spender,
          symbol: finallyApproveSymbol,
          amount: approveInfo.amount,
        },
      },
    } as SendTransactionParams);
  };

  protected isApprove = async (request: IRequestParams) => {
    const { contractAddress, method: contractMethod, chainId } = request.payload || {};
    const chainInfo = await this.dappManager.getChainInfo(chainId);
    return contractAddress === chainInfo?.defaultToken.address && contractMethod === ApproveMethod.token;
  };

  protected handleSendRequest = async (request: IRequestParams): Promise<IResponseType> => {
    const { eventName, origin } = request;
    const realMethod = request.method;
    let method = request.method;
    let isCipherText = true;
    if (this.dapp.origin !== origin) {
      return generateErrorResponse({
        eventName,
        code: ResponseCode.ERROR_IN_PARAMS,
      });
    }

    const isActive = await this.isActive();

    let callBack: SendRequest, payload: any;
    switch (method) {
      case MethodsBase.SET_WALLET_CONFIG_OPTIONS: {
        payload = request.payload;
        this.config = payload;
        console.log(this.config, '=====this.config');
        return generateNormalResponse({
          eventName,
          data: true,
          code: ResponseCode.SUCCESS,
        });
      }
      case MethodsBase.REQUEST_ACCOUNTS: {
        if (isActive) {
          return generateNormalResponse({
            eventName,
            data: await this.dappManager.accounts(this.dapp.origin),
          });
        }
        callBack = this.handleRequestAccounts;
        payload = this.dapp;
        break;
      }
      case MethodsBase.SEND_TRANSACTION: {
        if (!isActive) {
          return this.unauthenticated(eventName);
        }

        payload = request.payload;
        if (
          !payload ||
          typeof payload.params !== 'object' ||
          !payload.method ||
          !payload.contractAddress ||
          !payload.chainId ||
          !payload.rpcUrl
        ) {
          return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
        }
        // is approve
        const isApprove = await this.isApprove(request);
        if (isApprove) {
          return this.handleApprove(request);
        }

        callBack = this.handleSendTransaction;
        break;
      }
      case MethodsWallet.GET_WALLET_SIGNATURE: {
        if (!isActive) {
          return this.unauthenticated(eventName);
        }
        callBack = this.handleSignature;
        payload = { data: request.payload.data };
        isCipherText = checkIsCipherText(payload.data);
        if (!payload || (typeof payload.data !== 'string' && typeof payload.data !== 'number')) {
          return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
        }
        break;
      }
      case MethodsWallet.GET_WALLET_TRANSACTION_SIGNATURE: {
        if (request.payload.hexData && !request.payload.data) {
          request.payload.data = request.payload.hexData;
        }
        method = MethodsWallet.GET_WALLET_SIGNATURE;
        isCipherText = true;
        if (!isActive) {
          return this.unauthenticated(eventName);
        }
        callBack = this.handleTransactionSignature;
        payload = { data: request.payload.data };
        if (!payload || (typeof payload.data !== 'string' && typeof payload.data !== 'number')) {
          return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
        }
        break;
      }
      case MethodsWallet.GET_WALLET_MANAGER_SIGNATURE: {
        if (request.payload.hexData && !request.payload.data) {
          request.payload.data = request.payload.hexData;
        }
        method = MethodsWallet.GET_WALLET_SIGNATURE;
        isCipherText = false;
        if (!isActive) {
          return this.unauthenticated(eventName);
        }
        callBack = this.handleManagerSignature;
        payload = { data: request.payload.data };
        if (!payload || (typeof payload.data !== 'string' && typeof payload.data !== 'number')) {
          return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
        }
        break;
      }
    }
    return this.sendRequest({
      eventName,
      params: payload,
      method: method as any,
      callBack: callBack!,
      isCipherText,
      realMethod,
    });
  };
  protected handleNativeDeviceRequest = async (request: IRequestParams): Promise<IResponseType> => {
    const { eventName, origin } = request;
    const method = request.method;
    if (this.dapp.origin !== origin) {
      return generateErrorResponse({
        eventName,
        code: ResponseCode.ERROR_IN_PARAMS,
      });
    }
    let callBack: SendRequest, payload: any;
    switch (method) {
      case NATIVE_METHOD_MAP.Share: {
        payload = request.payload;
        try {
          const result = await Share.share({
            message: payload.message,
            url: payload.url,
            title: payload.title || '',
          });
          return generateNormalResponse({
            eventName,
            data: {
              // true shareSuccess, false dismissShare dialog
              shareSuccess: result.action === Share.sharedAction,
            },
            code: ResponseCode.SUCCESS,
          });
        } catch (e) {
          return generateErrorResponse({
            eventName,
            code: ResponseCode.INTERNAL_ERROR,
          });
        }
      }
    }
    return this.sendRequest({
      eventName,
      params: payload,
      method: method as any,
      callBack: callBack!,
      realMethod: method,
    });
  };
  public autoApprove = () => {
    // auto approve
    this.handleSendRequest({
      origin: this.dapp.origin,
      // no feedback required
      eventName: 'event',
      method: MethodsBase.REQUEST_ACCOUNTS,
    });
  };

  handleRequest = async (request: IRequestParams): Promise<IResponseType> => {
    console.log('handleRequest==== params', request);
    // dapp is not in the foreground
    if (this.isLockDapp) {
      return this.userDenied(request.eventName);
    }
    if (NATIVE_METHOD.includes(request.method)) {
      return this.handleNativeDeviceRequest(request);
    }
    if (SEND_METHOD[request.method]) {
      return this.handleSendRequest(request);
    }
    return this.handleViewRequest(request);
  };

  protected userDenied(eventName: string) {
    return generateErrorResponse({
      eventName,
      code: ResponseCode.USER_DENIED,
    });
  }
  protected unauthenticated(eventName: string) {
    return generateErrorResponse({
      eventName,
      code: ResponseCode.UNAUTHENTICATED,
    });
  }

  public publishEvent = async (event: IResponseType): Promise<void> => {
    if (event.eventName === NotificationEvents.ACCOUNTS_CHANGED) {
      const isActive = await this.isActive();
      if (!isActive) {
        return;
      }
    }
    this.stream.write(JSON.stringify(event));
  };

  public updateDappInfo = async (dapp: DappStoreItem) => {
    if (isEqDapp(this.dapp, dapp)) {
      return;
    }
    this.dapp = dapp;
    const isActive = await this.isActive();
    if (isActive) {
      this.dappManager.updateDapp(dapp);
    }
  };

  public verifySessionInfo = async () => {
    try {
      const rememberMeBlackList = await this.dappManager.getRememberMeBlackList();
      // is remember me black list
      if (checkSiteIsInBlackList(rememberMeBlackList || [], this.dapp.origin)) {
        return false;
      }

      const sessionInfo = await this.dappManager.getSessionInfo(this.dapp.origin);
      const manager = getManager();
      const caHash = getCurrentCaHash();
      if (!manager?.keyPair || !caHash || !sessionInfo) {
        return false;
      }
      const valid = verifySession({
        keyPair: manager.keyPair,
        origin: this.dapp.origin,
        managerAddress: manager.address,
        caHash,
        expiredPlan: sessionInfo.expiredPlan,
        expiredTime: sessionInfo.expiredTime,
        signature: sessionInfo.signature,
      });
      if (!valid) {
        return valid;
      }
      return !hasSessionInfoExpired(sessionInfo);
    } catch (error) {
      return false;
    }
  };

  public setIsLockDapp = (isLockDapp: boolean) => {
    this.isLockDapp = isLockDapp;
  };
}
