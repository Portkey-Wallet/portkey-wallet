import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import aes from '@portkey-wallet/utils/aes';
import { getWalletInfo } from 'store/utils/getStore';

export async function getPin() {
  const getSeedResult = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
  const pin = getSeedResult.data.privateKey;
  return pin;
}

export default async function getSeed() {
  const pin = await getPin();
  const walletInfo = getWalletInfo();
  if (!walletInfo?.AESEncryptPrivateKey) throw Error('walletInfo.AESEncryptPrivateKey is not exist');
  const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, pin);
  return { pin, privateKey };
}
