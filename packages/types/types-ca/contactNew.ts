import { IRecentItem } from '@portkey-wallet/store/store-ca/recent/type';
import { ChainId } from '..';
import { CaHolderInfo, LoginType } from './wallet';

export interface IAddressInfo {
  chainId?: ChainId; //  just for aelf chain: AELF tDVV tDVW
  isExchange?: boolean; // just for aelf chain
  network: string; //  BSC TBSC....
  networkName: string;
  networkImage: string;
  address: string;
}

export interface IRecentAddressInfo extends IAddressInfo {
  transactionTime?: string;
}

export interface IContactItemType {
  id: string;
  index: string;
  name: string;
  addressInfo: IAddressInfo;
  caHolderInfo?: Partial<CaHolderInfo>;
  isDeleted: boolean;
  userId: string;
  modificationTime: number;
}

export type TFormattedRecentItem = IRecentItem | IContactItemType;

export interface RecentContactItemType extends IContactItemType {
  chainId: ChainId;
  chainName: string;
  caAddress: string;
  address: string;
  addressChainId: ChainId;
  transactionTime: string;
  name: string;
}

export interface IContactProfileLoginAccount {
  identifier: string;
  privacyType: LoginType;
}

export interface IContactProfile extends IContactItemType {
  loginAccounts?: IContactProfileLoginAccount[];
}

export interface IAddContactItemApiType {
  name: string;
  address: string;
  network: 'aelf' | string;
  chainId?: ChainId;
  isExchange?: boolean;
}
export interface IEditContactItemApiType {
  name?: string;
  id: string;
  chainId?: string;
  isExchange?: string;
  address?: string;
}

export type TGetContactListApiType = {
  totalCount: number;
  items: Array<IContactItemType>;
};

export type IContactIndexType = Pick<IContactItemType, 'index'> & { contacts: IContactItemType[] };

export type IContactMapType = { [key: string]: IContactItemType[] };
