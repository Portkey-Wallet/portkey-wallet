import * as ScreenOrientation from 'expo-screen-orientation';
export async function lockScreenOrientation(orientationLock = ScreenOrientation.OrientationLock.PORTRAIT_UP) {
  await ScreenOrientation.lockAsync(orientationLock);
}
