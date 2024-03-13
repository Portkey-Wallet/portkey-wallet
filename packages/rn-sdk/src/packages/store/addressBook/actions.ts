import { createAction } from '@reduxjs/toolkit';
import type { ChainItemType } from 'packages/types/chain';
import type { AddressBookItem } from 'packages/types/addressBook';
import type { UpdateType } from 'packages/types';

export const addressBookUpdate = createAction<{
  addressBook: AddressBookItem;
  type: UpdateType;
  currentChain: ChainItemType;
}>('addressBook/updateCurrentChainAddressBook');

export const resetAddressBook = createAction('addressBook/resetAddressBook');
