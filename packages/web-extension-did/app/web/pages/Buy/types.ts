export interface IErrMsgHandlerParams {
  min: string | number;
  max: string | number;
  symbol: string;
}

export interface IBuyErrMsgHandlerParams {
  min: string | number;
  max: string | number;
  fiat: string;
  fiatAmount: string;
}

export interface ISellErrMsgHandlerParams {
  min: string | number;
  max: string | number;
  crypto: string;
  cryptoAmount: string;
}

export interface IValidValueCheckParams {
  amount: string;
  min: string | number;
  max: string | number;
}
