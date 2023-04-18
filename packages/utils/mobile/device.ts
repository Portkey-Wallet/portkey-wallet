import { Platform, Dimensions, StatusBar } from 'react-native';
import * as Device from 'expo-device';

const X_WIDTH = 375;
const X_HEIGHT = 812;

export const screenWidth = Dimensions.get('screen').width;
export const screenHeight = Dimensions.get('screen').height;
export const windowWidth = Dimensions.get('window').width;

export const isIos = Platform.OS === 'ios';

export const statusBarHeight = isIos ? 20 : StatusBar.currentHeight ?? 20;

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
  if (!isIos) {
    height = screenHeight - Dimensions.get('window').height - (isXiaoMi ? 0 : statusBarHeight);
    if (height > 40) height = 40;
  } else if (isIos && isIphoneX) {
    height = 34;
  }
  return height;
})();

export const windowHeight = isIos ? screenHeight - statusBarHeight - bottomBarHeight : Dimensions.get('window').height;
