export enum AppStatusUnit {
  'FOREGROUND',
  'BACKGROUND',
}

export enum DeviceTypeUnit {
  'ANDROID',
  'IOS',
  'EXTENSION',
}

export type DeviceInfoType = {
  deviceType?: DeviceTypeUnit;
  deviceBrand?: string;
  operatingSystemVersion?: string;
};
