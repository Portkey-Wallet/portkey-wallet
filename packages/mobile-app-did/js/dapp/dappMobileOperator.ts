/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  IDappInteractionStream,
  IRequestParams,
  IResponseType,
  ResponseCode,
  MethodsBase,
  MethodsUnimplemented,
  SendTransactionParams,
} from '@portkey/provider-types';
import DappEventBus from './dappEventBus';
import { generateNormalResponse, generateErrorResponse } from '@portkey/provider-utils';
import { IDappManager } from '@portkey-wallet/types/types-ca/dapp';
import { IDappOverlay } from './dappOverlay';
import { Operator } from '@portkey/providers';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { getManagerAccount, getPin } from 'utils/redux';
import { handleErrorMessage } from '@portkey-wallet/utils';

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
  public origin: string;
  protected dappManager: IDappManager;
  protected dappOverlay: IDappOverlay;
  constructor({ stream, origin, dappManager, dappOverlay }: DappMobileOperatorOptions) {
    super(stream);
    this.origin = origin;
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

  userConfirmation = async ({
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

  handleViewRequest = async (request: IRequestParams): Promise<IResponseType> => {
    const { eventName, method } = request;
    switch (method) {
      case MethodsBase.ACCOUNTS: {
        return generateNormalResponse({
          eventName,
          data: await this.dappManager.accounts(this.origin),
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
            accounts: await this.dappManager.accounts(this.origin),
            isConnected: await this.dappManager.isActive(this.origin),
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

  handleRequestAccounts: SendRequest<DappStoreItem> = async (eventName, params) => {
    await this.dappManager.addDapp(params);
    return generateNormalResponse({
      eventName,
      data: await this.dappManager.accounts(params.origin!),
    });
  };
  handleSendTransaction: SendRequest<SendTransactionParams> = async (eventName, params) => {
    try {
      if (!params.params) return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });

      const chainInfo = await this.dappManager.getChainInfo(params.chainId);
      const caInfo = await this.dappManager.getCaInfo(params.chainId);

      if (!chainInfo?.endPoint || !caInfo?.caHash)
        return generateErrorResponse({ eventName, code: 4002, msg: 'invalid chain id' });

      const contract = await getContract({ rpcUrl: chainInfo.endPoint, contractAddress: chainInfo.caContractAddress });

      const isCAAddress = chainInfo.caContractAddress !== params.contractAddress;

      let paramsOption = (params.params as { paramsOption: object }).paramsOption;

      const functionName = isCAAddress ? 'ManagerForwardCall' : params.method;

      paramsOption = isCAAddress
        ? {
            caHash: caInfo.caHash,
            methodName: params.method,
            contractAddress: params.contractAddress,
            args: paramsOption,
          }
        : paramsOption;

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
          code: 4007,
          msg: handleErrorMessage(data.error),
        });
      }
    } catch (error) {
      return generateErrorResponse({
        eventName,
        code: 4007,
        msg: handleErrorMessage(error),
      });
    }
  };

  async sendRequest({
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

  handleSendRequest = async (request: IRequestParams): Promise<IResponseType> => {
    const { method, eventName, origin } = request;
    if (this.origin !== origin)
      return generateErrorResponse({
        eventName,
        code: ResponseCode.ERROR_IN_PARAMS,
      });

    const isActive = await this.dappManager.isActive(this.origin);

    let callBack: SendRequest, params: any;
    switch (method) {
      case MethodsBase.REQUEST_ACCOUNTS: {
        if (isActive)
          return generateNormalResponse({
            eventName,
            data: await this.dappManager.accounts(this.origin!),
          });
        callBack = this.handleRequestAccounts;
        params = { origin: this.origin, icon: '', name: '' };
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

  userDenied(eventName: string) {
    return generateErrorResponse({
      eventName,
      code: ResponseCode.USER_DENIED,
    });
  }
  unauthenticated(eventName: string) {
    return generateErrorResponse({
      eventName,
      code: ResponseCode.UNAUTHENTICATED,
    });
  }
}
