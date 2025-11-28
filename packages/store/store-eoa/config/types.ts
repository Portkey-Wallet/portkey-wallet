import { ChainId, NetworkType } from '@portkey-wallet/types';

export interface IContactSupportNetworkItem {
  network: 'aelf' | string;
  name: string;
  chainId: ChainId;
  imageUrl: string;
  pattern?: string;
}

export interface ITransferSupportNetworkItem {
  network: 'aelf' | string;
  name: string;
}

export interface TConfigStateType {
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

export type TFetchContactSupportNetworkListPayload = TConfigStateType['contactSupportNetworkMap'];

export type TFetchTransferSupportNetworkListPayload = TConfigStateType['sendAssetSupportNetworkMap'];
