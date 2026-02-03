import SandboxEventTypes from 'messages/SandboxEventTypes';
import { getAelfInstance, getWallet } from '@portkey-wallet/utils/aelf';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';
import { ChainType } from '@portkey-wallet/types';
import { TokenItemType } from '@portkey-wallet/types/types-ca/token';
import { customFetch } from '@portkey-wallet/utils/fetch';
import { getContractBasic, getTxResult } from '@portkey-wallet/contracts/utils';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import UISdkSandboxEventTypes from 'messages/UISdkSandboxEventTypes';
// [DEPRECATED-ETRANSFER] BEGIN - ETransfer imports removed
// import { ICrossTransferInitOption, IWithdrawParams } from '@portkey-wallet/utils/withdrawEOA/types';
// import CrossTransfer from '@portkey-wallet/utils/withdrawEOA';
// [DEPRECATED-ETRANSFER] END
import { IStorageSuite } from '@portkey/types';
import AElf from 'aelf-sdk';
import { handleErrorMessage } from '@portkey/did-ui-react';
import { getRawParams } from '@portkey-wallet/utils/dapp/decodeTx';
import { EBridge, TEBridgeOptions } from '@portkey-wallet/utils/eBridgeEOA';
import { ICreateReceiptParams } from '@portkey-wallet/utils/eBridge/types/bridge';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';
import { aelf } from '@portkey/utils';
import { isTransferAmountExceeded } from 'utils/errorHandler';
import { TransactionError } from '@portkey-wallet/constants/constants-ca/send';
import { TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';
const localStore: Record<string, string> = {};

export class BaseAsyncStorage implements IStorageSuite {
  public async getItem(key: string) {
    return localStore[key];
  }
  public async setItem(key: string, value: string) {
    return (localStore[key] = value);
  }
  public async removeItem(key: string) {
    return delete localStore[key];
  }
}

// [DEPRECATED-ETRANSFER] asyncStorage was used by ETransfer, now deprecated
// const asyncStorage = new BaseAsyncStorage();

interface useBalancesProps {
  tokens: TokenItemType | TokenItemType[];
  rpcUrl: string;
  delay?: number;
  account?: string;
  chainType?: ChainType;
  sid: string;
}

type SendBack = (
  event: MessageEvent<any>,
  response?: {
    code: SandboxErrorCode;
    message?: any;
    sid: string;
    error?: any;
  },
) => void;
type RpcUrl = string;
type ContractAddress = string;
type FromAccountPrivateKey = string;
const contracts: Record<RpcUrl, Record<ContractAddress, ContractBasic>> = {};
const accountContracts: Record<RpcUrl, Record<FromAccountPrivateKey, Record<ContractAddress, ContractBasic>>> = {};

class SandboxUtil {
  constructor() {
    this.listener();
  }

  static callback(
    event: MessageEvent<any>,
    response?: {
      code: SandboxErrorCode;
      message?: any;
      sid: string;
    },
  ) {
    SandboxEventService.dispatchToOrigin(event, response);
  }

  listener() {
    window.addEventListener('message', async function (event) {
      console.log(event, 'event===');
      switch (event.data.event) {
        case SandboxEventTypes.getBalances:
          SandboxUtil.getBalances(event, SandboxUtil.callback);
          break;
        case SandboxEventTypes.callViewMethod:
        case UISdkSandboxEventTypes.callViewMethod:
          SandboxUtil.callViewMethod(event, SandboxUtil.callback);
          break;
        case SandboxEventTypes.callSendMethod:
        case UISdkSandboxEventTypes.callSendMethod:
          SandboxUtil.callSendMethod(event, SandboxUtil.callback);
          break;
        case SandboxEventTypes.getTransactionFee:
          SandboxUtil.getTransactionFee(event, SandboxUtil.callback);
          break;
        case SandboxEventTypes.initViewContract:
          SandboxUtil.initViewContract(event, SandboxUtil.callback);
          break;
        case SandboxEventTypes.getTransactionRaw:
          SandboxUtil.getTransactionRaw(event, SandboxUtil.callback);
          break;
        // [DEPRECATED-ETRANSFER] BEGIN - etransferCrossTransfer case removed
        // case SandboxEventTypes.etransferCrossTransfer:
        //   SandboxUtil.etransferCrossTransfer(event, SandboxUtil.callback);
        //   break;
        // [DEPRECATED-ETRANSFER] END
        case SandboxEventTypes.eBridgeCrossTransfer:
          SandboxUtil.eBridgeCrossTransfer(event, SandboxUtil.callback);
          break;
        case SandboxEventTypes.eBridgeCrossTransferLimit:
          SandboxUtil.eBridgeCrossTransferLimit(event, SandboxUtil.callback);
          break;
        case SandboxEventTypes.eBridgeCrossTransferELFFee:
          SandboxUtil.eBridgeCrossTransferELFFee(event, SandboxUtil.callback);
          break;
        case SandboxEventTypes.getDecodedTxData:
          SandboxUtil.getDecodedTxData(event, SandboxUtil.callback);
          break;

        default:
          break;
      }
    });
  }

  static async initViewContract(event: MessageEvent<any>, callback: SendBack) {
    const data = event.data.data ?? {};
    try {
      const { rpcUrl, address, chainType } = data;
      // TODO only support aelf
      if (chainType !== 'aelf') {
        return callback(event, {
          code: SandboxErrorCode.error,
          message: 'Not support',
          sid: data.sid,
        });
      }
      const contract = await SandboxUtil._getELFViewContract(rpcUrl, address);
      console.log(contract, 'initViewContract');
    } catch (error) {
      console.log(error, 'initViewContract===error');
    }
  }

  static async getBalances(event: MessageEvent<any>, callback: SendBack) {
    const data: useBalancesProps = event.data.data;
    const sid = data.sid;
    if (!data.rpcUrl || !data.tokens) return;
    let tokensList: string[] = [];
    let tokenAddress = '';
    if (Array.isArray(data.tokens)) {
      tokensList = data.tokens.map((item) => item.symbol);
      tokenAddress = data.tokens[0].address;
    } else {
      tokensList = [data.tokens.symbol];
      tokenAddress = data.tokens.address;
    }
    if (!data?.account)
      return callback(event, {
        code: SandboxErrorCode.success,
        message: tokensList.map(() => '0'),
        sid,
      });
    let promise;

    if (data.chainType === 'aelf') {
      // elf chain
      promise = tokensList.map(async (symbol) => {
        // if (symbol) return getELFChainBalance(tokenContract, symbol, data.account ?? '');
        if (symbol) {
          const contract = await SandboxUtil._getELFViewContract(data.rpcUrl, tokenAddress);
          const result = await contract.callViewMethod('GetBalance', {
            symbol,
            owner: data.account,
          });
          return result.data?.balance ?? result?.data?.amount ?? 0;
        }
      });
    } else if (data.chainType === 'ethereum') {
      return callback(event, {
        message: 'Not Support',
        code: SandboxErrorCode.error,
        sid,
      });
      // erc20 chain
      // promise = tokensList.map(i => {
      //   if (i && library) return getBalance(library, i, account);
      // });
      // const web3 = new Web3(new Web3.providers.HttpProvider('https://iotexrpc.com'));
      // const data = await web3.eth.getBalance('0x51a441bbFD263F7a192e0A071b1269c5c38F4836');
      // console.log(data, 'Web3==data==');
    } else {
      // other not support
      return callback(event, {
        message: 'Not Support',
        code: SandboxErrorCode.error,
        sid,
      });
    }
    if (!promise) throw Error('Something error');
    const bs = await Promise.all(promise);
    callback(event, {
      code: SandboxErrorCode.success,
      message: bs,
      sid,
    });
  }

  static async _getELFViewContract(rpcUrl: string, address: string, privateKey?: string) {
    let _contract = contracts?.[rpcUrl]?.[address];
    if (!_contract) {
      _contract = await getContractBasic({
        contractAddress: address,
        account: getWallet(privateKey),
        rpcUrl,
      });
      if (!contracts?.[rpcUrl]) contracts[rpcUrl] = {};
      contracts[rpcUrl][address] = _contract;
    }
    return _contract;
  }

  static async _getELFSendContract(rpcUrl: string, address: string, privateKey: string) {
    let _contract = accountContracts?.[rpcUrl]?.[privateKey]?.[address];
    if (!_contract) {
      _contract = await getContractBasic({
        contractAddress: address,
        account: getWallet(privateKey),
        rpcUrl,
      });
      if (!accountContracts?.[rpcUrl]) accountContracts[rpcUrl] = {};
      if (!accountContracts?.[rpcUrl]?.[privateKey]) accountContracts[rpcUrl][privateKey] = {};
      accountContracts[rpcUrl][privateKey][address] = _contract;
    }
    console.log(_contract, '_getELFSendContract');

    return _contract;
  }

  static async callViewMethod(event: MessageEvent<any>, callback: SendBack) {
    const data = event.data.data ?? {};
    try {
      const { rpcUrl, address, methodName, paramsOption = '', chainType } = data;
      if (!rpcUrl || !address || !methodName)
        return callback(event, {
          code: SandboxErrorCode.error,
          message: 'Invalid argument',
          sid: data.sid,
        });
      // TODO only support aelf
      if (chainType !== 'aelf') {
        return callback(event, {
          code: SandboxErrorCode.error,
          message: 'Not support',
          sid: data.sid,
        });
      }
      const contract = await SandboxUtil._getELFViewContract(rpcUrl, address);
      const result = await contract?.callViewMethod(methodName, paramsOption);
      if (result.error)
        return callback(event, {
          code: SandboxErrorCode.error,
          error: result.error,
          sid: data.sid,
        });
      console.log(result, 'callViewMethod');
      callback(event, {
        code: SandboxErrorCode.success,
        message: result.data,
        sid: data.sid,
      });
    } catch (error: any) {
      console.log(error, 'error===callViewMethod');
      callback(event, {
        code: SandboxErrorCode.error,
        message: error?.error || error,
        sid: data.sid,
      });
    }
  }

  static async callSendMethod(event: MessageEvent<any>, callback: SendBack) {
    const data = event.data.data ?? {};

    try {
      const { rpcUrl, address, methodName, privateKey, paramsOption, chainType, sendOptions } = data;
      console.log(data, 'sendHandler=data');
      if (!rpcUrl || !address || !methodName)
        return callback(event, {
          code: SandboxErrorCode.error,
          message: 'Invalid argument',
          sid: data.sid,
        });
      // TODO only support aelf
      if (chainType !== 'aelf') {
        return callback(event, {
          code: SandboxErrorCode.error,
          message: 'Not support',
          sid: data.sid,
        });
      }
      const account = getWallet(privateKey);
      const contract = await SandboxUtil._getELFSendContract(rpcUrl, address, privateKey);

      const contractMethod = contract?.callSendMethod;
      const req = await contractMethod?.(methodName, account, paramsOption, sendOptions);
      console.log(req, 'req===callSendMethod');
      if (req?.error)
        return callback(event, {
          code: SandboxErrorCode.error,
          message: req.error?.message,
          sid: data.sid,
          error: req.error,
        });
      return callback(event, {
        code: SandboxErrorCode.success,
        message: req?.data || req,
        sid: data.sid,
      });
    } catch (e: any) {
      callback(event, {
        code: SandboxErrorCode.error,
        message: e?.message ?? e.Error ?? e.Status,
        sid: data.sid,
      });
    }
  }

  static async getTransactionFee(event: MessageEvent<any>, callback: SendBack) {
    const data = event.data.data ?? {};
    try {
      const { rpcUrl, address, paramsOption, chainType, methodName, privateKey } = data;
      // TODO only support aelf
      if (chainType !== 'aelf') throw 'Not support';
      const aelfContract = await SandboxUtil._getELFSendContract(rpcUrl, address, privateKey);
      const raw = await aelfContract.encodedTx(methodName, paramsOption);
      if (raw.error) throw raw.error;
      const transaction = await customFetch(`${rpcUrl}/api/blockChain/calculateTransactionFee`, {
        method: 'POST',
        params: {
          RawTransaction: raw.data,
        },
      });
      if (!transaction?.Success) {
        if (isTransferAmountExceeded(transaction.Error)) {
          throw TransactionError.TRANSFER_AMOUNT_EXCEEDED;
        }
        throw 'Transaction failed';
      }
      callback(event, {
        code: SandboxErrorCode.success,
        message: transaction,
        sid: data.sid,
      });
    } catch (e) {
      return callback(event, {
        code: SandboxErrorCode.error,
        error: e,
        sid: data.sid,
      });
    }
  }

  static async getDecodedTxData(event: MessageEvent<any>, callback: SendBack) {
    const data = event.data.data ?? {};
    try {
      const instance = new AElf(new AElf.providers.HttpProvider(data.chainInfo?.endPoint));
      const res = await getRawParams(instance, data.raw);

      callback(event, {
        code: SandboxErrorCode.success,
        message: res,
        sid: data.sid,
      });
    } catch (e) {
      return callback(event, {
        code: SandboxErrorCode.error,
        message: e,
        sid: data.sid,
      });
    }
  }

  static async getTransactionRaw(event: MessageEvent<any>, callback: SendBack) {
    const data = event.data.data ?? {};
    try {
      const { rpcUrl, address, paramsOption, chainType, methodName, privateKey } = data;
      if (chainType !== 'aelf') throw 'Not support';
      const aelfContract = await SandboxUtil._getELFSendContract(rpcUrl, address, privateKey);
      const raw = await aelfContract.encodedTx(methodName, paramsOption);
      callback(event, {
        code: SandboxErrorCode.success,
        message: raw,
        sid: data.sid,
      });
    } catch (e) {
      return callback(event, {
        code: SandboxErrorCode.error,
        message: e,
        sid: data.sid,
      });
    }
  }

  // [DEPRECATED-ETRANSFER] BEGIN - etransferCrossTransfer method deprecated
  // static async etransferCrossTransfer(event: MessageEvent<any>, callback: SendBack) {
  //   const data = event.data.data ?? {};
  //   try {
  //     const { options: _options, params: _params, chainType } = data;
  //     if (chainType !== 'aelf') throw 'Not support';
  //     const options: Omit<ICrossTransferInitOption, 'storage'> = JSON.parse(_options);
  //     const params: Omit<IWithdrawParams, 'tokenContract' | 'portkeyContract'> = JSON.parse(_params);
  //     console.log(data, 'etransferCrossTransfer===', options, params);
  //     const crossTransfer = new CrossTransfer();
  //     crossTransfer.init({ ...options, storage: asyncStorage });
  //     const chainInfo = options.chainList.find((chain) => chain.chainId === params.chainId);
  //     const rpcUrl = chainInfo?.endPoint;
  //     if (!rpcUrl) throw 'Can not get rpcUrl';
  //     const privateKey = AElf.wallet.AESDecrypt(options.account.AESEncryptPrivateKey, options.pin);
  //     const tokenContract = await SandboxUtil._getELFSendContract(
  //       rpcUrl,
  //       chainInfo.defaultToken.address || '',
  //       privateKey,
  //     );
  //     const result = await crossTransfer.withdraw({ ...params, tokenContract });
  //     if (!result?.transactionId) throw 'Transfer error';
  //     const aelf = getAelfInstance(rpcUrl);
  //     const txResult = await getTxResult(aelf, result.transactionId);
  //     console.log(txResult, 'txResult===etransferCrossTransfer');
  //     return callback(event, {
  //       code: SandboxErrorCode.success,
  //       message: result,
  //       sid: data.sid,
  //     });
  //   } catch (e) {
  //     console.log(e, 'etransferCrossTransfer==error');
  //     const message = handleErrorMessage(e, 'Transfer error');
  //     console.log(message, 'message==etransferCrossTransfer');
  //     return callback(event, {
  //       code: SandboxErrorCode.error,
  //       message,
  //       sid: data.sid,
  //     });
  //   }
  // }
  // [DEPRECATED-ETRANSFER] END

  static async eBridgeCrossTransfer(event: MessageEvent<any>, callback: SendBack) {
    const data = event.data.data ?? {};
    try {
      const {
        options: _options,
        params: _params,
        pin,
        walletInfo: _walletInfo,
        chainInfo: _chainInfo,
        chainType,
      } = data;
      if (chainType !== 'aelf') throw 'Not support';
      const options: TEBridgeOptions = JSON.parse(_options);
      const chainInfo: IChainItemType = JSON.parse(_chainInfo);
      const walletInfo: TAccountInfo = JSON.parse(_walletInfo);
      const privateKey = AElf.wallet.AESDecrypt(walletInfo.AESEncryptPrivateKey, pin);
      const params: Omit<ICreateReceiptParams, 'tokenContract' | 'portkeyContract'> = JSON.parse(_params);
      console.log(data, 'eBridgeCrossTransfer===', options, params, walletInfo);
      const eBridgeTransfer = new EBridge({ ...options, wallet: aelf.getWallet(privateKey) });
      const rpcUrl = chainInfo?.endPoint;
      if (!rpcUrl) throw 'Can not get rpcUrl';
      const tokenContract = await SandboxUtil._getELFSendContract(
        rpcUrl,
        chainInfo.defaultToken.address || '',
        privateKey,
      );

      console.log(
        {
          ...params,
          tokenContract: tokenContract as any,
          account: walletInfo.address,
        },
        'eBridgeCrossTransfer===createReceipt-params',
      );

      const result = await eBridgeTransfer.createReceipt({
        ...params,
        tokenContract: tokenContract as any,
        account: walletInfo.address,
      });
      if (!result?.transactionId) throw 'Transfer error';
      const _aelf = getAelfInstance(rpcUrl);

      const txResult = await getTxResult(_aelf, result.transactionId);
      console.log(txResult, 'txResult===eBridgeCrossTransfer');

      return callback(event, {
        code: SandboxErrorCode.success,
        message: result,
        sid: data.sid,
      });
    } catch (e) {
      console.log(e, 'eBridgeCrossTransfer==error');
      const message = handleErrorMessage(e, 'Transfer error');
      console.log(message, 'message==eBridgeCrossTransfer');
      return callback(event, {
        code: SandboxErrorCode.error,
        message,
        sid: data.sid,
      });
    }
  }

  static async eBridgeCrossTransferLimit(event: MessageEvent<any>, callback: SendBack) {
    const data = event.data.data ?? {};
    try {
      const { options: _options, chainType } = data;
      console.log(data, 'eBridgeCrossTransfer===', _options);
      if (chainType !== 'aelf') throw 'Not support';
      const options: TEBridgeOptions = JSON.parse(_options);
      const eBridgeTransfer = new EBridge(options);
      const result = await eBridgeTransfer.getLimit();
      console.log(result, 'eBridgeCrossTransfer========result');

      // if (!result?.transactionId) throw 'Transfer error';
      // const _aelf = getAelfInstance(rpcUrl);

      // const txResult = await getTxResult(_aelf, result.transactionId);
      // console.log(txResult, 'txResult===eBridgeCrossTransfer');

      return callback(event, {
        code: SandboxErrorCode.success,
        message: result,
        sid: data.sid,
      });
    } catch (e) {
      console.log(e, 'eBridgeCrossTransfer==error');
      const message = handleErrorMessage(e, 'Transfer error');
      console.log(message, 'message==eBridgeCrossTransfer');
      return callback(event, {
        code: SandboxErrorCode.error,
        message,
        sid: data.sid,
      });
    }
  }

  static async eBridgeCrossTransferELFFee(event: MessageEvent<any>, callback: SendBack) {
    const data = event.data.data ?? {};
    try {
      const { options: _options, chainType } = data;
      console.log(data, 'eBridgeCrossTransfer===', _options);
      if (chainType !== 'aelf') throw 'Not support';
      const options: TEBridgeOptions = JSON.parse(_options);
      const eBridgeTransfer = new EBridge(options);
      const result = await eBridgeTransfer.getELFFee();
      // if (!result?.transactionId) throw 'Transfer error';
      // const _aelf = getAelfInstance(rpcUrl);

      // const txResult = await getTxResult(_aelf, result.transactionId);
      // console.log(txResult, 'txResult===eBridgeCrossTransfer');

      return callback(event, {
        code: SandboxErrorCode.success,
        message: result,
        sid: data.sid,
      });
    } catch (e) {
      console.log(e, 'eBridgeCrossTransfer==error');
      const message = handleErrorMessage(e, 'Transfer error');
      console.log(message, 'message==eBridgeCrossTransfer');
      return callback(event, {
        code: SandboxErrorCode.error,
        message,
        sid: data.sid,
      });
    }
  }
}

new SandboxUtil();
