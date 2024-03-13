import aes from 'packages/utils/aes';

export function checkPassword(AESEncryptMnemonic = '', password: string) {
  if (!AESEncryptMnemonic) return false;
  return aes.decrypt(AESEncryptMnemonic, password);
}
