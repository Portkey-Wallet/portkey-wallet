import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AddressBookItem, AddressBookType } from '@portkey-wallet/types/addressBook';
import { ChainItemType } from '@portkey-wallet/types/chain';
import { addressFormat, isAddress } from '@portkey-wallet/utils';
import { AddressBookError } from './types';
import { UpdateType } from '@portkey-wallet/types';

export interface addressBookState {
  addressBook: AddressBookType;
}

const initialState: addressBookState = {
  addressBook: {},
};

export const addressBookSlice = createSlice({
  name: 'addressBook',
  initialState,
  reducers: {
    updateCurrentChainAddressBook: (
      state,
      action: PayloadAction<{ addressBook: AddressBookItem; currentChain: ChainItemType; type: UpdateType }>,
    ) => {
      const { addressBook, type, currentChain } = action.payload;
      const { rpcUrl, networkName } = currentChain;
      const address = addressFormat(addressBook.address, currentChain.chainId, currentChain.chainType);

      const error: string[] = [];

      // illegal address
      if (!isAddress(address ?? '', currentChain.chainType)) error.push(AddressBookError.invalidAddress);

      const addressBookFormat: AddressBookItem = {
        name: addressBook.name.trim(),
        key: addressBook.key ? addressBook.key : `${address}&${addressBook.name}`,
        address,
      };

      // whiteSpace name
      if (!addressBookFormat.name) error.push(AddressBookError.noName);

      let flag: boolean;
      switch (type) {
        case 'add':
          flag = (state.addressBook[`${rpcUrl}&${networkName}`] ?? []).some(
            item => item.name === addressBook.name.trim(),
          );

          // illegal name
          if (flag) error.push(AddressBookError.alreadyExists);

          if (!!error.length) throw new Error(JSON.stringify(error));

          state.addressBook[`${rpcUrl}&${networkName}`] = (state.addressBook[`${rpcUrl}&${networkName}`] ?? []).concat([
            addressBookFormat,
          ]);
          break;
        case 'remove':
          state.addressBook[`${rpcUrl}&${networkName}`] = (state.addressBook[`${rpcUrl}&${networkName}`] ?? []).filter(
            item => item.key !== addressBookFormat.key,
          );
          break;
        case 'update':
          flag = (state.addressBook[`${rpcUrl}&${networkName}`] ?? []).some(
            item => item.name === addressBook.name.trim() && item.key !== addressBook?.key,
          );

          if (flag) error.push(AddressBookError.alreadyExists);

          if (!!error.length) throw new Error(JSON.stringify(error));

          state.addressBook[`${rpcUrl}&${networkName}`] = (state.addressBook[`${rpcUrl}&${networkName}`] ?? []).map(
            item => (item.key === addressBookFormat.key ? addressBookFormat : item),
          );
          break;
        default:
          throw 'update error';
      }
    },
    resetAddressBook: () => {
      return initialState;
    },
  },
});

export default addressBookSlice;
