import { IImInfo } from '@portkey-wallet/im';
import { ChainId } from '..';
import { CaHolderInfo } from './wallet';

export interface AddressItem {
  chainId: ChainId; // AELF tDVV tDVW
  chainName?: string;
  address: string;
  image?: string;
}

export interface RecentAddressItem extends AddressItem {
  transactionTime?: string;
}

export interface ContactItemType {
  id: string;
  index: string;
  name: string;
  avatar?: string;
  addresses: AddressItem[];
  modificationTime: number;
  isDeleted: boolean;
  userId: string;
  caHolderInfo?: CaHolderInfo;
  imInfo?: IImInfo;
  isImputation: boolean;
}

export interface EditContactItemApiType {
  name: string;
  id?: string;
  relationId?: string;
  addresses?: AddressItem[];
  from?: string;
  channelUuid?: string;
}

export interface AddContactItemApiType {
  name: string;
  relationId?: string;
  addresses: AddressItem[];
}

export type GetContractListApiType = {
  totalCount: number;
  items: Array<ContactItemType>;
};

export interface RecentContactItemType extends ContactItemType {
  chainId: ChainId;
  chainName: string;
  caAddress: string;
  address: string;
  addressChainId: ChainId;
  transactionTime: string;
  name: string;
  addresses: RecentAddressItem[];
}

export type ContactIndexType = Pick<ContactItemType, 'index'> & { contacts: ContactItemType[] };

export type ContactMapType = { [key: string]: ContactItemType[] };

export interface IClickAddressProps {
  name?: string;
  isDisable?: boolean;
  chainId: ChainId;
  chainName?: string;
  addressChainId?: string;
  address: string;
}
