export type TChainType = 'aelf' | 'evm';

export interface IBaseEBridgeChainInfo {
  rpcUrl: string;
  bridgeContract: string;
}

export interface IEBridgeELFChainInfo extends IBaseEBridgeChainInfo {
  chainId: string;
  chainType: 'aelf';
}

export interface IEBridgeEVMChainInfo extends IBaseEBridgeChainInfo {
  chainId: number;
  chainType: 'evm';
  limitContract: string;
}

export type IEBridgeChainInfo = IEBridgeELFChainInfo | IEBridgeEVMChainInfo;

export interface TLimitData {
  remain: string;
  maxCapacity: string;
  currentCapacity: string;
  fillRate: string;
  isEnable?: boolean;
}

export type TokenInfo = {
  decimals: number;
  symbol: string;
  address: string;
  name?: string;
  isNativeToken?: boolean;
  issueChainId?: number;
  issuer?: string;
  isBurnable?: boolean;
  totalSupply?: number;
  onlyForm?: boolean;
  onlyTo?: boolean;
};
