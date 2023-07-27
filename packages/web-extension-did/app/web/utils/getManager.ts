import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import { getWallet } from '@portkey-wallet/utils/aelf';
import aes from '@portkey-wallet/utils/aes';
import { getWalletInfo } from 'store/utils/getStore';

export default async function getManager() {
  const getSeedResult = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
  const pin = getSeedResult.data.privateKey;
  const walletInfo = getWalletInfo();
  if (!walletInfo?.AESEncryptPrivateKey) return;
  const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, pin);
  if (!privateKey) return;
  return getWallet(privateKey);
}
