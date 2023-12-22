import { getWallet } from '@portkey-wallet/utils/aelf';
import aes from '@portkey-wallet/utils/aes';
import { getWalletState } from './SWGetReduxStore';

export default async function getManager(pin: string) {
  const { walletInfo } = await getWalletState();
  if (!walletInfo?.AESEncryptPrivateKey) return;
  const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, pin);
  if (!privateKey) return;
  return getWallet(privateKey);
}
