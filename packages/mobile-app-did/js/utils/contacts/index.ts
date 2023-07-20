import AElf from 'aelf-sdk';
import { isAddress as web3IsAddress } from 'web3-utils';
import { ChainType } from '@portkey-wallet/types';
import { isValidBase58 } from '@portkey-wallet/utils/reg';

export type ContactItemTypes = {
  id: string;
  name: string;
  address: string;
  chainType: ChainType;
};

export type ContactsDataTypes = {
  ERC: ContactItemTypes[];
  ELF: ContactItemTypes[];
  [chainTypes: string]: ContactItemTypes[];
};

export const checkNameIsUnique = (contactsList: ContactItemTypes[] = [], info: ContactItemTypes): boolean => {
  if (!info.name) return false;
  return !contactsList.find(ele => ele.name === info.name && ele.id !== info.id); // cannot itself
};

export const checkAddress = (_contactsList: ContactItemTypes[] = [], info: ContactItemTypes): boolean => {
  return isAddress(info.address, info.chainType);
};

export const isAddress = (address: string, chainType: ChainType) => {
  if (chainType === 'aelf') return isAelfAddress(address);
  return web3IsAddress(address);
};

export const isAelfAddress = (value?: string) => {
  if (!value || !isValidBase58(value)) return false;
  try {
    return !!AElf.utils.decodeAddressRep(value);
  } catch {
    return false;
  }
};

export const getContactsListByNetworkType = (
  chainType: ChainType,
  storageData: ContactsDataTypes,
): ContactItemTypes[] => {
  return storageData[chainType] || [];
};

export const getHandleContactListResult = async (
  contactInfo: ContactItemTypes,
  storageData: ContactsDataTypes,
  handleType: 'add' | 'edit' | 'delete' = 'add',
) => {
  const { chainType } = contactInfo;
  const currentContactsList = [...getContactsListByNetworkType(chainType, storageData)];

  if (!checkNameIsUnique(currentContactsList, contactInfo)) return { code: 1, message: 'name illegal', data: [] };
  if (!checkAddress(currentContactsList, contactInfo)) return { code: 2, message: 'address illegal', data: [] };

  let result;

  switch (handleType) {
    case 'add':
      currentContactsList.push({ ...contactInfo, id: String(Date.now()) });
      result = currentContactsList;
      break;
    case 'edit':
      result = currentContactsList.map(ele => (ele.id === contactInfo.id ? { ...ele, ...contactInfo } : ele));
      break;
    case 'delete':
      result = currentContactsList.filter(ele => ele.id !== contactInfo.id);
      break;
    default:
      break;
  }
  return { code: 0, message: 'success', data: result };
};

// export const checkNameIsUnique = async (contactsList: ContactItemTypes[] = [], name: string): Promise<boolean> => {
//   const result = await contactsList.find(ele => ele.name === name);
//   return !!result;
// };
