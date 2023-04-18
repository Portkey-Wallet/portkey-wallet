export enum TypeEnum {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface LimitType {
  min: number;
  max: number;
}

export interface CryptoItemType {
  crypto: string;
  network: string;
  networkName: string;
}
