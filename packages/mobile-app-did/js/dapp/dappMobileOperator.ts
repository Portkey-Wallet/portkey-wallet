/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  IDappInteractionStream,
  IRequestParams,
  IResponseType,
  ResponseCode,
  MethodsBase,
  MethodsUnimplemented,
  SendTransactionParams,
  NotificationEvents,
} from '@portkey/provider-types';
import DappEventBus from './dappEventBus';
import { generateNormalResponse, generateErrorResponse } from '@portkey/provider-utils';
import { IDappManager } from '@portkey-wallet/types/types-ca/dapp';
import { IDappOverlay } from './dappOverlay';
import { Operator } from '@portkey/providers/dist/Operator';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { getManagerAccount, getPin } from 'utils/redux';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { isEqDapp } from '@portkey-wallet/utils/dapp/browser';

function getContract({ rpcUrl, contractAddress }: { rpcUrl: string; contractAddress: string }) {
  const pin = getPin();
  if (!pin) return;
  const manager = getManagerAccount(pin);
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
  protected dappManager: IDappManager;
  protected dappOverlay: IDappOverlay;
  constructor({ stream, origin, dappManager, dappOverlay }: DappMobileOperatorOptions) {
    super(stream);
    this.dapp = { origin };
    this.onCreate();
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
    const authorized = await this.dappOverlay[method](params);
    if (!authorized) return this.userDenied(eventName);
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
      case MethodsUnimplemented.GET_WALLET_STATE: {
        return generateNormalResponse({
          eventName,
          data: {
            accounts: await this.dappManager.accounts(this.dapp.origin),
            isConnected: await this.dappManager.isActive(this.dapp.origin),
            isUnlocked: !(await this.dappManager.isLocked()),
          },
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
    // connected
    DappEventBus.dispatchEvent({
      eventName: NotificationEvents.CONNECTED,
      data: {
        chainIds: await this.dappManager.chainIds(),
      },
    });
    return generateNormalResponse({
      eventName,
      data: await this.dappManager.accounts(params.origin!),
    });
  };
  protected handleSendTransaction: SendRequest<SendTransactionParams> = async (eventName, params) => {
    try {
      if (!params.params) return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });

      const chainInfo = await this.dappManager.getChainInfo(params.chainId);
      const caInfo = await this.dappManager.getCaInfo(params.chainId);

      if (!chainInfo?.endPoint || !caInfo?.caHash)
        return generateErrorResponse({ eventName, code: 4002, msg: 'invalid chain id' });

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

      const data = await contract!.callSendMethod(functionName, '', paramsOption, {
        onMethod: 'transactionHash',
      });
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

    const isActive = await this.dappManager.isActive(this.dapp.origin);

    let callBack: SendRequest, params: any;
    switch (method) {
      case MethodsBase.REQUEST_ACCOUNTS: {
        if (isActive)
          return generateNormalResponse({
            eventName,
            data: await this.dappManager.accounts(this.dapp.origin),
          });
        callBack = this.handleRequestAccounts;
        params = this.dapp;
        break;
      }
      case MethodsBase.SEND_TRANSACTION: {
        if (!isActive) return this.unauthenticated(eventName);
        callBack = this.handleSendTransaction;
        params = request.payload;
        break;
      }
    }
    return this.sendRequest({
      eventName,
      params,
      method: method as any,
      callBack: callBack!,
    });
  };

  handleRequest = async (request: IRequestParams): Promise<IResponseType> => {
    console.log(request, '======request');

    if (request.method === MethodsBase.SEND_TRANSACTION || request.method === MethodsBase.REQUEST_ACCOUNTS)
      return this.handleSendRequest(request);
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
  public updateDappInfo = async (dapp: DappStoreItem) => {
    if (isEqDapp(this.dapp, dapp)) return;
    this.dapp = dapp;
    const isActive = await this.dappManager.isActive(this.dapp.origin);
    if (isActive) this.dappManager.updateDapp(dapp);
  };
}
