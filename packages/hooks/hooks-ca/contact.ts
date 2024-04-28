import { request } from '@portkey-wallet/api/api-did';
import { CheckContactNameResponseType } from '@portkey-wallet/api/api-did/contact/type';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import {
  AddContactItemApiType,
  AddressItem,
  ContactIndexType,
  ContactItemType,
  EditContactItemApiType,
} from '@portkey-wallet/types/types-ca/contact';
import { useCallback, useEffect, useMemo } from 'react';
import {
  addContactAction,
  deleteContactAction,
  editContactAction,
  fetchContactListAsync,
  readImputationAction,
  refreshContactMap,
} from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppCASelector, useAppCommonDispatch, useAppCommonSelector } from '../index';
import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
import { useAddStranger } from './im';
import { useCurrentUserInfo } from './wallet';
import { sleep } from '@portkey-wallet/utils';

export const REFRESH_DELAY_TIME = 1.5 * 1000;

export const useAddContact = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(
    async (contactItem: AddContactItemApiType): Promise<ContactItemType> => {
      const response = await request.contact.addContact({
        baseURL: currentNetworkInfo.apiUrl,
        params: contactItem,
      });
      dispatch(addContactAction(response));
      setTimeout(() => {
        dispatch(fetchContactListAsync());
      }, REFRESH_DELAY_TIME);
      return response;
    },
    [currentNetworkInfo.apiUrl, dispatch],
  );
};

export const useAddStrangerContact = () => {
  const dispatch = useAppCommonDispatch();
  const addStranger = useAddStranger();
  return useCallback(
    async (relationId: string) => {
      const response = await addStranger(relationId);

      dispatch(addContactAction(response.data));
      setTimeout(() => {
        dispatch(fetchContactListAsync());
      }, REFRESH_DELAY_TIME);
      return response;
    },
    [addStranger, dispatch],
  );
};

export const useEditContact = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(
    async (contactItem: EditContactItemApiType): Promise<ContactItemType> => {
      const response = await request.contact.editContact({
        baseURL: currentNetworkInfo.apiUrl,
        resourceUrl: `${contactItem.id}`,
        params: contactItem,
      });
      dispatch(editContactAction(response));
      await sleep(REFRESH_DELAY_TIME);
      dispatch(fetchContactListAsync());
      return response;
    },
    [currentNetworkInfo.apiUrl, dispatch],
  );
};

export const useDeleteContact = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(
    async (contactItem: EditContactItemApiType): Promise<ContactItemType> => {
      const response = await request.contact.deleteContact({
        baseURL: currentNetworkInfo.apiUrl,
        resourceUrl: `${contactItem.id}`,
      });
      dispatch(deleteContactAction({ ...contactItem, isDeleted: true } as ContactItemType));
      setTimeout(() => {
        dispatch(fetchContactListAsync());
      }, REFRESH_DELAY_TIME);
      return response;
    },
    [currentNetworkInfo.apiUrl, dispatch],
  );
};

export const useCheckContactName = () => {
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(
    (contactName: string): Promise<CheckContactNameResponseType> => {
      return request.contact.checkContactName({
        baseURL: currentNetworkInfo.apiUrl,
        params: {
          name: contactName,
        },
      });
    },
    [currentNetworkInfo.apiUrl],
  );
};

export const useContact = (isFetch = true, isInit = false) => {
  const dispatch = useAppCommonDispatch();
  useEffect(() => {
    isFetch && dispatch(fetchContactListAsync(isInit));
  }, [dispatch, isFetch, isInit]);
  return useAppCommonSelector(state => state.contact);
};

export const useContactList = () => {
  const contact = useAppCommonSelector(state => state.contact);

  return useMemo(() => {
    let result: ContactItemType[] = [];
    contact.contactIndexList
      .filter(ele => ele.contacts.length !== 0)
      .map(ele => {
        result = [...result, ...ele.contacts];
      });
    return result;
  }, [contact.contactIndexList]);
};

export const useIsImputation = () => useAppCASelector(state => state.contact.isImputation);

export const useReadImputation = () => {
  const dispatch = useAppCommonDispatch();
  const currentNetworkInfo = useCurrentNetworkInfo();
  return useCallback(
    async (contactItem: EditContactItemApiType): Promise<ContactItemType> => {
      const response = await request.contact.readImputation({
        baseURL: currentNetworkInfo.apiUrl,
        params: { contactId: contactItem.id },
      });
      dispatch(
        readImputationAction({ ...contactItem, isImputation: false, modificationTime: Date.now() } as ContactItemType),
      );
      setTimeout(() => {
        dispatch(fetchContactListAsync());
      }, REFRESH_DELAY_TIME);
      return response;
    },
    [currentNetworkInfo.apiUrl, dispatch],
  );
};

export const useCheckContactMap = () => {
  const contact = useAppCommonSelector(state => state.contact);
  const dispatch = useAppCommonDispatch();

  useEffect(() => {
    if (contact.lastModified === 0) return;
    const contactMapLength = Object.keys(contact.contactMap).length;
    const contactRelationIdMapLength = Object.keys(contact.contactRelationIdMap || {}).length;
    const contactPortkeyIdMapLength = Object.keys(contact.contactPortkeyIdMap || {}).length;

    const contactIdMapLength = Object.keys(contact.contactIdMap || {}).length;
    if (
      contactMapLength === 0 ||
      contactRelationIdMapLength === 0 ||
      contactIdMapLength === 0 ||
      contactPortkeyIdMapLength === 0
    ) {
      dispatch(refreshContactMap());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useContactRelationIdMap = () => {
  return useAppCommonSelector(state => state.contact.contactRelationIdMap);
};

export const useContactIdMap = () => {
  return useAppCommonSelector(state => state.contact.contactIdMap);
};
export const useContactPortkeyIdMap = () => {
  return useAppCommonSelector(state => state.contact.contactPortkeyIdMap);
};

export const useContactInfo = ({ relationId, contactId }: { relationId?: string; contactId?: string }) => {
  const contactIdMap = useContactIdMap();
  const contactRelationIdMap = useContactRelationIdMap();

  return useMemo(() => {
    let contactInfo: ContactItemType | undefined;
    // if (!relationId || !contactId) return undefined;
    if (contactId) {
      contactInfo = contactIdMap?.[contactId]?.[0];
    }
    if (contactInfo) return contactInfo;
    if (relationId) {
      contactInfo = contactRelationIdMap?.[relationId]?.[0];
    }
    return contactInfo;
  }, [contactId, contactIdMap, contactRelationIdMap, relationId]);
};

export const useAllContactList = () => {
  const { contactIndexList } = useContact();

  return useMemo(() => {
    return contactIndexList.filter(c => c.contacts.length > 0);
  }, [contactIndexList]);
};

export const usePortkeyContactList = () => {
  const { contactIndexList } = useContact(false, false);

  return useMemo(() => {
    const hasValueList = contactIndexList.filter(c => c.contacts.length > 0);
    const portkeyContactList: ContactIndexType[] = [];
    hasValueList.forEach(({ index, contacts }) => {
      portkeyContactList.push({
        index,
        contacts: contacts.filter(contact => contact.imInfo?.portkeyId),
      });
    });
    return portkeyContactList;
  }, [contactIndexList]);
};

export const useLocalContactSearch = () => {
  const { contactIndexList } = useContact(false, false);

  return useCallback(
    (value: string, type: ContactsTab) => {
      // STEP 1 > filter - type
      let filterList: ContactIndexType[] = [];
      if (type === ContactsTab.Chats) {
        // search can chat
        contactIndexList.forEach(({ index, contacts }) => {
          filterList.push({
            index,
            contacts: contacts.filter(contact => contact.imInfo?.portkeyId),
          });
        });
      } else {
        // search all
        filterList = contactIndexList;
      }

      // STEP 2 > filter - no data
      const notEmptyFilterList = filterList.filter(item => item?.contacts?.length > 0);

      // STEP 3 > filter - no search value, return total
      if (!value) {
        const temp: ContactItemType[] = [];
        notEmptyFilterList.forEach(({ contacts }) => {
          temp.push(...contacts);
        });
        return { contactFilterList: temp, contactIndexFilterList: notEmptyFilterList };
      }

      // STEP 4 > filter - have search value, return search result
      const contactIndexFilterList: ContactIndexType[] = [];
      const contactFilterList: ContactItemType[] = [];
      if (value.length <= 16) {
        const _v = value.trim().toLowerCase();
        notEmptyFilterList.forEach(({ index, contacts }) => {
          // Name search and Wallet Name search
          contactIndexFilterList.push({
            index,
            contacts: contacts.filter(contact => {
              if (contact?.caHolderInfo?.walletName) {
                return (
                  contact?.name?.trim().toLowerCase().includes(_v) ||
                  contact?.caHolderInfo?.walletName?.trim().toLowerCase().includes(_v)
                );
              } else {
                return (
                  contact?.name?.trim().toLowerCase().includes(_v) ||
                  contact?.imInfo?.name?.trim().toLowerCase().includes(_v)
                );
              }
            }),
          });
        });
      } else {
        // Portkey ID search
        notEmptyFilterList.forEach(({ index, contacts }) => {
          contactIndexFilterList.push({
            index,
            contacts: contacts.filter(contact => contact?.imInfo?.portkeyId?.trim() === value.trim()),
          });
        });
        // Address search
        let suffix = '';
        if (value.includes('_')) {
          const arr = value.split('_');
          if (!isAelfAddress(arr[arr.length - 1])) {
            suffix = arr[arr.length - 1];
          }
        }
        value = getAelfAddress(value);
        notEmptyFilterList.forEach(({ index, contacts }) => {
          contactIndexFilterList.push({
            index,
            contacts: contacts.filter(contact =>
              contact.addresses.some(ads => ads.address === value && (!suffix || suffix === ads.chainId)),
            ),
          });
        });
      }
      // flat contactIndexFilterList
      contactIndexFilterList.forEach(({ contacts }) => {
        contactFilterList.push(...contacts);
      });
      return { contactFilterList, contactIndexFilterList };
    },
    [contactIndexList],
  );
};

export const useChatContactFlatList = () => {
  const { contactIndexList } = useContact(false, false);
  return useMemo(() => {
    const contactFlatList: ContactItemType[] = [];
    contactIndexList.forEach(({ contacts }) => {
      contacts.map(contact => {
        if (contact.imInfo?.relationId) {
          contactFlatList.push(contact);
        }
      });
    });
    return contactFlatList;
  }, [contactIndexList]);
};

export const useIsMyContact = () => {
  const contactRelationIdMap = useContactRelationIdMap();
  const contactIdMap = useContactIdMap();
  const { userId } = useCurrentUserInfo();

  return useCallback(
    ({ relationId, contactId }: { relationId?: string; contactId?: string }): boolean => {
      let checkRelationId = false,
        checkContactId = false;
      const checkIsMe = relationId === userId;
      if (relationId && contactRelationIdMap) {
        checkRelationId = contactRelationIdMap?.[relationId]?.length > 0;
      }
      if (contactId && contactIdMap) {
        checkContactId = contactIdMap?.[contactId]?.length > 0;
      }
      return (checkRelationId || checkContactId) && !checkIsMe;
    },
    [contactIdMap, contactRelationIdMap, userId],
  );
};

export const useIndexAndName = (item: Partial<ContactItemType>) => {
  return useMemo(() => {
    const name = item?.name || item?.caHolderInfo?.walletName || item?.imInfo?.name || '';

    const index = name?.substring(0, 1).toLocaleUpperCase();
    return { index, name };
  }, [item?.caHolderInfo?.walletName, item?.imInfo?.name, item?.name]);
};

export const useAelfContactList = () => {
  const { contactIndexList } = useContact();

  return useMemo(() => {
    const copyContactIndexList: ContactIndexType[] = JSON.parse(JSON.stringify(contactIndexList));
    const indexList: ContactIndexType[] = [];
    copyContactIndexList.forEach(item => {
      const filterContacts: ContactItemType[] = [];
      item.contacts.forEach(contact => {
        const filterAddresses: AddressItem[] = [];
        contact.addresses.forEach(address => {
          if (address?.chainName === 'aelf') {
            filterAddresses.push(address);
          }
        });
        if (filterAddresses?.length > 0) {
          filterContacts.push({ ...contact, addresses: filterAddresses });
        }
      });
      indexList.push({ index: item.index, contacts: filterContacts });
    });
    return indexList;
  }, [contactIndexList]);
};

export const useGetContactLabel = () => {
  const contactPortkeyIdMap = useContactPortkeyIdMap();

  return useCallback(
    (portkeyId: string, defaultNameFromBackEnd: string) => {
      const targetContact = contactPortkeyIdMap?.[portkeyId]?.[0];

      return (
        targetContact?.name ||
        targetContact?.caHolderInfo?.walletName ||
        defaultNameFromBackEnd ||
        targetContact?.imInfo?.name ||
        ''
      );
    },
    [contactPortkeyIdMap],
  );
};
