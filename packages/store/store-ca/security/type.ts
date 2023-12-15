import { NetworkType } from '@portkey-wallet/types';
import { IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';
import { ITransferLimitItem } from '@portkey-wallet/types/types-ca/paymentSecurity';

export interface ITransferLimitListWithPagination {
  list: ITransferLimitItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface SecurityStateType {
  contactPrivacyListNetMap: {
    [T in NetworkType]?: IContactPrivacy[];
  };
  transferLimitListNetMap?: {
    [T in NetworkType]?: ITransferLimitListWithPagination;
  };
}
