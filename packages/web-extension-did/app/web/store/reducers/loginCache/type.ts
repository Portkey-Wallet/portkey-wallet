import { CountryItem } from '@portkey-wallet/types/types-ca/country';
import { CAInfoType, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { AuthenticationInfo, VerifierInfo } from '@portkey-wallet/types/verifier';

export interface LoginInfo {
  guardianAccount: string; // account
  loginType: LoginType;
  createType?: 'register' | 'login' | 'scan';
  authenticationInfo?: AuthenticationInfo;
}

export interface ISelectCountryCode {
  index: string;
  country: CountryItem;
}

export interface LoginState {
  loginAccount?: LoginInfo;
  guardianCount?: number;
  scanWalletInfo?: any;
  scanCaWalletInfo?: CAInfoType;
  registerVerifier?: VerifierInfo;
  countryCode: ISelectCountryCode;
}
