// TODO: eoa contact recent
import { IRecentItem } from '@portkey-wallet/store/store-ca/recent/type';
import { ChainId } from '..';

export interface IAddressInfo {
  chainId?: ChainId; //  just for aelf chain: AELF tDVV tDVW
  isExchange?: boolean; // just for aelf chain
  network: string; //  BSC TBSC....
  networkName: string;
  networkImage: string;
  address: string;
}

export interface AddressItem {
  chainId: ChainId; // AELF tDVV tDVW
  chainName?: string;
  address: string;
  image?: string;
  displayChainName?: string;
  chainImageUrl?: string;
}

export interface IRecentAddressInfo extends IAddressInfo {
  transactionTime?: string;
}

export interface IContactItemType {
  id: string;
  index: string;
  name: string;
  addressInfo: IAddressInfo;
  isDeleted?: boolean;
  address?: string;
}
export type TDeleteContactItemParams = IContactItemType;

export type TFormattedRecentItem = Partial<IRecentItem & IContactItemType>;

export interface RecentContactItemType extends IContactItemType {
  chainId: ChainId;
  chainName: string;
  caAddress: string;
  address: string;
  addressChainId: ChainId;
  transactionTime: string;
  name: string;
}

export interface IAddContactItemApiType {
  name: string;
  address: string;
  network: 'aelf' | string;
  chainId?: ChainId;
  isExchange?: boolean;
}

export interface IEditContactItemApiType {
  name: string;
  id?: string;
  chainId?: ChainId;
  network: 'aelf' | string;
  isExchange?: boolean;
  address: string;
}

export type TGetContactListApiType = {
  totalCount: number;
  items: Array<IContactItemType>;
};

export type IContactIndexType = Pick<IContactItemType, 'index'> & { contacts: IContactItemType[] };

export type IContactMapType = { [key: string]: IContactItemType[] };

export interface INetworkItemType {
  network: string;
  name: string;
  chainId?: ChainId;
  imageUrl: string;
}
