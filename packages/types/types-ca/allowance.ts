import { ChainId } from '..';

export interface ITokenAllowance {
  chainId: ChainId;
  contractAddress: string;
  url?: string; // dapp url
  icon?: string; // dapp icon
  name?: string; // dapp name
  allowance: number;
}
