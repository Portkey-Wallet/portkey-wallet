import { ChainType } from '@portkey-wallet/types';
import { CallSendMethod, CallViewMethod } from '@portkey-wallet/contracts/types';

import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';

export interface IExtensionContractOption {
  rpcUrl: string;
  contractAddress: string;
  privateKey?: string;
  callContract?: any;
}

export class ExtensionContractBasic extends ContractBasic {
  public address: string;
  public chainType: ChainType;
  public rpcUrl: string;
  public callContract: any;

  public privateKey?: string;

  constructor(options: IExtensionContractOption) {
    super(options as any);
    this.address = options.contractAddress;
    this.rpcUrl = options.rpcUrl;
    this.privateKey = options.privateKey;
    const isELF = true;
    this.chainType = isELF ? 'aelf' : 'ethereum';
  }

  public callViewMethod: CallViewMethod = async (
    functionName,
    paramsOption,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _callOptions = { defaultBlock: 'latest' },
  ) => {
    if (this.chainType === 'aelf') {
      const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callViewMethod, {
        rpcUrl: this.rpcUrl,
        chainType: this.chainType,
        address: this.address,
        methodName: functionName,
        paramsOption,
      });
      if (resMessage.code === SandboxErrorCode.error) throw resMessage.error;
      return { data: resMessage.message };
    }

    // TODO WEB3 Contract
    return { data: '' };
  };

  public callSendMethod: CallSendMethod = async (functionName, _account, paramsOption, sendOptions) => {
    if (this.chainType === 'aelf') {
      if (!this.privateKey) throw Error('The contract callSendMethod method lacks user information');
      const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callSendMethod, {
        rpcUrl: this.rpcUrl,
        chainType: this.chainType,
        address: this.address,
        privateKey: this.privateKey,
        methodName: functionName,
        paramsOption,
        sendOptions,
      });
      if (resMessage.code === SandboxErrorCode.error) throw resMessage.error;
      return { data: resMessage.message };
    }
    // TODO WEB3 Contract
    return { data: '' };
  };

  public encodedTx: CallViewMethod = async (functionName, paramsOption) => {
    if (this.chainType === 'aelf') {
      if (!this.privateKey) throw Error('The contract encodedTx method lacks user information');
      const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.getTransactionRaw, {
        rpcUrl: this.rpcUrl,
        chainType: this.chainType,
        address: this.address,
        privateKey: this.privateKey,
        methodName: functionName,
        paramsOption,
      });
      if (resMessage.code === SandboxErrorCode.error) throw resMessage.error;
      return resMessage.message;
    }
    // TODO WEB3 Contract
    return { data: '' };
  };

  public calculateTransactionFee: CallViewMethod = async (functionName, paramsOption) => {
    if (this.chainType === 'aelf') {
      if (!this.privateKey) throw Error('The contract encodedTx method lacks user information');
      const resMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.getTransactionFee, {
        rpcUrl: this.rpcUrl,
        chainType: this.chainType,
        address: this.address,
        privateKey: this.privateKey,
        methodName: functionName,
        paramsOption,
      });
      if (resMessage.code === SandboxErrorCode.error) throw resMessage.error;
      return { data: { TransactionFee: resMessage.message } };
    }

    // TODO WEB3 Contract
    return { data: '' };
  };
}

// Example

// const contract = new ExtensionContractBasic({
//   rpcUrl: 'rpcUrl',
//   contractAddress: 'contractAddress',
//   privateKey: 'privateKey',
// });

// contract;

// contract.callSendMethod();
// contract.callViewMethod();
// contract.calculateTransactionFee();
// contract.encodedTx();
