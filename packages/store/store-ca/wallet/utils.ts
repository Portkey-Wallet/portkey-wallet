import aes from '@portkey-wallet/utils/aes';

export function checkPassword(AESEncryptMnemonic: string = '', password: string) {
  if (!AESEncryptMnemonic) return false;
  return aes.decrypt(AESEncryptMnemonic, password);
}
