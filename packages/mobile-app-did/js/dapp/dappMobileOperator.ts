/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  IDappInteractionStream,
  IRequestParams,
  IResponseType,
  ResponseCode,
  MethodsBase,
  MethodsWallet,
  SendTransactionParams,
  SendMultiTransactionParams,
  NotificationEvents,
  WalletState,
  GetSignatureParams,
  MethodsType,
  ChainIdMap,
} from '@portkey/provider-types';
import DappEventBus from './dappEventBus';
import { generateNormalResponse, generateErrorResponse } from '@portkey/provider-utils';
import { IDappManager } from '@portkey-wallet/types/types-ca/dapp';
import { IDappOverlay } from './dappOverlay';
import { Operator } from '@portkey/providers';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { getCurrentCaHash, getManagerAccount, getPin } from 'utils/redux';
import { checkIsCipherText, handleErrorMessage } from '@portkey-wallet/utils';
import { isEqDapp } from '@portkey-wallet/utils/dapp/browser';
import {
  ApproveMethod,
  CA_METHOD_WHITELIST,
  DAPP_WHITELIST,
  DAPP_WHITELIST_ACTION_WHITELIST,
  REMEMBER_ME_ACTION_WHITELIST,
} from '@portkey-wallet/constants/constants-ca/dapp';
import { checkSiteIsInBlackList, hasSessionInfoExpired, verifySession } from '@portkey-wallet/utils/session';
import { ZERO } from '@portkey-wallet/constants/misc';
import { getGuardiansApprovedByApprove } from 'utils/guardian';
import { ChainId } from '@portkey-wallet/types';
import { checkSecuritySafe } from 'utils/security';
import AElf from 'aelf-sdk';
import { getApproveSymbol } from '@portkey-wallet/utils/token';
import { getAelfInstance } from '@portkey-wallet/utils/aelf';
import { Share } from 'react-native';
const NATIVE_METHOD: MethodsType[] = ['Share'];
const NATIVE_METHOD_MAP = {
  Share: 'Share',
};
const SEND_METHOD: { [key: string]: true } = {
  [MethodsBase.SEND_TRANSACTION]: true,
  [MethodsBase.SEND_MULTI_TRANSACTION]: true,
  [MethodsBase.REQUEST_ACCOUNTS]: true,
  [MethodsBase.SET_WALLET_CONFIG_OPTIONS]: true,
  [MethodsWallet.GET_WALLET_SIGNATURE]: true,
  [MethodsWallet.GET_WALLET_TRANSACTION_SIGNATURE]: true,
  [MethodsWallet.GET_WALLET_MANAGER_SIGNATURE]: true,
};

const ACTIVE_VIEW_METHOD: { [key: string]: true } = {
  [MethodsWallet.GET_WALLET_CURRENT_MANAGER_ADDRESS]: true,
  [MethodsWallet.GET_WALLET_MANAGER_SYNC_STATUS]: true,
  [MethodsWallet.GET_WALLET_NAME]: true,
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
  }: {
    eventName: string;
    params: any;
    method: keyof IDappOverlay;
    isCipherText?: boolean;
  }): Promise<IResponseType | undefined> => {
    const authorized = await this.dappOverlay[method](this.dapp, params, isCipherText || false);
    if (!authorized) return this.userDenied(eventName);
  };
  protected isActive = async () => {
    return this.dappManager.isActive(this.dapp.origin);
  };

  protected handleActiveViewRequest = async (request: IRequestParams): Promise<IResponseType> => {
    const { eventName, method } = request;
    const isActive = await this.isActive();
    if (!isActive) return this.unauthenticated(eventName);
    switch (method) {
      case MethodsWallet.GET_WALLET_NAME: {
        return generateNormalResponse({
          eventName,
          data: await this.dappManager.walletName(),
        });
      }
      case MethodsWallet.GET_WALLET_CURRENT_MANAGER_ADDRESS: {
        return generateNormalResponse({
          eventName,
          data: await this.dappManager.currentManagerAddress(),
        });
      }
      case MethodsWallet.GET_WALLET_MANAGER_SYNC_STATUS: {
        const chainId = request.payload.chainId;
        try {
          return generateNormalResponse({
            eventName,
            data: await this.checkManagerSyncState(chainId),
          });
        } catch (error: any) {
          return generateErrorResponse({ ...error, eventName, msg: error.msg || handleErrorMessage(error) });
        }
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
      case MethodsBase.CA_HASH: {
        return generateNormalResponse({
          eventName,
          data: await this.dappManager.caHash(),
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

  protected async getCAContract(params: SendTransactionParams, eventName: string) {
    const [chainInfo, caInfo] = await Promise.all([
      this.dappManager.getChainInfo(params.chainId),
      this.dappManager.getCaInfo(params.chainId),
    ]);
    if (!chainInfo?.endPoint || !caInfo?.caHash)
      return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid chain id' });
    if (chainInfo?.endPoint !== params.rpcUrl)
      return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid rpcUrl' });

    return {
      chainInfo,
      caInfo,
      caContract: await getContract({ rpcUrl: chainInfo.endPoint, contractAddress: chainInfo.caContractAddress }),
    };
  }

  protected async getTokenContract(chainId: ChainId) {
    const [chainInfo, caInfo] = await Promise.all([
      this.dappManager.getChainInfo(chainId),
      this.dappManager.getCaInfo(chainId),
    ]);
    if (!chainInfo?.endPoint || !caInfo?.caHash) return 'invalid chain id';

    return {
      chainInfo,
      caInfo,
      tokenContract: await getContract({ rpcUrl: chainInfo.endPoint, contractAddress: chainInfo.defaultToken.address }),
    };
  }
  protected handleSendTransaction: SendRequest<SendTransactionParams> = async (eventName, params) => {
    try {
      const info: any = await this.getCAContract(params, eventName);
      const { caContract: contract, caInfo, chainInfo } = info || {};
      if (!contract) return info;

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
  protected handleMultiSendTransaction: SendRequest<SendMultiTransactionParams> = async (eventName, params) => {
    const { multiChainInfo, gatewayUrl, chainId, params: multiTransactionParamInfo } = params;
    const chainInfo = await this.dappManager.getChainInfo(chainId);
    if (!chainInfo) throw new Error(`${chainId} chainInfo does not exist`);
    const transformedMultiChainInfo = Object.entries(multiChainInfo).reduce((acc, [key, value]) => {
      const chain = ChainIdMap[key as ChainId];
      if (chain) {
        (acc as { [key: string]: any })[chain] = value;
      }
      return acc;
    }, {});
    const aelfInstance = getAelfInstance(chainInfo.endPoint);
    const wallet = getManager();
    const contractOption = {
      multi: transformedMultiChainInfo,
      gatewayUrl,
    };
    const caContract = await aelfInstance.chain.contractAt(chainInfo.caContractAddress, wallet, contractOption);
    const transformedParams = Object.entries(multiTransactionParamInfo).reduce((acc, [key, value]) => {
      const chain = ChainIdMap[key as ChainId];
      if (chain) {
        (acc as { [key: string]: any })[chain] = value;
      }
      return acc;
    }, {});
    return await caContract.sendMultiTransactionToGateway(transformedParams);
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
  protected handleTransactionSignature: SendRequest<GetSignatureParams> = async (eventName, params) => {
    try {
      if (!params.data) return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
      const manager = getManager();
      if (!manager?.keyPair) return generateErrorResponse({ eventName, code: ResponseCode.INTERNAL_ERROR });
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
      if (!params.data) return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
      const manager = getManager();
      if (!manager?.keyPair) return generateErrorResponse({ eventName, code: ResponseCode.INTERNAL_ERROR });
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
  }: {
    eventName: string;
    params: any;
    method: keyof IDappOverlay;
    callBack: SendRequest;
    isCipherText?: boolean;
  }) {
    // is whitelist && is whitelist actions
    if (this.dappWhiteList.includes(this.dapp.origin) && DAPP_WHITELIST_ACTION_WHITELIST.includes(method))
      return callBack(eventName, params);

    const validSession = await this.verifySessionInfo();

    // valid session && is remember me actions
    if (validSession && REMEMBER_ME_ACTION_WHITELIST.includes(method)) return callBack(eventName, params);

    // user confirm
    const response = await this.userConfirmation({ eventName, method, params, isCipherText });
    if (response) return response;
    return callBack(eventName, params);
  }

  protected handleApprove = async (request: IRequestParams) => {
    const { payload, eventName } = request || {};
    const { params } = payload || {};

    const { symbol, amount, spender } = params?.paramsOption || {};
    // check approve input && check valid amount
    if (!(symbol && amount && spender) || ZERO.plus(amount).isNaN() || ZERO.plus(amount).lte(0))
      return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });

    const contractInfo = await this.getTokenContract(payload.chainId);

    if (typeof contractInfo === 'string')
      return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS, msg: contractInfo });

    const { tokenContract: contract, chainInfo } = contractInfo || {};

    const tokenInfo = await contract?.callViewMethod('GetTokenInfo', { symbol });

    if (tokenInfo?.error || isNaN(tokenInfo?.data.decimals))
      return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS, msg: `${symbol} error` });
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

    if (!info) return this.userDenied(eventName);
    const { guardiansApproved, approveInfo } = info;

    const finallyApproveSymbol = this.config?.batchApproveNFT ? getApproveSymbol(approveInfo.symbol) : symbol;

    const caHash = getCurrentCaHash();
    return this.handleSendTransaction(eventName, {
      ...payload,
      method: ApproveMethod.ca,
      contractAddress: chainInfo?.caContractAddress,
      params: {
        paramsOption: {
          caHash,
          spender: approveInfo.spender,
          symbol: finallyApproveSymbol,
          amount: approveInfo.amount,
          guardiansApproved: getGuardiansApprovedByApprove(guardiansApproved),
        },
      },
    } as SendTransactionParams);
  };

  protected isApprove = async (request: IRequestParams) => {
    const { contractAddress, method: contractMethod, chainId } = request.payload || {};
    const chainInfo = await this.dappManager.getChainInfo(chainId);
    return (
      (contractAddress === chainInfo?.defaultToken.address && contractMethod === ApproveMethod.token) ||
      (contractAddress === chainInfo?.caContractAddress && contractMethod === ApproveMethod.ca)
    );
  };

  protected handleSendRequest = async (request: IRequestParams): Promise<IResponseType> => {
    const { eventName, origin } = request;
    let method = request.method;
    let isCipherText = true;
    if (this.dapp.origin !== origin)
      return generateErrorResponse({
        eventName,
        code: ResponseCode.ERROR_IN_PARAMS,
      });

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
        // is safe
        try {
          const originChainId = await this.dappManager.getOriginChainId();
          const isSafe = await this.securityCheck(payload.chainId, originChainId);
          if (!isSafe) return this.userDenied(eventName);
        } catch (error) {
          return generateErrorResponse({
            eventName,
            code: ResponseCode.INTERNAL_ERROR,
            msg: handleErrorMessage(error),
          });
        }
        // is approve
        const isApprove = await this.isApprove(request);
        if (isApprove) return this.handleApprove(request);

        callBack = this.handleSendTransaction;
        break;
      }
      case MethodsBase.SEND_MULTI_TRANSACTION: {
        if (!isActive) return this.unauthenticated(eventName);

        payload = request.payload;
        if (
          !payload ||
          typeof payload.params !== 'object' ||
          !payload.rpcUrl ||
          !payload.tokenAddress ||
          !payload.multiChainInfo ||
          !payload.gatewayUrl
        )
          return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
        // todo_wade: confirm whether the approve check is needed
        // // is approve
        // const isApprove = await this.isApprove(request);
        // if (isApprove) return this.handleApprove(request);

        callBack = this.handleMultiSendTransaction;
        break;
      }
      case MethodsWallet.GET_WALLET_SIGNATURE: {
        if (!isActive) return this.unauthenticated(eventName);
        callBack = this.handleSignature;
        payload = { data: request.payload.data };
        isCipherText = checkIsCipherText(payload.data);
        if (!payload || (typeof payload.data !== 'string' && typeof payload.data !== 'number'))
          return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
        break;
      }
      case MethodsWallet.GET_WALLET_TRANSACTION_SIGNATURE: {
        if (request.payload.hexData && !request.payload.data) request.payload.data = request.payload.hexData;
        method = MethodsWallet.GET_WALLET_SIGNATURE;
        isCipherText = true;
        if (!isActive) return this.unauthenticated(eventName);
        callBack = this.handleTransactionSignature;
        payload = { data: request.payload.data };
        if (!payload || (typeof payload.data !== 'string' && typeof payload.data !== 'number'))
          return generateErrorResponse({ eventName, code: ResponseCode.ERROR_IN_PARAMS });
        break;
      }
      case MethodsWallet.GET_WALLET_MANAGER_SIGNATURE: {
        if (request.payload.hexData && !request.payload.data) request.payload.data = request.payload.hexData;
        method = MethodsWallet.GET_WALLET_SIGNATURE;
        isCipherText = false;
        if (!isActive) return this.unauthenticated(eventName);
        callBack = this.handleManagerSignature;
        payload = { data: request.payload.data };
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
      isCipherText,
    });
  };
  protected handleNativeDeviceRequest = async (request: IRequestParams): Promise<IResponseType> => {
    const { eventName, origin } = request;
    const method = request.method;
    if (this.dapp.origin !== origin)
      return generateErrorResponse({
        eventName,
        code: ResponseCode.ERROR_IN_PARAMS,
      });
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
    if (this.isLockDapp) return this.userDenied(request.eventName);
    if (NATIVE_METHOD.includes(request.method)) {
      return this.handleNativeDeviceRequest(request);
    }
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

  public verifySessionInfo = async () => {
    try {
      const rememberMeBlackList = await this.dappManager.getRememberMeBlackList();
      // is remember me black list
      if (checkSiteIsInBlackList(rememberMeBlackList || [], this.dapp.origin)) return false;

      const sessionInfo = await this.dappManager.getSessionInfo(this.dapp.origin);
      const manager = getManager();
      const caHash = getCurrentCaHash();
      if (!manager?.keyPair || !caHash || !sessionInfo) return false;
      const valid = verifySession({
        keyPair: manager.keyPair,
        origin: this.dapp.origin,
        managerAddress: manager.address,
        caHash,
        expiredPlan: sessionInfo.expiredPlan,
        expiredTime: sessionInfo.expiredTime,
        signature: sessionInfo.signature,
      });
      if (!valid) return valid;
      return !hasSessionInfoExpired(sessionInfo);
    } catch (error) {
      return false;
    }
  };

  public setIsLockDapp = (isLockDapp: boolean) => {
    this.isLockDapp = isLockDapp;
  };

  public securityCheck = async (fromChainId: ChainId, originChainId: ChainId) => {
    const caHash = getCurrentCaHash();
    if (!caHash) return false;
    return checkSecuritySafe({
      caHash,
      originChainId,
      accelerateChainId: fromChainId,
    });
  };
  protected checkManagerSyncState = async (chainId: ChainId) => {
    const [caInfo, managerAddress] = await Promise.all([
      this.dappManager.getCaInfo(chainId),
      this.dappManager.currentManagerAddress(),
    ]);
    if (!caInfo?.isSync) {
      const chainInfo = await this.dappManager.getChainInfo(chainId);
      if (!chainInfo?.endPoint || !caInfo?.caHash)
        throw { code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid chain id' };
      const contract = await getContract({
        rpcUrl: chainInfo.endPoint,
        contractAddress: chainInfo.caContractAddress,
      });
      const info = await contract?.callViewMethod('GetHolderInfo', { caHash: caInfo.caHash });
      const { managerInfos }: { managerInfos: { address: string }[] } = info?.data;
      if (managerInfos.some(item => item.address === managerAddress)) {
        this.dappManager.updateManagerSyncState(chainId);
        return true;
      }
    }
    return !!caInfo?.isSync;
  };
}
