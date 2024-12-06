import aes from '../aes';
import AElf from 'aelf-sdk';
import { DEFAULT_BIP44PATH } from '@portkey-wallet/constants/wallet';
import {
  AccountNameErrorMessage,
  FormatAccountInfo,
  GetAccountByMnemonic,
  GetAccountByPrivateKey,
  GetNextBIP44Path,
  PasswordErrorMessage,
  PinErrorMessage,
  WalletNameErrorMessage,
} from './types';
import { isValidPassword, isValidPin, isValidWalletName } from '@portkey-wallet/utils/reg';
import { AccountType, Password, WalletInfoType } from '@portkey-wallet/types/wallet';
import { PIN_SIZE, ZERO } from '@portkey-wallet/constants/misc';
import { isExtension } from '@portkey-wallet/utils';
import { TAccountInfo, TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';

export const handleWalletInfo = (walletInfo: any) => {
  const tmpWallet = { ...walletInfo };
  if (!tmpWallet.publicKey) {
    const publicKey = tmpWallet.keyPair.getPublic();
    tmpWallet.publicKey = {
      x: publicKey.x.toString('hex'),
      y: publicKey.y.toString('hex'),
    };
  }
  tmpWallet.keyPair && delete tmpWallet.keyPair;
  tmpWallet.childWallet && delete tmpWallet.childWallet;
  return tmpWallet;
};

export const formatWalletInfo = (
  walletInfoInput: any,
  password: Password,
  accountName?: string,
): { walletInfo: WalletInfoType; accountInfo: AccountType } | false => {
  try {
    if (!walletInfoInput || (walletInfoInput.privateKey && !password)) {
      return false;
    }
    const walletInfo = { ...walletInfoInput };
    walletInfo.AESEncryptPrivateKey = aes.encrypt(walletInfo.privateKey, password);
    walletInfo.AESEncryptMnemonic = walletInfo.mnemonic ? aes.encrypt(walletInfo.mnemonic, password) : null;
    if (!walletInfo?.publicKey) {
      const publicKey = walletInfo.keyPair.getPublic();
      walletInfo.publicKey = {
        x: publicKey.x.toString('hex'),
        y: publicKey.y.toString('hex'),
      };
    }
    delete walletInfo.privateKey;
    delete walletInfo.mnemonic;
    walletInfo.xPrivateKey && delete walletInfo.xPrivateKey;
    walletInfo.keyPair && delete walletInfo.keyPair;
    walletInfo.childWallet && delete walletInfo.childWallet;

    const accountInfo = {
      ...walletInfo,
      accountName: accountName || 'Account 1',
      accountType: 'Create',
    };
    delete accountInfo.AESEncryptMnemonic;
    delete accountInfo.walletName;
    return { walletInfo, accountInfo };
  } catch (error) {
    return false;
  }
};

export const formatWalletInfoV2 = (
  walletInfoInput: any,
  password: Password,
  walletName?: string,
  addressName?: string,
): TWalletInfo | false => {
  try {
    if (!walletInfoInput || !password) {
      return false;
    }
    const { mnemonic } = walletInfoInput;

    const AESEncryptMnemonic = aes.encrypt(mnemonic || '', password);

    const nextBIP44Path = getNextBIP44Path(walletInfoInput.BIP44Path);
    const account = AElf.wallet.getWalletByMnemonic(mnemonic, nextBIP44Path);
    const accountAESEncryptPrivateKey = aes.encrypt(account.privateKey, password);
    if (!account?.publicKey) {
      const publicKey = account.keyPair.getPublic();
      account.publicKey = {
        x: publicKey.x.toString('hex'),
        y: publicKey.y.toString('hex'),
      };
    }

    const accountInfo: TAccountInfo = {
      BIP44Path: nextBIP44Path,
      address: account.address,
      AESEncryptPrivateKey: accountAESEncryptPrivateKey,
      publicKey: account.publicKey,
      name: addressName || 'Address 1',
      isHide: false,
    };

    const walletInfo = {
      key: walletInfoInput.address,
      AESEncryptMnemonic,
      BIP44Path: walletInfoInput.BIP44Path,
      nextBIP44Path: getNextBIP44Path(nextBIP44Path),
      name: walletName || 'Wallet 1',
      accountList: [accountInfo],
      isBackup: false,
    };

    return walletInfo;
  } catch (error) {
    return false;
  }
};

export const formatAccountInfo: FormatAccountInfo = (
  walletInfoInput,
  password,
  accountName,
  accountType = 'Create',
) => {
  try {
    if (!walletInfoInput || (walletInfoInput.privateKey && !password)) {
      return false;
    }
    const walletInfo = { ...walletInfoInput };
    walletInfo.AESEncryptPrivateKey = aes.encrypt(walletInfo.privateKey, password);
    if (!walletInfo?.publicKey) {
      const publicKey = walletInfo.keyPair.getPublic();
      walletInfo.publicKey = {
        x: publicKey.x.toString('hex'),
        y: publicKey.y.toString('hex'),
      };
    }
    delete walletInfo.privateKey;
    delete walletInfo.mnemonic;
    delete walletInfo.xPrivateKey;
    delete walletInfo.keyPair;
    delete walletInfo.childWallet;

    const accountInfo = {
      ...walletInfo,
      accountName: accountName,
      accountType,
    };
    return accountInfo;
  } catch (error) {
    return false;
  }
};

export const getAccountByMnemonic: GetAccountByMnemonic = ({ AESEncryptMnemonic, password, BIP44Path }) => {
  const mnemonic = aes.decrypt(AESEncryptMnemonic, password);
  if (!mnemonic) return false;
  return AElf.wallet.getWalletByMnemonic(mnemonic, BIP44Path);
};
export const getAccountByPrivateKey: GetAccountByPrivateKey = privateKey => {
  const accountInfo = AElf.wallet.getWalletByPrivateKey(privateKey);
  delete accountInfo.BIP44Path;
  return accountInfo;
};
export const getNextBIP44Path: GetNextBIP44Path = BIP44Path => {
  const BIPArr = BIP44Path.split('/');
  if (isNaN(+BIPArr[BIPArr.length - 1])) {
    return DEFAULT_BIP44PATH;
  }
  BIPArr.splice(-1, 1, (+BIPArr[BIPArr.length - 1] + 1).toString());
  return BIPArr.join('/');
};

export function checkPasswordInput(password?: string): void | string {
  if (!password || password.length < 8) return PasswordErrorMessage.passwordNotLong;
  if (!isValidPassword(password)) return PasswordErrorMessage.invalidPassword;
}

export function checkWalletNameInput(walletName?: string): void | string {
  if (!walletName) return WalletNameErrorMessage.enterWalletName;
  if (walletName.length > 30) return WalletNameErrorMessage.walletNameToLong;
  if (!isValidWalletName(walletName)) return WalletNameErrorMessage.invalidWalletName;
}

export function checkAccountNameInput(accountName?: string): void | string {
  if (!accountName) return;
  if (accountName.length > 30) return AccountNameErrorMessage.walletNameToLong;
  if (!isValidWalletName(accountName)) return AccountNameErrorMessage.invalidWalletName;
}

export function checkPinInput(pin?: string): void | string {
  if (isExtension()) {
    if (!pin || pin.length < 6) return PinErrorMessage.PinNotLong;
    if (!isValidPin(pin)) return PinErrorMessage.invalidPin;
    return;
  }
  if (!pin || pin.length !== PIN_SIZE || ZERO.plus(pin).isNaN()) return PinErrorMessage.invalidPin;
}
