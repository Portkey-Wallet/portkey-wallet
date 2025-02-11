import { ZERO } from '@portkey-wallet/constants/misc';
import type { Contract } from 'web3-eth-contract';
import Web3 from 'web3';
import { ErrorMsg, SendOptions } from '@portkey/types';

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

type WB3ContractBasicOptions = {
  contract: Contract;
  web3: Web3;
};
export class WB3ContractBasic {
  public contract: Contract | null;
  public contractForView: Contract;
  public web3?: Web3;
  constructor(options: WB3ContractBasicOptions) {
    const { contract, web3 } = options;
    this.web3 = web3;
    this.contract = contract;
    this.contractForView = contract;
  }

  public callViewMethod: CallViewMethod = async (
    functionName,
    paramsOption,
    callOptions = { defaultBlock: 'latest' },
  ) => {
    try {
      const { defaultBlock, options } = callOptions;
      const contract = this.contractForView;
      contract.defaultBlock = defaultBlock;

      const result = await contract.methods[functionName](...(paramsOption || [])).call(options);
      return { data: result };
    } catch (e) {
      return { error: e };
    }
  };

  public callSendMethod: CallSendMethod = async (functionName, account, paramsOption, sendOptions) => {
    if (!this.contract) return { error: { code: 401, message: 'Contract init error4' } };
    try {
      const contract = this.contract;
      const { onMethod = 'receipt', ...options } = sendOptions || {};

      try {
        const gasPrice = (await this.web3?.eth.getGasPrice()) || '10000000000';
        (options as any).gasPrice = ZERO.plus(gasPrice).times(1.15).toFixed(0);
      } catch (error) {
        console.log(error);
      }

      const result: any = await new Promise((resolve, reject) =>
        contract.methods[functionName](...(paramsOption || []))
          .send({ from: account, ...options })
          .on(onMethod, resolve)
          .on('error', reject),
      );

      if (onMethod === 'receipt') return { data: { ...result }, TransactionId: result.transactionHash };
      return { TransactionId: result };
    } catch (error) {
      return { error };
    }
  };

  public callSendPromiseMethod: CallSendMethod = async (functionName, account, paramsOption, sendOptions) => {
    if (!this.contract) return { error: { code: 401, message: 'Contract init error5' } };
    try {
      const contract = this.contract;

      return contract.methods[functionName](...(paramsOption || [])).send({
        from: account,
        ...sendOptions,
      });
    } catch (e) {
      return { error: e };
    }
  };
}
