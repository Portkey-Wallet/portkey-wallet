import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import { BaseHeaderProps } from './UI';

export type ExtraType = '1' | '2' | '3'; // '1' can chat, '2' cont chat , '3' no status（add new chat）

export interface IProfileDetailDataProps {
  name: string;
  remark?: string;
  portkeyId: string;
  relationId: string;
  index: string;
  addresses: AddressItem[];
  isNameDisable?: boolean;
  isShowRemark?: boolean;
}

export interface IProfileDetailBodyProps {
  data: IProfileDetailDataProps;
  editText?: string;
  chatText?: string;
  addedText?: string;
  addContactText?: string;
  isShowRemark?: boolean;
  isShowAddContactBtn?: boolean;
  isShowAddedBtn?: boolean;
  isShowChatBtn?: boolean;
  handleEdit: () => void;
  handleCopy: (v: string) => void;
  handleChat?: () => void;
  handleAdd?: () => void;
}

export type IProfileDetailProps = BaseHeaderProps & IProfileDetailBodyProps;
