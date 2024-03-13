import type { AccountType, WalletInfoType, CreateType, Password } from 'packages/types/wallet';

export declare type FormatAccountInfo = (
  walletInfoInput: any,
  password: string,
  accountName: string,
  accountType?: CreateType,
) => AccountType | false;

export declare type GetAccountByMnemonic = (params: {
  BIP44Path: string;
  password: Password;
  AESEncryptMnemonic: string;
}) => (WalletInfoType & { [x: string]: any }) | false;

export declare type GetAccountByPrivateKey = (privateKey: string) => WalletInfoType & { [x: string]: any };
export declare type GetNextBIP44Path = (privateKey: string) => string;

export enum PasswordErrorMessage {
  passwordNotLong = 'Password not long enough (Must be at least 8 characters)',
  invalidPassword = 'Invalid Password',
}
export enum PinErrorMessage {
  invalidPin = 'Invalid Pin',
  PinNotLong = 'Pin is not long enough! (Must be at least 6 characters)',
}

export enum WalletNameErrorMessage {
  enterWalletName = 'Please Enter a Name',
  walletNameToLong = 'Wallet name is too long!. (up to 30 characters)',
  invalidWalletName = 'Name does not meet specifications',
}
export enum AccountNameErrorMessage {
  walletNameToLong = 'Account name is too long!. (up to 30 characters)',
  invalidWalletName = 'Account name not meet specifications',
}
