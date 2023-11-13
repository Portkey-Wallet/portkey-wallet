export interface ILimitTextParams {
  min: string | number;
  max: string | number;
  symbol: string;
}
export interface IErrMsgHandlerParams extends ILimitTextParams {
  amount: string;
}

export interface IValidValueCheckParams {
  amount: string;
  min: string | number;
  max: string | number;
}
