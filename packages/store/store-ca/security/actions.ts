import { createAction } from '@reduxjs/toolkit';
import { NetworkType } from '@portkey-wallet/types';
import { IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';

export const setContactPrivacyList = createAction<{
  network: NetworkType;
  list: IContactPrivacy[];
}>('security/setContactPrivacyList');

export const updateContactPrivacy = createAction<{
  network: NetworkType;
  value: IContactPrivacy;
}>('security/updateContactPrivacy');

export const resetSecurity = createAction<NetworkType>('security/resetSecurity');
