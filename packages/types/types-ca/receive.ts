import { ChainId } from '@portkey/provider-types';

export enum ReceiveFromNetworkServiceType {
  ETransfer = 'ETransfer',
  EBridge = 'EBridge',
}

export type TReceiveFromNetworkServiceItem = {
  serviceName: ReceiveFromNetworkServiceType;
  multiConfirmTime: string;
  maxAmount: string;
};

export type TReceiveFromNetworkItem = {
  network: string;
  name: string;
  imageUrl: string;
  serviceList: TReceiveFromNetworkServiceItem[];
};

export type TReceiveTokenMap = {
  [key in ChainId]: TReceiveFromNetworkItem[];
};

export type TReceiveData = {
  destinationMap: TReceiveTokenMap;
};
