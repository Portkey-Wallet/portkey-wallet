import { ChainId } from '..';
import { PartialOption } from '../common';

export interface AddressItem {
  chainId: ChainId; // AELF tDVV tDVW
  address: string;
}

export interface RecentAddressItem extends AddressItem {
  transactionTime?: string;
}

export interface ContactItemType {
  id: string;
  index: string;
  name: string;
  addresses: AddressItem[];
  modificationTime: number;
  isDeleted: boolean;
  userId: string;
}

export type EditContactItemApiType = PartialOption<ContactItemType, 'isDeleted' | 'modificationTime' | 'userId'>;
export type AddContactItemApiType = PartialOption<EditContactItemApiType, 'id' | 'index'>;

export type GetContractListApiType = {
  totalCount: number;
  items: Array<ContactItemType>;
};

export interface RecentContactItemType extends ContactItemType {
  chainId: ChainId;
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
  addressChainId?: string;
  address: string;
}
