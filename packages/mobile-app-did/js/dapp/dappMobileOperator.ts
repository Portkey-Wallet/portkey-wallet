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

  handleViewRequest = async (request: IRequestParams): Promise<IResponseType> => {
    const { eventName, method } = request;
    switch (method) {
      case RPCMethodsBase.ACCOUNTS: {
        return generateNormalResponse({
          eventName,
          data: await this.dappManager.accounts(this.origin),
        });
      }
      case RPCMethodsBase.CHAIN_ID:
      case RPCMethodsBase.CHAIN_IDS: {
        return generateNormalResponse({
          eventName,
          data: await this.dappManager.chainId(),
        });
      }
      case RPCMethodsBase.CHAINS_INFO: {
        return generateNormalResponse({
          eventName,
          data: await this.dappManager.chainsInfo(),
        });
      }
    }
    return generateErrorResponse({
      eventName,
      code: ResponseCode.UNIMPLEMENTED,
    });
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

  handleRequestAccounts = async (method: keyof IDappOverlay, eventName: string, params: DappStoreItem) => {
    const isActive = params.origin && (await this.dappManager.isActive(params.origin));
    if (isActive)
      return generateNormalResponse({
        eventName,
        data: await this.dappManager.accounts(params.origin!),
      });

    // user confirm
    const response = await this.userConfirmation({ eventName, method, params });
    if (response) return response;

    await this.dappManager.addDapp(params);
    return generateNormalResponse({
      eventName,
      data: await this.dappManager.accounts(params.origin!),
    });
  };
  handleSendTransaction = async (method: keyof IDappOverlay, eventName: string, params: SendTransactionParams) => {
    // user confirm
    try {
      const response = await this.userConfirmation({ eventName, method, params });
      if (response) return response;

      const chainInfo = await this.dappManager.getChainInfo(params.chainId);
      const caInfo = await this.dappManager.getCaInfo(params.chainId);

      if (!chainInfo || !chainInfo.endPoint || !params.params || !caInfo)
        return generateErrorResponse({ eventName, code: 40001, msg: 'invalid chain id' });

      const contract = await getContract({ rpcUrl: chainInfo.endPoint, contractAddress: chainInfo.caContractAddress });

      if (chainInfo.caContractAddress !== params.contractAddress) {
        const data = await contract?.callSendMethod(
          'ManagerForwardCall',
          '',
          {
            caHash: caInfo.caHash,
            methodName: params.method,
            contractAddress: params.contractAddress,
            args: (params.params as any).paramsOption,
          },
          {
            onMethod: 'transactionHash',
          },
        );
        if (!data?.error) {
          return generateNormalResponse({
            eventName,
            data,
          });
        } else {
          return generateErrorResponse({
            eventName,
            code: 40001,
            msg: handleErrorMessage(data.error),
          });
        }
      } else {
        return this.userDenied(eventName);
      }
    } catch (error) {
      return generateErrorResponse({
        eventName,
        code: 40001,
        msg: handleErrorMessage(error),
      });
    }
  };

  handleSendRequest = async (request: IRequestParams): Promise<IResponseType> => {
    console.log(request, '======request');

    const { method, eventName, origin } = request;
    if (this.origin !== origin)
      return generateErrorResponse({
        eventName,
        code: ResponseCode.ERROR_IN_PARAMS,
      });

    switch (method) {
      case RPCMethodsBase.REQUEST_ACCOUNTS: {
        return this.handleRequestAccounts(method, eventName, { origin: this.origin, icon: '', name: '' });
      }
      case RPCMethodsBase.SEND_TRANSACTION: {
        if (!(await this.dappManager.isActive(this.origin))) return this.unauthenticated(eventName);
        return this.handleSendTransaction(method, eventName, request.payload);
      }
    }
    return generateErrorResponse({
      eventName,
      code: ResponseCode.UNIMPLEMENTED,
    });
  };

  handleRequest = async (request: IRequestParams): Promise<IResponseType> => {
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
