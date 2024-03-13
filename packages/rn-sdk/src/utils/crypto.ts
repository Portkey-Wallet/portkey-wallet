import crypto from 'crypto-js';
import { PortkeyModulesEntity } from 'service/native-modules';

export const encrypt = (data: string, key: string): string => {
  return crypto.AES.encrypt(data, key).toString();
};

export const decrypt = (data: string, key: string): string => {
  return crypto.AES.decrypt(data, key).toString(crypto.enc.Utf8);
};

const defaultCryptKey = 'portkey-crypt-key';

export const encryptLocal = async (data: string) => {
  return encrypt(data, await getRealEncryptKey());
};

export const decryptLocal = async (data: string) => {
  return decrypt(data, await getRealEncryptKey());
};

const getRealEncryptKey = async () => {
  return `${defaultCryptKey}_${PortkeyModulesEntity.StorageModule.internalEncryptKey}`;
};
