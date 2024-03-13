import AElf from 'aelf-sdk';

const encrypt = (str: string, password: string): string => {
  return AElf.wallet.AESEncrypt(str, password);
};

const decrypt = (str: string, password: string): string | false => {
  try {
    return AElf.wallet.AESDecrypt(str, password);
  } catch (error) {
    return false;
  }
};

export default {
  encrypt,
  decrypt,
};
