import {
  checkPasswordInput,
  checkWalletNameInput,
  checkAccountNameInput,
  getNextBIP44Path,
  handleWalletInfo,
  formatWalletInfo,
  formatAccountInfo,
  getAccountByMnemonic,
  getAccountByPrivateKey,
  checkPinInput,
} from './index';
import { AccountNameErrorMessage, PasswordErrorMessage, PinErrorMessage, WalletNameErrorMessage } from './types';
import aes from '../aes';
import AElf from 'aelf-sdk';
import { isExtension } from 'packages/utils';
import { DefaultBIP44Path } from 'packages/constants/wallet';
import { isValidPassword, isValidPin, isValidWalletName } from 'packages/utils/reg';
import { jest } from '@jest/globals';
import { describe, expect, test, beforeEach } from '@jest/globals';

declare module 'aelf-sdk';

jest.mock('packages/utils');
jest.mock('packages/utils/reg');
describe('handleWalletInfo', () => {
  test('Params contain publicKey', () => {
    expect(handleWalletInfo({ publicKey: 'publicKey' })).toEqual(expect.objectContaining({ publicKey: 'publicKey' }));
  });
  test('Params doesn`t contain publicKey, contain keyPair', () => {
    expect(() => handleWalletInfo({ keyPair: 'keyPair' })).toThrow();
    const res = handleWalletInfo({
      keyPair: {
        getPublic: jest.fn().mockImplementation(() => ({
          x: 'xxx',
          y: 'yyy',
        })),
      },
    });
    expect(Object.keys(res)).toContain('publicKey');
  });
  test('ReturnValue does not contain keyPair and childWallet', () => {
    const res = handleWalletInfo({ publicKey: 'publicKey', keyPair: 'keyPair', childWallet: 'childWallet' });
    expect(Object.keys(res)).not.toContain('keyPair');
    expect(Object.keys(res)).not.toContain('childWallet');
  });
});

describe('formatWalletInfo', () => {
  const password = '11111111',
    accountName = 'testName';
  const walletInfoInput = {
    privateKey: 'privateKey',
    mnemonic: 'mnemonic',
    publicKey: 'publicKey',
    xPrivateKey: 'xPrivateKey',
    keyPair: 'keyPair',
    childWallet: 'childWallet',
  };
  test('WalletInfoInput does not exist', () => {
    expect(formatWalletInfo(null, password, accountName)).toBeFalsy();
  });
  test('PrivateKey of walletInfoInput exist but password does not exist', () => {
    expect(formatWalletInfo({ privateKey: 'privateKey' }, '', accountName)).toBeFalsy();
  });
  test('KeyPair does not exist', () => {
    expect(formatWalletInfo({}, password, accountName)).toThrowError();
  });
  test('The walletInfoInput does not contain publicKey, contain keyPair', () => {
    const res = formatWalletInfo(
      {
        keyPair: {
          getPublic: jest.fn().mockImplementation(() => ({
            x: 'xxx',
            y: 'yyy',
          })),
        },
      },
      password,
      accountName,
    );
    expect((res as any).accountInfo.publicKey).toBeDefined();
  });
  test('Valid input, check generate AESEncryptPrivateKey and AESEncryptMnemonic', () => {
    // aes.encrypt = jest.fn();
    formatWalletInfo(walletInfoInput, password);
    expect(aes.encrypt).toHaveBeenCalledTimes(2);
  });
  test('Valid input, check returnValue', () => {
    const res = formatWalletInfo(walletInfoInput, password, accountName);
    expect(res).toHaveProperty('walletInfo');
    expect(res).toHaveProperty('accountInfo');
  });
});

describe('formatAccountInfo', () => {
  const password = '11111111',
    accountName = 'testName';
  const walletInfoInput = {
    privateKey: 'privateKey',
    mnemonic: 'mnemonic',
    publicKey: 'publicKey',
    xPrivateKey: 'xPrivateKey',
  };
  test('The input of walletInfoInput does not exist', () => {
    expect(formatAccountInfo({}, password, accountName)).toBeFalsy();
  });
  test('WalletInfoInput`privateKey exist but password does not exist', () => {
    expect(
      formatAccountInfo(
        {
          privateKey: 'privateKey',
        },
        '',
        accountName,
      ),
    ).toBeFalsy();
  });
  test('The walletInfoInput does not contain publicKey, contain keyPair', () => {
    const res = formatAccountInfo(
      {
        keyPair: {
          getPublic: jest.fn().mockImplementation(() => ({
            x: 'xxx',
            y: 'yyy',
          })),
        },
      },
      password,
      accountName,
    );
    expect(res).toHaveProperty('publicKey');
  });
  test('Valid input, check generate AESEncryptPrivateKey', () => {
    // aes.encrypt = jest.fn();
    formatAccountInfo(walletInfoInput, password, accountName);
    expect(aes.encrypt).toHaveBeenCalledTimes(1);
  });
  test('Valid input, check the returnValue', () => {
    const res = formatAccountInfo(walletInfoInput, password, accountName);
    expect(res).toHaveProperty('accountName');
    expect(res).toHaveProperty('accountType');
    expect(res).not.toHaveProperty('privateKey');
    expect(res).not.toHaveProperty('mnemonic');
    expect(res).not.toHaveProperty('xPrivateKey');
    expect(res).not.toHaveProperty('keyPair');
    expect(res).not.toHaveProperty('childWallet');
  });
});

describe('getAccountByMnemonic', () => {
  const AESEncryptMnemonic = 'AESEncryptMnemonic',
    password = '11111111',
    BIP44Path = DefaultBIP44Path;
  test('Valid input', () => {
    // aes.decrypt = jest.fn().mockReturnValue(true);
    (AElf as any).wallet.getWalletByMnemonic = jest.fn();
    const res = getAccountByMnemonic({ AESEncryptMnemonic, password, BIP44Path });
    expect(aes.decrypt).toHaveBeenCalledTimes(1);
    expect((AElf as any).wallet.getWalletByMnemonic).toHaveBeenCalledTimes(1);
    expect(res).toBeFalsy();
  });
  test('The mnemonic does not exist', () => {
    // aes.decrypt = jest.fn().mockReturnValue(false);
    expect(getAccountByMnemonic({ AESEncryptMnemonic, password, BIP44Path })).toBeFalsy();
  });
  test('The AESEncryptMnemonic does not exist', () => {
    // aes.decrypt = jest.fn().mockReturnValue(false);
    expect(getAccountByMnemonic({ AESEncryptMnemonic: '', password, BIP44Path })).toBeFalsy();
  });
});

describe('getAccountByPrivateKey', () => {
  beforeEach(() => {
    (AElf as any).wallet.getWalletByPrivateKey = jest.fn().mockReturnValue({
      BIP44Path: DefaultBIP44Path,
    });
  });
  const privateKey = '1111';
  test('Valid input, get wallet from privateKey', () => {
    getAccountByPrivateKey(privateKey);
    expect((AElf as any).wallet.getWalletByPrivateKey).toHaveBeenCalledTimes(1);
  });
  test('Valid input, the returnValue is not BIP44Path', () => {
    const res = getAccountByPrivateKey(privateKey);
    expect(res).not.toHaveProperty('BIP44Path');
  });
});

describe('getNextBIP44Path', () => {
  test('The input of BIP44Path is valid', () => {
    expect(getNextBIP44Path("m/44'/1616'/0'/0/0")).toBe("m/44'/1616'/0'/0/1");
  });
  test('The input of BIP44Path is invalid', () => {
    expect(getNextBIP44Path("m/44'/1616'/0'/0/a")).toBe(DefaultBIP44Path);
  });
});

describe('checkPasswordInput', () => {
  test('Password does not exist or the length less than 8', () => {
    expect(checkPasswordInput('')).toBe(PasswordErrorMessage.passwordNotLong);
    expect(checkPasswordInput('111111')).toBe(PasswordErrorMessage.passwordNotLong);
  });
  test('Password is invalid', () => {
    jest.mocked(isValidPassword).mockReturnValue(false);
    expect(checkPasswordInput('$#111111')).toBe(PasswordErrorMessage.invalidPassword);
  });
  test('Password is valid', () => {
    jest.mocked(isValidPassword).mockReturnValue(true);
    expect(checkPasswordInput('12345678')).toBeUndefined();
  });
});

describe('checkWalletNameInput', () => {
  test('WalletName does not exist', () => {
    expect(checkWalletNameInput('')).toBe(WalletNameErrorMessage.enterWalletName);
  });
  test('The length of walletName more than 30', () => {
    expect(checkWalletNameInput('1'.repeat(31))).toBe(WalletNameErrorMessage.walletNameToLong);
  });
  test('the walletName is invalid', () => {
    expect(checkWalletNameInput('``test')).toBe(WalletNameErrorMessage.invalidWalletName);
  });
  test('the walletName is valid', () => {
    expect(checkWalletNameInput('12345678')).toBeTruthy();
  });
});

describe('checkAccountNameInput', () => {
  test('AccountName does not exist', () => {
    expect(checkAccountNameInput('')).toBeUndefined();
  });
  test('The length of accountName more than 30', () => {
    expect(checkAccountNameInput('1'.repeat(31))).toBe(AccountNameErrorMessage.walletNameToLong);
  });
  test('The accountName is invalid', () => {
    expect(checkAccountNameInput('``')).toBe(AccountNameErrorMessage.invalidWalletName);
  });
  test('The accountName is valid', () => {
    jest.mocked(isValidWalletName).mockReturnValue(true);
    expect(checkAccountNameInput('123456')).toBeUndefined();
  });
});

describe('checkPinInput', () => {
  test('Extension platform, pin is not long enough', () => {
    jest.mocked(isExtension).mockReturnValue(true);
    jest.mocked(isValidPin).mockReturnValue(false);
    expect(checkPinInput('@#::*&^%(*&')).toBe(PinErrorMessage.invalidPin);
  });
  test('Extension platform, pin is invalid', () => {
    jest.mocked(isExtension).mockReturnValue(true);
    expect(checkPinInput('')).toBe(PinErrorMessage.PinNotLong);
    expect(checkPinInput('111')).toBe(PinErrorMessage.PinNotLong);
  });
  test('Extension platform, pin is valid', () => {
    jest.mocked(isExtension).mockReturnValue(true);
    jest.mocked(isValidPin).mockReturnValue(true);
    expect(checkPinInput('111111')).toBeUndefined();
  });
  test('Expect extension platform, the pin is invalid', () => {
    jest.mocked(isExtension).mockReturnValue(false);
    expect(checkPinInput('11111111')).toBe(PinErrorMessage.invalidPin);
    expect(checkPinInput('')).toBe(PinErrorMessage.invalidPin);
    expect(checkPinInput('qqqqqq')).toBe(PinErrorMessage.invalidPin);
  });
  test('Expect extension platform, the pin is valid', () => {
    expect(checkPinInput('111111')).toBeUndefined();
  });
});
