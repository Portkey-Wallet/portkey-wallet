export enum RampType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum RampTypeLower {
  BUY = 'buy',
  SELL = 'sell',
}

export enum IRampProviderType {
  AlchemyPay = 'Alchemy',
  Transak = 'Transak',
}

export declare const DefaultRampListenList: readonly ['onRampOrderChanged'];

export const RAMP_SOCKET_TIMEOUT = 15 * 1000;
