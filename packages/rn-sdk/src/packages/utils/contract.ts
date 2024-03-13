import { ChainType } from '@portkey/provider-types';
import {
  ContractProps,
  CallViewMethod,
  CallSendMethod,
  AElfCallViewMethod,
  AElfCallSendMethod,
} from 'packages/contracts/types';
import { handleFunctionName, handleContractError, handleContractParams } from 'packages/contracts/utils';
import { AElfInterface } from 'packages/types/aelf';
import { sleep } from '.';
import { encodedTx } from './aelf';
import { getTxResult } from './aelfUtils';

export class ContractBasic {
  public address?: string;
  public callContract: WB3ContractBasic | AElfContractBasic;
  public chainType: ChainType;
  public rpcUrl: string;
  constructor(options: ContractProps) {
    this.address = options.contractAddress;
    this.rpcUrl = options.rpcUrl;
    const isELF = true;
    // TODO :ethereum
    this.callContract = isELF ? new AElfContractBasic(options) : new WB3ContractBasic();
    this.chainType = isELF ? 'aelf' : 'ethereum';
  }

  public callViewMethod: CallViewMethod = async (
    functionName,
    paramsOption,
    _callOptions = { defaultBlock: 'latest' },
  ) => {
    console.log('callViewMethod', functionName, JSON.stringify(paramsOption), _callOptions);
    if (this.callContract instanceof AElfContractBasic)
      return this.callContract.callViewMethod(functionName, paramsOption);

    // TODO WEB3 Contract
    return { data: '' };
  };

  public callSendMethod: CallSendMethod = async (functionName, _account, paramsOption, sendOptions) => {
    console.log('callSendMethod', functionName, JSON.stringify(paramsOption), sendOptions);
    if (this.callContract instanceof AElfContractBasic)
      return this.callContract.callSendMethod(functionName, paramsOption, sendOptions);

    // TODO WEB3 Contract
    return { data: '' };
  };
  public encodedTx: CallViewMethod = async (functionName, paramsOption) => {
    if (this.callContract instanceof AElfContractBasic) return this.callContract.encodedTx(functionName, paramsOption);

    // TODO WEB3 Contract
    return { data: '' };
  };
  public calculateTransactionFee: CallViewMethod = async (functionName, paramsOption) => {
    if (this.callContract instanceof AElfContractBasic)
      return this.callContract.calculateTransactionFee(functionName, paramsOption);

    // TODO WEB3 Contract
    return { data: '' };
  };
}

export class WB3ContractBasic {}

export class AElfContractBasic {
  public aelfContract: any;
  public address: string;
  public aelfInstance?: AElfInterface;
  constructor(options: ContractProps) {
    const { aelfContract, contractAddress, aelfInstance } = options;
    this.address = contractAddress;
    this.aelfContract = aelfContract;
    this.aelfInstance = aelfInstance;
  }
  public callViewMethod: AElfCallViewMethod = async (functionName, paramsOption) => {
    const contract = this.aelfContract;
    if (!contract) return { error: { code: 401, message: 'Contract init error1' } };
    try {
      const req = await contract[handleFunctionName(functionName)].call(paramsOption);
      if (!req?.error && (req?.result || req?.result === null)) return { data: req.result };
      return { data: req };
    } catch (error) {
      return { error: handleContractError(error) };
    }
  };

  public callSendMethod: AElfCallSendMethod = async (functionName, paramsOption, sendOptions) => {
    if (!this.aelfContract) return { error: { code: 401, message: 'Contract init error' } };

    console.log('paramsOption', paramsOption);

    try {
      const { onMethod = 'receipt' } = sendOptions || {};
      const _functionName = handleFunctionName(functionName);
      const _params = await handleContractParams({
        instance: this.aelfInstance,
        paramsOption,
        functionName: _functionName,
      });
      const req = await this.aelfContract[_functionName](_params);

      const { TransactionId } = req?.result || req;
      if (req?.error) return { error: handleContractError(undefined, req), transactionId: TransactionId };

      // receipt
      if (onMethod === 'receipt') {
        await sleep(1000);
        try {
          const txResult = await getTxResult(this.aelfInstance, TransactionId);

          console.log('txResult', txResult);

          return { data: txResult, transactionId: TransactionId };
        } catch (error) {
          return { error: handleContractError(error, req), transactionId: TransactionId };
        }
      }

      // transactionHash
      return { transactionId: TransactionId };
    } catch (error) {
      return { error: handleContractError(error) };
    }
  };

  public encodedTx: AElfCallViewMethod = async (functionName, paramsOption) => {
    if (!this.aelfContract) return { error: { code: 401, message: 'Contract init error' } };
    if (!this.aelfInstance) return { error: { code: 401, message: 'instance init error' } };

    try {
      const _functionName = handleFunctionName(functionName);
      const _params = await handleContractParams({
        instance: this.aelfInstance,
        paramsOption,
        functionName: _functionName,
      });
      const data = await encodedTx({
        instance: this.aelfInstance,
        contract: this.aelfContract,
        paramsOption: _params,
        functionName: _functionName,
      });
      return { data };
    } catch (error) {
      return { error: handleContractError(error) };
    }
  };
  public calculateTransactionFee: AElfCallViewMethod = async (functionName, paramsOption) => {
    try {
      const { data } = await this.encodedTx(functionName, paramsOption);
      const req = await this.aelfInstance?.chain.calculateTransactionFee(data);
      return { data: req };
    } catch (error) {
      return { error: handleContractError(error) };
    }
  };
}
