import { NetworkType } from 'packages/types';
import { CountryItem } from 'packages/types/types-ca/country';
import { UpdateNotify, VersionDeviceType } from 'packages/types/types-ca/device';

export interface UpdateVersionParams {
  deviceId?: string;
  deviceType: VersionDeviceType;
  appVersion: string;
  appId?: string;
}

export interface MiscState {
  versionInfo?: UpdateNotify;
  phoneCountryCodeListChainMap?: {
    [T in NetworkType]?: CountryItem[];
  };
  defaultPhoneCountryCode?: CountryItem;
  localPhoneCountryCode?: CountryItem;
}
