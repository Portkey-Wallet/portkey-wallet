import { PartialOption } from '../common';

export interface DeviceInfoType {
  deviceName?: string;
  deviceType?: DeviceType;
}

export interface ExtraDataType {
  transactionTime: number;
  deviceInfo: string;
  version: string;
}

export interface ExtraDataDecodeType extends Omit<ExtraDataType, 'deviceInfo'> {
  deviceInfo: DeviceInfoType;
}

export type QRExtraDataType = PartialOption<ExtraDataDecodeType, 'transactionTime'>;

export interface DeviceItemType extends ExtraDataDecodeType {
  managerAddress?: string | null;
}

// version 0.0.1
export enum DeviceType {
  OTHER,
  MAC,
  IOS,
  WINDOWS,
  ANDROID,
}

export enum VersionDeviceType {
  Android,
  iOS,
  Extension,
}

// version 0.0.1
// extraData: string
// format: deviceType:DeviceType,transactionTime:number,transactionTime?:number

// version 1.0.0
// extraData: ExtraDataType
// interface ExtraDataType {
//   transactionTime: number;
//   deviceInfo: string; // DeviceInfoType
//   version: string;
// }
// interface DeviceInfoType {
//   deviceName: string;
//   deviceType: DeviceType;
// }

// version 2.0.0
// extraData: ExtraDataType
// interface ExtraDataType {
//   transactionTime: number;
//   deviceInfo: string; // encrypt string => JSON.stringify(DeviceInfoType)
//   version: string;
// }
// interface DeviceInfoType {
//   deviceName: string;
//   deviceType: DeviceType;
// }

export type UpdateNotify = {
  content: string;
  downloadUrl: string;
  isForceUpdate: boolean;
  targetVersion: string;
  title: string;
};
