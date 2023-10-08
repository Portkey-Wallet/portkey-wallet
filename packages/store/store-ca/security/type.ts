import { NetworkType } from '@portkey-wallet/types';
import { IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';

export interface SecurityStateType {
  contactPrivacyListNetMap: {
    [T in NetworkType]?: IContactPrivacy[];
  };
}
