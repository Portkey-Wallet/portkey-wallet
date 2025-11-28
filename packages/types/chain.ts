import type { ChainType, NetworkType, UpdateType } from './index';
import { BaseToken as EOABaseToken } from './types-eoa/token';
import { BaseToken as CABaseToken } from './types-ca/token';

export type BasicContracts = {
  tokenContract: string;
};

export interface BaseChainType {
  chainId: string | number; // ELF: string; ethereum: number;
  networkType?: NetworkType; // Optional differentiated mainnet testnet
  chainType: ChainType;
  rpcUrl: string;
  blockExplorerURL?: string;
  // ethereum
  nativeCurrency: EOABaseToken | CABaseToken | undefined;
  // contract set
  basicContracts?: BasicContracts;
}

export interface IChainType extends BaseChainType {
  key?: string; // `${rpcUrl}&${networkName}`;
  networkName: string;
  id?: number;
  iconUrl?: string;
}

export interface ChainItemType extends IChainType {
  isCustom?: boolean;
  isCommon: boolean | undefined;
  isFixed?: boolean;
}

export type UpdateChainListType = { chain: ChainItemType; type: UpdateType };

export type ChainChangeHandler = (v: ChainItemType) => void;
