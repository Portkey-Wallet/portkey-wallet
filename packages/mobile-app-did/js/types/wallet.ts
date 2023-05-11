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
