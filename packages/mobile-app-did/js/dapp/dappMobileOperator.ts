/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  IDappInteractionStream,
  IRequestParams,
  IResponseType,
  ResponseCode,
  RPCMethodsBase,
  SendTransactionParams,
} from '@portkey/provider-types';
import DappEventBus from './dappEventBus';
import { generateNormalResponse, generateErrorResponse } from '@portkey/provider-utils';
import { IDappManager } from '@portkey-wallet/types/types-ca/dapp';
import { IDappOverlay } from './dappOverlay';
import Operator from '@portkey/providers/dist/Operator';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';

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

  handleViewRequest = async (request: IRequestParams<any>): Promise<IResponseType<any>> => {
    const { eventName, method } = request;
    console.log(method, eventName);
    switch (method) {
      case RPCMethodsBase.ACCOUNTS: {
        return generateNormalResponse({
          eventName,
          data: this.dappManager.accounts(this.origin),
        });
      }
      case RPCMethodsBase.CHAIN_ID:
      case RPCMethodsBase.CHAIN_IDS: {
        return generateNormalResponse({
          eventName,
          data: this.dappManager.chainId(),
        });
      }
      case RPCMethodsBase.CHAINS_INFO: {
        return generateNormalResponse({
          eventName,
          data: this.dappManager.chainsInfo(),
        });
      }
    }
    return generateErrorResponse({
      eventName,
      code: ResponseCode.UNIMPLEMENTED,
    });
  };
  handleRequestAccounts = async (eventName: string, dapp: DappStoreItem) => {
    const isActive = dapp.origin && this.dappManager.isActive(dapp.origin);
    if (isActive)
      return generateNormalResponse({
        eventName,
        data: this.dappManager.accounts(dapp.origin!),
      });
    const authorized = await this.dappOverlay.requestAccounts(dapp);
    if (!authorized) return this.userDenied(eventName);
    this.dappManager.addDapp(dapp);
    return generateNormalResponse({
      eventName,
      data: this.dappManager.accounts(dapp.origin!),
    });
  };
  handleSendTransaction = async (eventName: string, params: SendTransactionParams) => {
    const authorized = await this.dappOverlay.sendTransaction(params);
    if (!authorized) return this.userDenied(eventName);
    return generateNormalResponse({
      eventName,
      // TODO: send contract
      // mock id
      data: { transactionId: 'transactionId' },
    });
  };

  handleSendRequest = async (request: IRequestParams<any>): Promise<IResponseType<any>> => {
    const { method, eventName, origin } = request;
    if (this.origin !== origin)
      return generateErrorResponse({
        eventName,
        code: ResponseCode.ERROR_IN_PARAMS,
      });

    switch (method) {
      case RPCMethodsBase.SEND_TRANSACTION: {
        if (!this.dappManager.isActive(this.origin)) return this.unauthenticated(eventName);
        return this.handleSendTransaction(eventName, request.payload);
      }
      case RPCMethodsBase.REQUEST_ACCOUNTS: {
        return this.handleRequestAccounts(eventName, { origin: this.origin, icon: '', name: '' });
      }
    }
    return generateErrorResponse({
      eventName,
      code: ResponseCode.UNIMPLEMENTED,
    });
  };

  handleRequest = async (request: IRequestParams<any>): Promise<IResponseType<any>> => {
    if (request.method === RPCMethodsBase.SEND_TRANSACTION || request.method === RPCMethodsBase.REQUEST_ACCOUNTS)
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
