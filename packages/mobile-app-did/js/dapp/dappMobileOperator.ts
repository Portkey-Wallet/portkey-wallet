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
} from '@portkey/provider-types';
import DappEventBus from './dappEventBus';
import { generateNormalResponse, generateErrorResponse } from '@portkey/provider-utils';
import { IDappManager } from '@portkey-wallet/types/types-ca/dapp';
import { IDappOverlay } from './dappOverlay';
import { Operator } from '@portkey/providers/dist/operator';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { getManagerAccount, getPin } from 'utils/redux';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { isEqDapp } from '@portkey-wallet/utils/dapp/browser';
import { CA_METHOD_WHITELIST } from '@portkey-wallet/constants/constants-ca/dapp';
const SEND_METHOD: { [key: string]: true } = {
  [MethodsBase.SEND_TRANSACTION]: true,
  [MethodsBase.REQUEST_ACCOUNTS]: true,
  [MethodsWallet.GET_WALLET_SIGNATURE]: true,
};

function getManager() {
  const pin = getPin();
  if (!pin) return;
  return getManagerAccount(pin);
}

function getContract({ rpcUrl, contractAddress }: { rpcUrl: string; contractAddress: string }) {
  const manager = getManager();
  if (!manager) return;
  return getContractBasic({ rpcUrl, contractAddress, account: manager });
}

type SendRequest<T = any> = (eventName: string, params: T) => Promise<IResponseType<any>>;

export type DappMobileOperatorOptions = {
  origin: string;
  stream: IDappInteractionStream;
  dappManager: IDappManager;
  dappOverlay: IDappOverlay;
};
export default class DappMobileOperator extends Operator {
  public dapp: DappStoreItem;
  protected stream: IDappInteractionStream;
  protected dappManager: IDappManager;
  protected dappOverlay: IDappOverlay;
  constructor({ stream, origin, dappManager, dappOverlay }: DappMobileOperatorOptions) {
    super(stream);
    this.dapp = { origin };
    this.onCreate();
    this.stream = stream;
    this.dappManager = dappManager;
    this.dappOverlay = dappOverlay;
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
  }: {
    eventName: string;
    params: any;
    method: keyof IDappOverlay;
  }): Promise<IResponseType | undefined> => {
    const authorized = await this.dappOverlay[method](this.dapp, params);
    if (!authorized) return this.userDenied(eventName);
  };
  protected isActive = async () => {
    return this.dappManager.isActive(this.dapp.origin);
  };

  protected handleViewRequest = async (request: IRequestParams): Promise<IResponseType> => {
    const { eventName, method } = request;
    switch (method) {
      case MethodsBase.ACCOUNTS: {
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
      case MethodsWallet.GET_WALLET_NAME: {
        const isActive = await this.isActive();
        if (!isActive) return this.unauthenticated(eventName);
        return generateNormalResponse({
          eventName,
          data: await this.dappManager.walletName(),
        });
      }
      case MethodsBase.NETWORK: {
        return generateNormalResponse({
          eventName,
          data: await this.dappManager.networkType(),
        });
      }
      case MethodsWallet.GET_WALLET_STATE: {
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

  protected handleSendTransaction: SendRequest<SendTransactionParams> = async (eventName, params) => {
    try {
      const [chainInfo, caInfo] = await Promise.all([
        this.dappManager.getChainInfo(params.chainId),
        this.dappManager.getCaInfo(params.chainId),
      ]);

      if (!chainInfo?.endPoint || !caInfo?.caHash)
        return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid chain id' });

      if (chainInfo?.endPoint !== params.rpcUrl)
        return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid rpcUrl' });

      const contract = await getContract({ rpcUrl: chainInfo.endPoint, contractAddress: chainInfo.caContractAddress });

      const isForward = chainInfo.caContractAddress !== params.contractAddress;

      let paramsOption = (params.params as { paramsOption: object }).paramsOption,
        functionName = params.method;

      if (isForward) {
        paramsOption = {
          caHash: caInfo.caHash,
          methodName: params.method,
          contractAddress: params.contractAddress,
          args: paramsOption,
        };
        functionName = 'ManagerForwardCall';
      }

      if (!CA_METHOD_WHITELIST.includes(functionName))
        return generateErrorResponse({
          eventName,
          code: ResponseCode.CONTRACT_ERROR,
          msg: 'method is not in the whitelist',
        });

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
      if (!params.data) return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
      const manager = getManager();
      if (!manager?.keyPair) return generateErrorResponse({ eventName, code: ResponseCode.INTERNAL_ERROR });
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
  protected async sendRequest({
    eventName,
    params,
    method,
    callBack,
  }: {
    eventName: string;
    params: any;
    method: keyof IDappOverlay;
    callBack: SendRequest;
  }) {
    // user confirm
    const response = await this.userConfirmation({ eventName, method, params });
    if (response) return response;
    return callBack(eventName, params);
  }

  protected handleSendRequest = async (request: IRequestParams): Promise<IResponseType> => {
    const { method, eventName, origin } = request;
    if (this.dapp.origin !== origin)
      return generateErrorResponse({
        eventName,
        code: ResponseCode.ERROR_IN_PARAMS,
      });

    const isActive = await this.isActive();

    let callBack: SendRequest, payload: any;
    switch (method) {
      case MethodsBase.REQUEST_ACCOUNTS: {
        if (isActive)
          return generateNormalResponse({
            eventName,
            data: await this.dappManager.accounts(this.dapp.origin),
          });
        callBack = this.handleRequestAccounts;
        payload = this.dapp;
        break;
      }
      case MethodsBase.SEND_TRANSACTION: {
        if (!isActive) return this.unauthenticated(eventName);
        callBack = this.handleSendTransaction;
        payload = request.payload;
        if (
          !payload ||
          typeof payload.params !== 'object' ||
          !payload.method ||
          !payload.contractAddress ||
          !payload.chainId ||
          !payload.rpcUrl
        )
          return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
        break;
      }
      case MethodsWallet.GET_WALLET_SIGNATURE: {
        if (!isActive) return this.unauthenticated(eventName);
        callBack = this.handleSignature;
        payload = request.payload;
        if (!payload || (typeof payload.data !== 'string' && typeof payload.data !== 'number'))
          return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
        break;
      }
    }
    return this.sendRequest({
      eventName,
      params: payload,
      method: method as any,
      callBack: callBack!,
    });
  };

  handleRequest = async (request: IRequestParams): Promise<IResponseType> => {
    if (SEND_METHOD[request.method]) return this.handleSendRequest(request);
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
      if (!isActive) return;
    }
    this.stream.write(JSON.stringify(event));
  };

  public updateDappInfo = async (dapp: DappStoreItem) => {
    if (isEqDapp(this.dapp, dapp)) return;
    this.dapp = dapp;
    const isActive = await this.isActive();
    if (isActive) this.dappManager.updateDapp(dapp);
  };
}
