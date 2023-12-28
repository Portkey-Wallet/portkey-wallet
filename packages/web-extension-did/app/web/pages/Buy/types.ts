import { RampType } from '@portkey-wallet/ramp';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';

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

export type RampRouteState = {
  crypto: string;
  network: string;
  fiat: string;
  country: string;
  amount: string;
  side: RampType;
  tokenInfo?: TokenItemShowType;
};
