import { getDeviceInfo, getDeviceIcon } from './device';
import { DeviceInfoType, DeviceType } from '@portkey-wallet/types/types-ca/device';
import { IconType } from 'types/icon';
describe('getDeviceInfo', () => {
  it('should return correct device info for MAC', () => {
    const deviceType = DeviceType.MAC;
    const expectedDeviceInfo: DeviceInfoType = { deviceName: 'macOS', deviceType };

    const result = getDeviceInfo(deviceType);

    expect(result).toEqual(expectedDeviceInfo);
  });

  it('should return correct device info for WINDOWS', () => {
    const deviceType = DeviceType.WINDOWS;
    const expectedDeviceInfo: DeviceInfoType = { deviceName: 'Windows', deviceType };

    const result = getDeviceInfo(deviceType);

    expect(result).toEqual(expectedDeviceInfo);
  });

  it('should return correct device info for other devices', () => {
    const deviceType = DeviceType.OTHER;
    const expectedDeviceInfo: DeviceInfoType = { deviceName: 'Other', deviceType };

    const result = getDeviceInfo(deviceType);

    expect(result).toEqual(expectedDeviceInfo);
  });
});

describe('getDeviceIcon', () => {
  it('should return correct icon for ANDROID', () => {
    const deviceType = DeviceType.ANDROID;
    const expectedIcon: IconType = 'phone-Android';

    const result = getDeviceIcon(deviceType);

    expect(result).toEqual(expectedIcon);
  });

  it('should return correct icon for IOS', () => {
    const deviceType = DeviceType.IOS;
    const expectedIcon: IconType = 'phone-iOS';

    const result = getDeviceIcon(deviceType);

    expect(result).toEqual(expectedIcon);
  });

  it('should return correct icon for MAC', () => {
    const deviceType = DeviceType.MAC;
    const expectedIcon: IconType = 'desk-mac';

    const result = getDeviceIcon(deviceType);

    expect(result).toEqual(expectedIcon);
  });

  it('should return correct icon for WINDOWS', () => {
    const deviceType = DeviceType.WINDOWS;
    const expectedIcon: IconType = 'desk-win';

    const result = getDeviceIcon(deviceType);

    expect(result).toEqual(expectedIcon);
  });

  it('should return default icon for other devices', () => {
    const deviceType = DeviceType.OTHER;
    const expectedIcon: IconType = 'desk-win';

    const result = getDeviceIcon(deviceType);

    expect(result).toEqual(expectedIcon);
  });
});
