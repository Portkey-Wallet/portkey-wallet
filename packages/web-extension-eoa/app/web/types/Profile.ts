import { ILoginAccountListProps } from 'pages/Contacts/components/LoginAccountList';
import { BaseHeaderProps } from './UI';
import { IContactProfile } from '@portkey-wallet/types/types-ca/contact';
import { IPopoverMenuListData } from '@portkey-wallet/im-ui-web';

// used for route parameters
export type ExtraType = 'can-chat-edit' | 'cant-chat-edit' | 'add-new-chat';

// related to ExtraType
export enum ExtraTypeEnum {
  CAN_CHAT = 'can-chat-edit',
  CANT_CHAT = 'cant-chat-edit',
  ADD_NEW_CHAT = 'add-new-chat', // no status（add new chat）
}

export interface IProfileDetailDataProps extends Partial<IContactProfile> {
  relationId?: string;
  isShowRemark?: boolean;
  previousPage?: string;
  loginAccountMap?: ILoginAccountListProps;
}

export interface IProfileDetailBodyProps {
  data: IProfileDetailDataProps;
  showChat?: boolean; // cms control
  editText?: string;
  chatText?: string;
  addedText?: string;
  addContactText?: string;
  isShowRemark?: boolean;
  morePopListData?: IPopoverMenuListData[];
  handleEdit: () => void;
  handleChat?: () => void;
  handleAdd?: () => void;
}

export type IProfileDetailProps = BaseHeaderProps &
  IProfileDetailBodyProps & { type?: MyProfilePageType; saveCallback?: () => void };

export enum MyProfilePageType {
  EDIT = 'edit',
  VIEW = 'view',
}
