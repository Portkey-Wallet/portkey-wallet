import { ChainId, ChainType, NetworkType } from '..';
import { DeviceType, QRExtraDataType } from './device';
import { IToSendAssetParamsType } from './routeParams';

export interface QRData {
  type: 'login' | 'send';
  networkType: NetworkType;
  chainType: ChainType; // eth or nft
  address: string;
}

export interface LoginQRData extends QRData {
  type: 'login';
  extraData?: QRExtraDataType;
  deviceType?: DeviceType; // 0.0.1
  id?: number | string;
}

export interface SendTokenQRDataType extends QRData {
  type: 'send';
  sendType: 'nft' | 'token';
  toInfo: {
    address: string;
    name: string;
    chainId?: ChainId;
    chainType?: ChainType;
  };
  assetInfo: IToSendAssetParamsType;
}

export const isLoginQRData = (data: QRData): data is LoginQRData => {
  return data.type === 'login';
};
