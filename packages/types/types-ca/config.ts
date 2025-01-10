import { ChainId } from '..';

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
