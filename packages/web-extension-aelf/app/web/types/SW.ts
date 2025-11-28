import { AutoLockDataType } from 'constants/lock';
import { SendResponseFun } from 'types';

export interface IPageState {
  lockTime: AutoLockDataType;
}

export interface BaseInternalMessagePayload {
  from: string;
  hostname: string;
  href: string;
  method: string;
  origin: string;
}

export interface InternalMessagePayload extends BaseInternalMessagePayload {
  params: any;
}

export interface InternalMessageData<T = any> {
  type: string;
  payload: T;
}

export interface BaseRequestMessagePayload {
  eventName: string;
  hostname: string;
  href: string;
  method: string;
  origin: string;
  icon?: string;
}

export interface RequestMessagePayload<T = any> extends BaseRequestMessagePayload {
  payload: T;
}

export interface RequestMessageData<T = any> {
  type: string;
  payload: RequestMessagePayload<T>;
}

export type RequestCommonHandler<T = any> = (
  sendResponse: SendResponseFun,
  message: RequestMessagePayload<T>,
) => Promise<void>;
