import { ILoginAccountListProps } from 'pages/Contacts/components/LoginAccountList';
import { BaseHeaderProps } from './UI';
import { IContactProfile } from '@portkey-wallet/types/types-ca/contact';

// related to ExtraType
export enum ContactHandleActionTypeEnum {
  EDIT_CONTACT = 'edit-contact',
  ADD_CONTACT = 'new-contact',
}

// route type
export type ContactHandleActionType = `${ContactHandleActionTypeEnum}`;

export interface IProfileDetailDataProps extends Partial<IContactProfile> {
  relationId?: string;
  isShowRemark?: boolean;
  previousPage?: string;
  loginAccountMap?: ILoginAccountListProps;
}

export interface IProfileDetailBodyProps {
  data: IProfileDetailDataProps;
}

export type IProfileDetailProps = BaseHeaderProps &
  IProfileDetailBodyProps & { type?: MyProfilePageType; saveCallback?: () => void };

export enum MyProfilePageType {
  EDIT = 'edit',
  VIEW = 'view',
}
