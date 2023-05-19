import BaseProvider from '../base/BaseProvider';
import { DappRequestResponse } from '../base/Request';

/**
 * `IChain` Contract provides an easier way to interact with the provider.
 * Actually, those methods provide service by calling the provider's ```request()``` method
 */
export default interface Contract extends ContractBehaviour {
  provider: BaseProvider;
  type: ContractType;
  chainId: string;
}

export interface ContractBehaviour {
  callViewMethod: (method: string, params: any) => Promise<DappRequestResponse>;
  callSendMethod: (method: string, params: any) => Promise<DappRequestResponse>;
  encodedTx: (transactionData: any) => Promise<DappRequestResponse>;
}

export type ContractType = 'aelf' | 'ethereum';

export enum ContractMethods {
  VIEW = 'view',
}
