import { SendOptions } from '@portkey-wallet/contracts/types';
import { ChainType } from '@portkey-wallet/types';

export interface BaseSendOption {
  rpcUrl: string;
  address: string;
  chainType: ChainType;
  privateKey: string;
  sendOptions?: SendOptions;
}
