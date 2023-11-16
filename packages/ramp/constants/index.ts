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

export const DefaultRampListenList = ['onRampOrderChanged'];

export const RAMP_SOCKET_TIMEOUT = 15 * 1000;

export enum SELL_ORDER_DISPLAY_STATUS {
  INITIALIZED = 'Initialized',
  CREATED = 'Created',
  TRANSFERRING = 'Transferring',
  TRANSFERRED = 'Transferred',
  START_PAYMENT = 'StartPayment',
  FINISH = 'Finish',
  FAILED = 'Failed',
  EXPIRED = 'Expired',
}
