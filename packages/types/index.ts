export * from './require';
export type NetworkType = 'MAIN' | 'TESTNET';
export type ChainType = 'ethereum' | 'aelf';
export type UpdateType = 'update' | 'remove' | 'add';
export type PlatformType = 'app' | 'extension';
export type RpcUrlNetworkName = string;

export type ConsoleLike = Pick<Console, 'log' | 'warn' | 'error' | 'debug' | 'info' | 'trace'>;

export type ChainId = 'AELF' | 'tDVV' | 'tDVW';

export type OpacityType = number; // 0-1
