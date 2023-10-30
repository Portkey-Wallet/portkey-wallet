import { ChainId } from '..';
import { CaHolderInfo, LoginType } from './wallet';

export interface AddressItem {
  chainId: ChainId; // AELF tDVV tDVW
  chainName?: string;
  address: string;
  image?: string;
}

export interface RecentAddressItem extends AddressItem {
  transactionTime?: string;
}

export interface IImInfo {
  relationId: string;
  portkeyId: string;
  name?: string;
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
  caHolderInfo?: Partial<CaHolderInfo>;
  imInfo?: Partial<IImInfo>;
  isImputation?: boolean;
}

export interface IContactProfileLoginAccount {
  identifier: string;
  privacyType: LoginType;
}

export interface IContactProfile extends ContactItemType {
  loginAccounts?: IContactProfileLoginAccount[];
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

export interface IContactPrivacy {
  id?: string;
  identifier: string;
  privacyType: LoginType;
  permission: ContactPermissionEnum;
}

export enum ContactPermissionEnum {
  EVERY_BODY = 0,
  MY_CONTACTS = 1,
  NOBODY = 2,
}
