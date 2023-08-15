import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import { BaseHeaderProps } from './UI';

export type ChatType = '1' | '2'; // '1' can chat, '2' cont chat or not sure

export interface IProfileDetailDataProps {
  name: string;
  remark?: string;
  portkeyId: string;
  relationOneId: string;
  index: string;
  addresses: AddressItem[];
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
