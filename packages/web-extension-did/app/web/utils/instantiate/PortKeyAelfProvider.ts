import { ChainFunction, CommonFunType, ContractAtFun, GetChainStateFun, GetChainStatusFun } from '../../types/ChainAPI';
import { AelfMessageTypes, MethodMessageTypes, WalletMessageTypes } from '../../messages/InternalMessageTypes';
import extractArgumentsIntoObject from '../extractArgumentsIntoObject';
import BaseProvider from './BaseProvider';
import AElf from 'aelf-sdk';
import { BaseChainType } from '@portkey-wallet/types/chain';
import errorHandler from 'utils/errorHandler';
import { AElfInstance } from 'types/ChainAPI';
import { getWallet } from '@portkey-wallet/utils/aelf';

interface PortKeyAelfProviderProps {
  httpProvider: string[];
  appName: string;
  pure?: any;
  appLogo?: string;
}

const commonWallet = getWallet();

type RpcUrl = string;
type contractAddress = string;
const aelfInstanceMap: {
  [x: RpcUrl]: AElfInstance;
} = {};

const contractMethodMap: {
  [x: RpcUrl]: {
    [x: contractAddress]: any;
  };
} = {};
// TODO: if return unlock, re call the method.
// Just a wrap of the api of the extension for developers.
export default class PortKeyAelfProvider extends BaseProvider {
  httpProvider?: string[];
  appName?: string;
  chain: ChainFunction;
  appLogo?: string;
  chainId?: string;
  pure?: any;
  isLocked?: boolean;

  constructor(options: PortKeyAelfProviderProps) {
    super({});
    this.httpProvider = options.httpProvider;
    this.appName = options.appName;
    this.appLogo = options.appLogo;
    this.chain = this._chainAPI();
    this.chainId;
    this.pure = options.pure;
    this._getDefaultState();
    this._listenerEvent();
  }

  login = (
    params: {
      rpcUrl?: string;
      chainId: string;
    },
    callback: CommonFunType,
  ): any => {
    return window?.portkey_did
      ?.request({
        method: WalletMessageTypes.CONNECT,
        params: {
          appName: this.appName,
          appLogo: this.appLogo,
          chainId: params.chainId,
          rpcUrl: params.rpcUrl,
        },
      })
      .then((result: any) => {
        if (result.error === 300000) {
          return this.login(params, callback);
        }
        return this._callbackWrap(result, callback);
      });
  };

  getAddress() {
    return window?.portkey_did?.request({
      method: WalletMessageTypes.REQUEST_ACCOUNTS,
    });
  }

  getSignature(param: { address: string; hexToBeSign: string }, callback: CommonFunType) {
    return window?.portkey_did
      ?.request({
        appName: this.appName,
        account: param.address,
        appLogo: this.appLogo,
        hexToBeSign: param.hexToBeSign,
        method: AelfMessageTypes.GET_SIGNATURE,
      })
      .then((result: any) => {
        if (result.error === 300000) {
          return this.getSignature(param, callback);
        }
        return this._callbackWrap(result, callback);
      });
  }

  getVersion = () => {
    return process.env.SDK_VERSION;
  };

  /** @deprecated */
  getExtensionInfo() {
    const result = errorHandler(
      700001,
      "GetExtensionInfo is no longer supported, please use the 'getAddress' method to get it",
    );
    return Promise.reject(result);
  }

  /** @deprecated */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lock(_params: any, callback: (...args: any[]) => void) {
    return this._deprecatedResult('Locking', callback);
  }

  /** @deprecated */
  logout = (...params: any[]): Promise<any> | undefined => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const callback = typeof params.at(-1) === 'function' ? params.at(-1) : () => {};
    return this._deprecatedResult('Logout', callback);
  };

  /** @deprecated */
  // // You should avoid them in new code
  checkPermission(_params: any, callback: (...args: any[]) => void) {
    return this._deprecatedResult('CheckPermission', callback);
  }

  /** @deprecated */
  // // You should avoid them in new code
  setContractPermission(_params: any, callback: CommonFunType) {
    return this._deprecatedResult('CheckPermission', callback);
  }

  /** @deprecated */
  removeContractPermission(_params: any, callback: CommonFunType) {
    return this._deprecatedResult('RemoveContractPermission', callback);
  }

  /** @deprecated */
  removeMethodsWhitelist(_params: any, callback: CommonFunType) {
    return this._deprecatedResult('RemoveMethodsWhitelist', callback);
  }

  private _chainAPI(): any {
    const getChainState: GetChainStateFun = (blockHash, callback) => {
      return this._callAElfChain('getChainState', [blockHash], callback);
    };

    const getBlockHeight = (callback: CommonFunType) => {
      return this._callAElfChain('getBlockHeight', [], callback);
    };

    const getContractFileDescriptorSet = (address: string, callback: CommonFunType) => {
      return this._callAElfChain('getContractFileDescriptorSet', [address], callback);
    };

    const getBlock = (blockHash: string, includeTxs: string, callback: CommonFunType) => {
      return this._callAElfChain('getBlock', [blockHash, includeTxs], callback);
    };
    const getBlockByHeight = (blockHeight: string, includeTxs: string, callback: CommonFunType) => {
      return this._callAElfChain('getBlockByHeight', [blockHeight, includeTxs], callback);
    };

    const getTxResult = (txhash: string, callback: CommonFunType) => {
      return this._callAElfChain('getTxResult', [txhash], callback);
    };

    const getTxResults = (blockHash: string, offset: number, num: number, callback: CommonFunType) => {
      return this._callAElfChain('getTxResults', [blockHash, offset, num], callback);
    };

    const getTransactionPoolStatus = (callback: CommonFunType) => {
      return this._callAElfChain('getTransactionPoolStatus', [], callback);
    };

    const sendTransaction = (rawTx: string, callback: CommonFunType) => {
      return this._callAElfChain('sendTransaction', [rawTx], callback);
    };

    const sendTransactions = (rawTx: string, callback: CommonFunType) => {
      return this._callAElfChain('sendTransactions', [rawTx], callback);
    };

    const callReadOnly = (rawTx: string, callback: CommonFunType) => {
      return this._callAElfChain('callReadOnly', [rawTx], callback);
    };

    const contractAt: ContractAtFun = async (contractAddress, wallet, ...otherArgsArray) => {
      const {
        callback,
        // isSync is forbidden in plugins
      } = extractArgumentsIntoObject(otherArgsArray);
      try {
        const httpProvider = this?.httpProvider?.[0];
        // Not have httpProvider
        if (!httpProvider) {
          const result = errorHandler(
            400001,
            'The current network is not obtained, please refresh the page and try again',
          );
          callback(null, result);
          return result;
        }

        const aelf = this._getAelfInstance(httpProvider);
        const contractAtResult = await aelf.chain.contractAt(contractAddress, commonWallet);
        console.log(contractAtResult, 'contractAtResult===');

        if (!contractAtResult || contractAtResult.error) {
          return this._callbackWrap(contractAtResult, callback);
        }

        if (!contractMethodMap[httpProvider]) contractMethodMap[httpProvider] = {};
        contractMethodMap[httpProvider][contractAddress] = contractAtResult;
        const message = JSON.parse(JSON.stringify(contractAtResult));
        const contractMethods: any = {};
        message.services.map((item: any) => {
          const methods = Object.keys(item.methods);
          methods.map((item: any) => {
            contractMethods[item] = (...params: any[]) => {
              return this._callSendMethod({
                params,
                contractAddress,
                methodName: item,
                httpProvider,
                account: wallet.address,
                requestMethod: AelfMessageTypes.CALL_SEND_CONTRACT,
              });
              // return _callAelfContract(params, 'CALL_AELF_CONTRACT', contractAddress, item);
            };
            contractMethods[item].call = (...params: any[]) => {
              return this._callViewMethod({
                params,
                contractAddress,
                methodName: item,
                httpProvider,
              });
            };
            contractMethods[item].getSignedTx = (...params: any[]) => {
              // return _callAelfContract(params, 'CALL_AELF_CONTRACT_SIGNED_TX', contractAddress, item);
              return this._callSendMethod({
                params,
                contractAddress,
                methodName: item,
                httpProvider,
                account: wallet.address,
                requestMethod: AelfMessageTypes.GET_SEND_CONTRACT_SIGN_TX,
              });
            };
          });
        });

        const result = await window?.portkey_did?.request({
          method: AelfMessageTypes.INIT_AELF_CONTRACT,
          params: {
            appName: this.appName,
            chainId: this.chainId,
            rpcUrl: httpProvider,
            account: wallet.address,
            // contractName: 'EXTENSION',
            contractName: contractAddress || 'EXTENSION',
            contractAddress: contractAddress,
          },
        });

        if (!result) return this._callbackWrap(errorHandler(500001), callback);
        if (result.error === 300000) return contractAt(contractAddress, wallet, ...otherArgsArray);
        if (result.error) return this._callbackWrap(result, callback);
        callback(null, contractMethods);
        return contractMethods;
      } catch (error) {
        if (!error) {
          this._callbackWrap(errorHandler(200017), callback);
          return;
        }
        this._callbackWrap(error, callback);
      }
    };

    // Benchmarking JS SDK output
    return {
      getChainStatus: this._getChainStatus,
      getChainState,
      getContractFileDescriptorSet,
      getBlockHeight,
      getBlock,
      getBlockByHeight,
      callReadOnly,
      getTxResult,
      getTxResults,
      getTransactionPoolStatus,
      sendTransaction,
      sendTransactions,
      // // contractAtAsync,
      contractAt,
    };
  }

  private _getAelfInstance = (httpProvider: string) => {
    if (!aelfInstanceMap[httpProvider]) {
      aelfInstanceMap[httpProvider] = new AElf(new AElf.providers.HttpProvider(httpProvider));
    }
    return aelfInstanceMap[httpProvider];
  };

  private _callAElfChain = (methodName: keyof AElfInstance['chain'], params: any[], callback?: CommonFunType) => {
    let result;
    const httpProvider = this?.httpProvider?.[0];
    // Not have httpProvider
    if (!httpProvider) {
      result = errorHandler(400001, 'The current network is not obtained, please refresh the page and try again');
      return this._callbackWrap(result, callback);
    }
    // TODO when lock
    if (methodName === 'sendTransaction' || methodName === 'sendTransactions') {
      return this._callbackWrap(errorHandler(410001), callback);
    }

    const aelf = this._getAelfInstance(httpProvider);

    const resultCallback = (error: any, result: any) => {
      console.log(result, 'resultCallback');
      if (error || result.error) {
        return this._callbackWrap(errorHandler(700001, error || result.error), callback);
      } else {
        return this._callbackWrap(
          {
            ...errorHandler(0),
            data: result,
          },
          callback,
        );
      }
    };

    try {
      if (methodName === 'chainId') throw 'methodName error';
      return aelf.chain[methodName](...params, resultCallback);
    } catch (error) {
      return this._callbackWrap(errorHandler(100001, error), callback);
    }
  };

  private _getChainStatus: GetChainStatusFun = async (callback) => {
    return this._callAElfChain('getChainStatus', [], callback);
  };

  private _formatParams(params: any[]) {
    const paramsTemp = Array.from(params); // [...params];

    const filterParams = paramsTemp.filter(function (arg) {
      return !(typeof arg === 'function') && !(typeof arg === 'boolean');
    });

    const { callback } = extractArgumentsIntoObject(paramsTemp);
    return {
      filterParams,
      callback,
    };
  }

  private _callSendMethod = async ({
    params,
    contractAddress,
    methodName,
    httpProvider,
    account,
    requestMethod = AelfMessageTypes.CALL_SEND_CONTRACT,
  }: {
    params: any[];
    contractAddress: string;
    methodName: string;
    account: string;
    httpProvider: string;
    requestMethod: string;
  }): Promise<any> => {
    const { filterParams, callback } = this._formatParams(params);
    try {
      if (!contractMethodMap[httpProvider]?.[contractAddress]) return errorHandler(700001, 'Could not find contract');
      const contract = contractMethodMap[httpProvider]?.[contractAddress];
      if (!contract[methodName]) return errorHandler(400001, `Method ${methodName} is not exist in the contract.`);
      const result = await window.portkey_did?.request({
        method: requestMethod,
        params: {
          appName: this.appName,
          chainId: this.chainId,
          rpcUrl: httpProvider,
          account,
          contractName: contractAddress || 'From Extension',
          contractAddress: contractAddress,
          method: methodName,
          params: filterParams,
        },
      });

      if (result.error === 300000)
        return this._callSendMethod({
          params,
          contractAddress,
          account,
          methodName,
          httpProvider,
          requestMethod,
        });
      return result as any;
      // const result = await contract[methodName](...filterParams);
      // console.log(result, 'result==');
      // return this._callbackWrap(result, callback);
    } catch (error) {
      return this._callbackWrap(errorHandler(100001, error), callback);
    }
  };

  private _callViewMethod = async ({
    params,
    contractAddress,
    methodName,
    httpProvider,
  }: {
    params: any[];
    contractAddress: string;
    methodName: string;
    httpProvider: string;
  }) => {
    const { filterParams, callback } = this._formatParams(params);
    try {
      if (!contractMethodMap[httpProvider]?.[contractAddress]) return errorHandler(700001, 'Could not find contract');
      const contract = contractMethodMap[httpProvider]?.[contractAddress];

      if (!contract[methodName]) return errorHandler(400001, `Method ${methodName} is not exist in the contract.`);
      const result = await contract[methodName].call(...filterParams);
      console.log(result, 'result==');
      return this._callbackWrap(result, callback);
    } catch (error) {
      return this._callbackWrap(errorHandler(100001, error), callback);
    }
  };

  private _listenerEvent = () => {
    window.portkey_did?.on('chainChanged', this._chainChanged);
    window.portkey_did?.on('lockStateChanged', this._lockStateChanged);
    // window.portkey_did?.on('accountsChanged', this._accountsChanged);
  };
  // get default state eq: httpProvider ...
  private _getDefaultState = async () => {
    const result = await window?.portkey_did?.request({
      method: MethodMessageTypes.GET_WALLET_STATE,
    });
    if (result?.data && result?.data?.chain) {
      this.httpProvider = [result.data.chain?.rpcUrl];
      this.chainId = result.data.chain?.chainId;
    }
    this.isLocked = result?.data?.isLocked;
  };

  private _chainChanged = (...args: any[]) => {
    const data = args[0] as BaseChainType;
    this.chainId = data.chainId as string;
    this.httpProvider = [data.rpcUrl];
    console.log('chainChanged', this.httpProvider);
  };

  private _lockStateChanged = (message: any) => {
    this.isLocked = message?.isLocked;
    console.log(message, 'lockStateChanged=');
  };

  private _callbackWrap = (result: any, callback?: (...arg: any[]) => void) => {
    if (result.result && 'error' in result.result && 'message' in result.result) {
      if (this.pure && result.result.result) {
        callback?.(null, result.result.result);
        return result.result.result;
      }
      callback?.(null, result.result);
      return result.result;
    }
    if (this.pure && result.result && 'error' in result) {
      callback?.(null, result.result);
      return result.result;
    }
    if (result.Error) {
      const err = {
        ...errorHandler(700002, result),
        data: result,
      };
      callback?.(null, err);
      return err;
    }
    callback?.(null, result);
    return result;
  };

  private _deprecatedResult(errorFunctionName: string, callback: (...args: any[]) => void) {
    const result = errorHandler(700001, `${errorFunctionName} is not supported`);
    callback(result);
    return Promise.reject(result);
  }
}
