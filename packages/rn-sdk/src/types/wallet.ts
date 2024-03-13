export interface Wallet {
  BIP44Path: string;
  address: string;
  AESEncryptPrivateKey: string;
  AESEncryptMnemonic: string;
  walletName?: string;
  publicKey?: {
    x: string;
    y: string;
  };
  isBackup?: boolean;
}

export interface Credentials {
  password?: string;
}

export type LoginInfo = { guardianIdentifier?: string; loginAccount?: string; caHash?: string };

export interface CountryCodeDataDTO {
  locateData: CountryCodeItem; // current locate phone code data
  data: Array<CountryCodeItem>;
}

export interface CountryCodeItem {
  country: string;
  code: string; // example: "+52"
  iso: string;
}

export const defaultCountryCode: CountryCodeItem = {
  country: 'Singapore',
  code: '65',
  iso: 'SG',
};
