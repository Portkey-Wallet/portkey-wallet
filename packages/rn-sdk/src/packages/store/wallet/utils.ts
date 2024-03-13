import { AccountType, CreateType, WalletInfoType } from 'packages/types/wallet';
import aes from 'packages/utils/aes';
import { isEqAddress } from 'packages/utils/aelf';
import { WalletError, WalletState } from './type';
import { enumToMap } from 'packages/utils';
import { formatAccountInfo, getAccountByMnemonic } from 'packages/utils/wallet';

export function checkAccount(accountList: AccountType[], address: string) {
  return accountList.find(item => isEqAddress(item.address, address));
}

export function checkPassword(AESEncryptMnemonic: string, password: string) {
  return aes.decrypt(AESEncryptMnemonic, password);
}

const walletError = enumToMap(WalletError);
export function isWalletError(error: any): string | false {
  if (walletError[error?.message]) {
    return error.message;
  }
  return false;
}

export function getAccountByWalletState(state: WalletState, password: string) {
  if (!state.walletInfo) throw new Error(WalletError.noCreateWallet);
  const walletInfo = getAccountByMnemonic({
    AESEncryptMnemonic: state.walletInfo.AESEncryptMnemonic,
    password,
    BIP44Path: state.nextBIP44Path,
  });
  if (!walletInfo) throw new Error(WalletError.passwordFailed);
  return walletInfo;
}

export function checkAccountExists(state: WalletState, walletInfo: WalletInfoType) {
  if (!state.accountList) throw new Error(WalletError.noCreateWallet);

  const checkAccountInfo = checkAccount(state.accountList, walletInfo.address);

  if (checkAccountInfo) throw { message: WalletError.accountExists, accountInfo: JSON.stringify(checkAccountInfo) };
}

export function createAccount(
  walletInfo: WalletInfoType,
  password: string,
  accountName: string,
  accountType?: CreateType,
) {
  const accountInfo = formatAccountInfo(walletInfo, password, accountName, accountType);
  if (!accountInfo) throw new Error(WalletError.accountCreateFailed);
  return accountInfo;
}

export function checkPasswordByStateMnemonic(AESEncryptMnemonic: string, password: string) {
  if (!checkPassword(AESEncryptMnemonic, password)) throw new Error(WalletError.passwordFailed);
}

export function checkAccountNotExistByState(accountList: AccountType[], account: string) {
  if (!checkAccount(accountList, account)) throw new Error(WalletError.accountNotExist);
}

export function changeEncryptStr(str: string, password: string, newPassword: string) {
  console.log(str, password, '====password');

  const decryptStr = aes.decrypt(str, password);
  if (!decryptStr) throw new Error(WalletError.decryptionFailed);
  return aes.encrypt(decryptStr, newPassword);
}

export function handlePrivateKey(privateKey: string) {
  let pkey = privateKey;
  // Handle PKeys with 0x
  if (pkey.slice(0, 2) === '0x') pkey = pkey.slice(2);

  return pkey;
}
