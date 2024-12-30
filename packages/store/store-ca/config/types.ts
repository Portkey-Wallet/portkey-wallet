import { ChainId, NetworkType } from '@portkey-wallet/types';
import { IContactSupportNetworkItem, ITransferSupportNetworkItem } from '@portkey-wallet/types/types-ca/config';

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
