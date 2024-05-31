import { ChainId } from '..';

export interface ISymbolApprovedItem {
  symbol: string;
  amount: number;
  decimals: number;
}

export interface ITokenAllowance {
  chainId: ChainId;
  contractAddress: string;
  url?: string; // dapp url
  icon?: string; // dapp icon
  name?: string; // dapp name
  symbolApproveList?: ISymbolApprovedItem[];
}
