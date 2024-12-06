import { PublicKey } from '../wallet';

export type TAccountInfo = {
  BIP44Path: string;
  address: string;
  AESEncryptPrivateKey: string;
  publicKey: PublicKey;
  name?: string;
  isHide?: boolean;
};

export type TWalletInfo = {
  key: string;
  AESEncryptMnemonic: string;
  BIP44Path: string;
  nextBIP44Path: string;
  name?: string;
  accountList: TAccountInfo[];
  isBackup?: boolean;
};
