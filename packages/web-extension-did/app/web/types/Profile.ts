import { BaseHeaderProps } from './UI';
import { CaHolderInfo } from '@portkey-wallet/types/types-ca/wallet';
import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import { IImInfo } from '@portkey-wallet/im';

export type ExtraType = '1' | '2' | '3'; // '1' can chat, '2' cont chat , '3' no status（add new chat）

export interface IProfileDetailDataProps {
  id?: string;
  caHolderInfo?: Partial<CaHolderInfo>;
  walletName?: string;
  name?: string;
  userId?: string;
  relationId?: string;
  index: string;
  addresses: AddressItem[];
  isShowRemark?: boolean;
  imInfo?: IImInfo;
  from?: string;
}

export interface IProfileDetailBodyProps {
  data: IProfileDetailDataProps;
  showChat?: boolean; // cms control
  editText?: string;
  chatText?: string;
  addedText?: string;
  addContactText?: string;
  isShowRemark?: boolean;
  handleEdit: () => void;
  handleCopy: (v: string) => void;
  handleChat?: () => void;
  handleAdd?: () => void;
}

export type IProfileDetailProps = BaseHeaderProps &
  IProfileDetailBodyProps & { type?: MyProfilePageType; saveCallback?: () => void };

export enum MyProfilePageType {
  EDIT = 'edit',
  VIEW = 'view',
}
