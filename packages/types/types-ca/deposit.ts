import { ChainId } from '@portkey/provider-types';

export enum BusinessType {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
}

export type TGetTokenListRequest = {
  type: BusinessType;
  chainId: ChainId;
};

export type TGetTokenListByNetworkRequest = TGetTokenListRequest & {
  network: string;
};

export type TGetTokenListResult = {
  tokenList: TTokenItem[];
};

export type TTokenItem = {
  name: string;
  symbol: string;
  icon: string;
  contractAddress?: string;
  decimals?: number;
};

export type TGetDepositTokenListRequest = {
  type: BusinessType;
};

export type TGetDepositTokenListResult = {
  tokenList: TDepositTokenItem[];
};

export type TDepositTokenItem = TTokenItem & {
  toTokenList?: TToTokenItem[];
};

export type TToTokenItem = TTokenItem & {
  chainIdList?: ChainId[];
};

export type TGetNetworkListRequest = {
  type: BusinessType;
  chainId: ChainId;
  symbol?: string;
  address?: string;
};

export type TGetNetworkListResult = {
  networkList: TNetworkItem[];
};

export type TNetworkItem = {
  network: string;
  name: string;
  multiConfirm: string;
  multiConfirmTime: string;
  contractAddress: string;
  explorerUrl: string;
  status: NetworkStatus;
  withdrawFee?: string;
  withdrawFeeUnit?: string;
};

export enum NetworkStatus {
  Health = 'Health',
  Congesting = 'Congesting',
  Offline = 'Offline',
}

export type TGetDepositInfoRequest = {
  chainId: ChainId;
  network: string;
  symbol?: string;
  toSymbol?: string;
};

export type TGetDepositInfoResult = {
  depositInfo: TDepositInfo;
};

export type TDepositInfo = {
  depositAddress: string;
  minAmount: string;
  extraNotes?: string[];
  minAmountUsd: string;
  extraInfo?: TDepositExtraInfo;
};

export type TDepositExtraInfo = {
  slippage: string;
};

export type TGetDepositCalculateRequest = {
  toChainId: ChainId;
  fromSymbol: string;
  toSymbol: string;
  fromAmount: string;
};

export type TGetDepositCalculateResult = {
  conversionRate: TConversionRate;
};

export type TConversionRate = {
  fromSymbol: string;
  toSymbol: string;
  fromAmount: number;
  toAmount: number;
  minimumReceiveAmount: number;
};

export type TQueryTransferAuthTokenRequest = {
  pubkey: string;
  signature: string;
  plain_text: string;
  ca_hash: string;
  chain_id: string;
  managerAddress: string;
};

export interface IDepositService {
  getTokenList(params: TGetTokenListRequest): Promise<TTokenItem[]>;
  getTransferToken(params: TQueryTransferAuthTokenRequest, apiUrl: string): Promise<string>;
  getTokenListByNetwork({ network }: { network?: string }): Promise<TTokenItem[]>;
  getDepositTokenList(params: TGetDepositTokenListRequest): Promise<TDepositTokenItem[]>;
  getNetworkList({ chainId, symbol }: { chainId: ChainId; symbol: string }): Promise<TNetworkItem[]>;
  getDepositInfo(params: TGetDepositInfoRequest): Promise<TDepositInfo>;
  depositCalculator(params: TGetDepositCalculateRequest): Promise<TConversionRate>;
}
