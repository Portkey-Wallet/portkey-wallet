import { RampTypeLower } from '../constants';
import { IRampProviderInfo } from './services';

export * from './services';
export * from './config';

export interface IRampProvider {
  providerInfo: IProviderInfo;
  inputInfo: IInputInfo;
  extraInfo: IExtraInfo;
}

export interface IProviderInfo extends IRampProviderInfo {
  callbackUrl: string;
}

export interface IInputInfo {
  type: RampTypeLower;
  network: string;
  country: string;
  merchantOrderNo: string;
  address: string;
  fiat?: string;
  fiatAmount?: string;
  crypto?: string;
  cryptoAmount?: string;
  withdrawUrl?: string;
  source?: string;
}

export interface IExtraInfo {
  token?: string;
  sign?: string;
}
