import { ChainId, NetworkType } from '@portkey-wallet/types';

export interface IContactSupportNetworkItem {
  network: 'aelf' | string;
  name: string;
  chainId: ChainId;
  imageUrl: string;
}

export interface ITransferSupportNetworkItem {
  network: 'aelf' | string;
  name: string;
}

export interface ConfigStateType {
  contactSupportNetworkMap: {
    [T in NetworkType]?: IContactSupportNetworkItem[];
  };
  sendAssetSupportNetworkMap: {
    [T in NetworkType]?: {
      [K in ChainId]: {
        [symbol: string]: ITransferSupportNetworkItem[];
      };
    };
  };
}

export type TFetchContactSupportNetworkListPayload = ConfigStateType['contactSupportNetworkMap'];

export type TFetchTransferSupportNetworkListPayload = ConfigStateType['sendAssetSupportNetworkMap'];
