import { PublicKey } from '../wallet';

export type TAccountInfo = {
  BIP44Path: string;
  address: string;
  AESEncryptPrivateKey: string;
  publicKey: PublicKey;
  name?: string;
  isHide?: boolean;
  icon?: string;
  // local use
  totalBalance?: string;
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
export enum LoginType {
  Email,
  Phone,
  Google,
  Apple,
  Telegram,
  Facebook,
  Twitter,
}

export type LoginKeyType = string;

export type LoginKey = keyof typeof LoginType;
