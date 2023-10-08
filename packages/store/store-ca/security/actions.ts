import { createAction } from '@reduxjs/toolkit';
import { NetworkType } from '@portkey-wallet/types';
import { IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';
import { ITransferLimitItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { ITransferLimitListWithPagination } from './type';

export const setContactPrivacyList = createAction<{
  network: NetworkType;
  list: IContactPrivacy[];
}>('security/setContactPrivacyList');

export const updateContactPrivacy = createAction<{
  network: NetworkType;
  value: IContactPrivacy;
}>('security/updateContactPrivacy');

export const setTransferLimitList = createAction<{
  network: NetworkType;
  value: ITransferLimitListWithPagination;
}>('security/setTransferLimitList');

export const nextTransferLimitList = createAction<{
  network: NetworkType;
  value: ITransferLimitListWithPagination;
}>('security/nextTransferLimitList');

export const updateTransferLimit = createAction<{
  network: NetworkType;
  value: ITransferLimitItem;
}>('security/updateTransferLimit');

export const resetSecurity = createAction<NetworkType>('security/resetSecurity');
