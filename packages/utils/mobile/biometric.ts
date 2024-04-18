import { authenticationReady, touchAuth } from './authentication';
import { isIOS } from './device';
import secureStore, { SecureKeys } from './secureStore';
export async function setSecureStoreItem(key: (typeof SecureKeys)[number] = 'Password', value: string) {
  const isReady = await authenticationReady();
  if (!isReady) throw { message: 'biometrics is not ready' };
  // authentication ready secure store password
  if (isIOS) {
    // iOS manually open authenticate
    const enrolled = await touchAuth();
    if (!enrolled.success) throw { message: enrolled.warning || enrolled.error };
  }
  // android secureStore requires authenticate by default
  await secureStore.setItemAsync(key, value);
}

export async function getSecureStoreItem(key: (typeof SecureKeys)[number] = 'Password') {
  const isReady = await authenticationReady();
  console.log('isReady', isReady);
  if (!isReady) throw { message: 'biometrics is not ready' };
  // android secureStore requires authenticate by default
  return secureStore.getItemAsync(key);
}
