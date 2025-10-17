import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import aes from '@portkey-wallet/utils/aes';
import { getCurrentAccount } from './lib/SWGetReduxStore';

export async function getPin() {
  const getSeedResult = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
  const pin = getSeedResult.data.privateKey;
  return pin;
}

export default async function getSeed() {
  const pin = await getPin();
  const walletInfo = await getCurrentAccount();
  if (!walletInfo?.AESEncryptPrivateKey) return { pin, privateKey: '' };
  const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, pin);
  return { pin, privateKey };
}
