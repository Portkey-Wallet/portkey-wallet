import { UpdateNotify, VersionDeviceType } from '@portkey-wallet/types/types-ca/device';

export interface UpdateVersionParams {
  deviceId?: string;
  deviceType: VersionDeviceType;
  appVersion: string;
  appId?: string;
}

export interface MiscState {
  versionInfo?: UpdateNotify;
}
