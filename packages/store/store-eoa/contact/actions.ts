import { createAction } from '@reduxjs/toolkit';

import { IContactItemType } from '@portkey-wallet/types/types-eoa/contact';
import { NetworkType } from '@portkey-wallet/types';

export const setContactAction = createAction<{
  network: NetworkType;
  item: IContactItemType;
}>('contact/addContract');

export const resetContact = createAction<{
  network: NetworkType;
}>('contact/resetContact');

export const refreshContactMap = createAction<void>('contact/refreshContactMap');
