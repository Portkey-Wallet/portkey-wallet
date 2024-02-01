export type CreateType = 'Import' | 'Create';

export type Password = string;

export type Address = string;
export type PublicKey = {
  x: string;
  y: string;
};

export type TWalletInfo = {
  BIP44Path: string;
  address: Address;
  privateKey: string;
  publicKey?: PublicKey;
};

export interface WalletInfoType {
  BIP44Path: string;
  address: Address;
  AESEncryptPrivateKey: string;
  AESEncryptMnemonic: string;
  walletName?: string;
  publicKey?: PublicKey;
  isBackup?: boolean;
}

export interface AccountType {
  BIP44Path?: string;
  address: Address;
  AESEncryptPrivateKey: string;
  accountName: string;
  publicKey?: PublicKey;
  accountType: CreateType;
}
