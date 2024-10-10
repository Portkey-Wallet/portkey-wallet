import * as amplitude from '@amplitude/analytics-react-native';
import { Identify } from '@amplitude/analytics-react-native';
import { AMPLITUDE_ANDROID_API_KEY, AMPLITUDE_IOS_API_KEY } from '@portkey-wallet/constants';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { BaseEvent, EventOptions } from '@amplitude/analytics-types';
import DeviceInfo from 'react-native-device-info';
import * as Application from 'expo-application';

class AmplitudeData {
  private instance: amplitude.Types.ReactNativeClient | undefined;
  private isIOS: boolean;
  constructor() {
    this.isIOS = isIOS;
  }
  async init() {
    this.instance = amplitude.createInstance();
    this.instance.init(this.isIOS ? AMPLITUDE_IOS_API_KEY : AMPLITUDE_ANDROID_API_KEY, '', {
      trackingOptions: {
        platform: false,
        app_version: true,
        osVersion: false,
        osName: false,
      },
    });
    const id = await DeviceInfo.getUniqueId();
    this.instance.setDeviceId(id);
    const identifyObj = new Identify();
    this.instance.identify(identifyObj, {
      platform: isIOS ? 'iOS' : 'Android',
      os_version: DeviceInfo.getSystemVersion(),
      os_name: DeviceInfo.getSystemName(),
      app_version: Application.nativeApplicationVersion || 'unknown',
    });
  }
  track(eventInput: BaseEvent | string, eventProperties?: Record<string, any>, eventOptions?: EventOptions) {
    this.instance?.track(eventInput, eventProperties, { ...eventOptions });
  }
  setUserId(userId: string) {
    this.instance?.setUserId(userId);
  }
  reset() {
    this.instance?.reset();
  }
}
export async function init() {
  await amplitudeInstance.init();
}
export function track(
  eventInput: BaseEvent | string,
  eventProperties?: Record<string, any>,
  eventOptions?: EventOptions,
) {
  amplitudeInstance.track(eventInput, eventProperties, eventOptions);
}
export function setUserId(userId: string) {
  amplitudeInstance.setUserId(userId);
}
export function reset() {
  amplitudeInstance.reset();
}
const amplitudeInstance = new AmplitudeData();
export default amplitudeInstance;
