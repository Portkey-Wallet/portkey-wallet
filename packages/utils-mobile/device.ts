import { Platform, Dimensions, StatusBar } from 'react-native';
import * as Device from 'expo-device';

const X_WIDTH = 375;
const X_HEIGHT = 812;

export let screenWidth = Dimensions.get('screen').width;
export let screenHeight = Dimensions.get('screen').height;
export let windowWidth = Dimensions.get('window').width;

Dimensions.addEventListener('change', ({ window, screen }) => {
  screenWidth = screen.width;
  screenHeight = screen.height;
  windowWidth = window.width;
});

export const isIOS = Platform.OS === 'ios';

export const statusBarHeight = isIOS ? 20 : StatusBar.currentHeight ?? 20;

export const isIphoneX = (() => {
  return (
    Platform.OS === 'ios' &&
    ((screenHeight >= X_HEIGHT && screenWidth >= X_WIDTH) || (screenHeight >= X_WIDTH && screenWidth >= X_HEIGHT))
  );
})();

export const isIphone12 = (() => {
  const model = Device.modelName || '';
  const models = ['iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max'];
  return models.includes(model);
})();

export const isXiaoMi = (() => {
  const manufacturer = (Device.manufacturer || '').toLocaleLowerCase();
  const modelName = (Device.modelName || '').toLocaleLowerCase();
  return manufacturer.includes('xiaomi') || modelName.includes('xiaomi') || modelName.includes('redmi');
})();

export const bottomBarHeight = (() => {
  let height = 0;
  if (!isIOS) {
    height = screenHeight - Dimensions.get('window').height - (isXiaoMi ? 0 : statusBarHeight);
    height = Math.max(height, 6);
    height = Math.min(height, 30);
  } else if (isIOS && isIphoneX) {
    height = 34;
  }
  return height;
})();

export const windowHeight = isIOS ? screenHeight - statusBarHeight - bottomBarHeight : Dimensions.get('window').height;
