import AElf from 'aelf-sdk';
import { AESEncryptWalletParam } from 'types/wallet';

export default function getPrivateKeyAndMnemonic(
  { AESEncryptPrivateKey, AESEncryptMnemonic }: AESEncryptWalletParam,
  password: string,
): Promise<
  | {
      privateKey: string;
      mnemonic: string;
    }
  | undefined
> {
  return new Promise(async (resolve, reject) => {
    let privateKey = '';
    let mnemonic = '';

    try {
      privateKey = AESEncryptPrivateKey ? AElf.wallet.AESDecrypt(AESEncryptPrivateKey, password) : null;
      mnemonic = AESEncryptMnemonic ? AElf.wallet.AESDecrypt(AESEncryptMnemonic, password) : null;
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }

    if (privateKey || mnemonic) {
      resolve({
        privateKey,
        mnemonic,
      });
    } else {
      reject(-1);
    }
  });
}
