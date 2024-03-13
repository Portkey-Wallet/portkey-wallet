export * from './require';
export type NetworkType = 'MAINNET' | 'TESTNET';
export type ChainType = 'ethereum' | 'aelf';
export type UpdateType = 'update' | 'remove' | 'add';
export type PlatformType = 'app' | 'extension';
export type RpcUrlNetworkName = string;

export type ConsoleLike = Pick<Console, 'log' | 'warn' | 'error' | 'debug' | 'info' | 'trace'>;

export type ChainId = 'AELF' | 'tDVV' | 'tDVW';

export type OpacityType = number; // 0-1

export type Timestamp = number;

export type FeeResponse = {
  [symbol: string]: string;
};

export type CalculateTransactionFeeResponse = {
  Success: boolean;
  TransactionFee: FeeResponse | null;
  ResourceFee: FeeResponse | null;
  TransactionFees: {
    ChargingAddress: string;
    Fee: FeeResponse;
  } | null;
  ResourceFees: {
    ChargingAddress: string;
    Fee: FeeResponse;
  } | null;
  Error: string | null;
};

export type T_ENV_NAME = 'online' | 'offline';
