import { createAction } from '@reduxjs/toolkit';
import type { ChainItemType } from '@portkey-wallet/types/chain';
import type { AddressBookItem } from '@portkey-wallet/types/addressBook';
import type { UpdateType } from '@portkey-wallet/types';

export const addressBookUpdate = createAction<{
  addressBook: AddressBookItem;
  type: UpdateType;
  currentChain: ChainItemType;
}>('addressBook/updateCurrentChainAddressBook');

export const resetAddressBook = createAction('addressBook/resetAddressBook');
