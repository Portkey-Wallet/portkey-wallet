import { sleep } from '@portkey-wallet/utils';
import { AElfInterface } from '@portkey-wallet/types/aelf';
import { getTxResult } from './aelfUtils';
import { ChainType } from '@portkey-wallet/types';
import { encodedTx } from '@portkey-wallet/utils/aelf';
type SendOptions = {
  from?: string;
  gasPrice?: string;
  gas?: number;
  value?: number | string;
  nonce?: number;
  onMethod: 'transactionHash' | 'receipt' | 'confirmation';
};

export interface ContractProps {
  contractAddress: string;
  aelfContract?: any;
  aelfInstance?: AElfInterface;
  rpcUrl: string;
}

interface ErrorMsg {
  error: {
    name?: string;
    code: number;
    message: string;
  };
}

type CallViewMethod = (
  functionName: string,
  paramsOption?: any,
  callOptions?: {
    defaultBlock: number | string;
    options?: any;
    callback?: any;
  },
) => Promise<any | ErrorMsg>;

type CallSendMethod = (
  functionName: string,
  account: string,
  paramsOption?: any,
  sendOptions?: SendOptions,
) => Promise<ErrorMsg> | Promise<any>;

export type ContractBasicErrorMsg = ErrorMsg;

export class ContractBasic {
  public address?: string;
  public callContract: WB3ContractBasic | AElfContractBasic;
  public contractType: ChainType;
  public rpcUrl: string;
  constructor(options: ContractProps) {
    this.address = options.contractAddress;
    this.rpcUrl = options.rpcUrl;
    const isELF = true;
    // TODO :ethereum
    this.callContract = isELF ? new AElfContractBasic(options) : new WB3ContractBasic();
    this.contractType = isELF ? 'aelf' : 'ethereum';
  }

  public callViewMethod: CallViewMethod = async (
    functionName,
    paramsOption,
    callOptions = { defaultBlock: 'latest' },
  ) => {
    if (this.callContract instanceof AElfContractBasic)
      return this.callContract.callViewMethod(functionName, paramsOption);
  };

  public callSendMethod: CallSendMethod = async (functionName, account, paramsOption, sendOptions) => {
    if (this.callContract instanceof AElfContractBasic)
      return this.callContract.callSendMethod(functionName, paramsOption, sendOptions);
  };
  public encodedTx: CallViewMethod = async (functionName, paramsOption) => {
    if (this.callContract instanceof AElfContractBasic) return this.callContract.encodedTx(functionName, paramsOption);
  };
}

export class WB3ContractBasic {}

type AElfCallViewMethod = (functionName: string, paramsOption?: any) => Promise<any | ErrorMsg>;

type AElfCallSendMethod = (
  functionName: string,
  paramsOption?: any,
  sendOptions?: SendOptions,
) => Promise<ErrorMsg> | Promise<any>;

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
      const functionNameUpper = functionName.replace(functionName[0], functionName[0].toLocaleUpperCase());
      const req = await contract[functionNameUpper].call(paramsOption);
      if (!req?.error && (req?.result || req?.result === null)) return req.result;
      return req;
    } catch (e: any) {
      if (e?.Error) {
        return {
          error: {
            message: e.Error.Details || e.Error.Message,
            code: e.Error.Code,
          },
        };
      }
      return { error: e };
    }
  };

  public callSendMethod: AElfCallSendMethod = async (functionName, paramsOption, sendOptions) => {
    if (!this.aelfContract) return { error: { code: 401, message: 'Contract init error' } };
    try {
      const { onMethod = 'receipt' } = sendOptions || {};
      const functionNameUpper = functionName.replace(functionName[0], functionName[0].toLocaleUpperCase());
      const req = await this.aelfContract[functionNameUpper](paramsOption);
      if (req.error) {
        return {
          error: {
            code: req.error.message?.Code || req.error,
            message: req.errorMessage?.message || req.error.message?.Message,
          },
        };
      }

      const { TransactionId } = req.result || req;
      if (onMethod === 'receipt') {
        await sleep(1000);
        try {
          return await getTxResult(this.aelfInstance, TransactionId);
        } catch (error: any) {
          if (error.message) return { error };
          return {
            ...error,
            error: {
              code: req?.error?.message?.Code || req?.error,
              message: error.Error || req?.errorMessage?.message || req?.error?.message?.Message,
            },
          };
        }
      }
      return { TransactionId };
    } catch (error: any) {
      if (error.message) return { error };
      return { error: { message: error.Error || error.Status } };
    }
  };

  public encodedTx: AElfCallViewMethod = async (functionName, paramsOption) => {
    if (!this.aelfContract) return { error: { code: 401, message: 'Contract init error' } };
    if (!this.aelfInstance) return { error: { code: 401, message: 'instance init error' } };
    try {
      const raw = await encodedTx({
        instance: this.aelfInstance,
        contract: this.aelfContract,
        functionName,
        paramsOption,
      });
      return raw;
    } catch (e) {
      return { error: e };
    }
  };
}
