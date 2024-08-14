import * as Random from 'expo-random';
import AElf from 'aelf-sdk';

export const generateRandomNonce = () => {
  const bytes = Random.getRandomBytes(32);
  const bytesArray = Array.from(bytes);
  const randomNonce = bytesArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return randomNonce;
};

export const generateNonceAndTimestamp = (managerAddress: string) => {
  if (!managerAddress) {
    throw new Error('managerAddress is required');
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const nonceStr = `${timestamp}${managerAddress}`;
  return {
    nonce: AElf.utils.sha256(nonceStr),
    timestamp,
  };
};
