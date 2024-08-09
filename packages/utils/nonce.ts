import * as Random from 'expo-random';

const generateRandomNonce = () => {
  const bytes = Random.getRandomBytes(32);
  const bytesArray = Array.from(bytes);
  const randomNonce = bytesArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return randomNonce;
};

export default generateRandomNonce;
