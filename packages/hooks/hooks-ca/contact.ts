import { request } from '@portkey-wallet/api/api-did';
import { CheckContactNameResponseType } from '@portkey-wallet/api/api-did/contact/type';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import {
  AddContactItemApiType,
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
} from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppCASelector, useAppCommonDispatch, useAppCommonSelector } from '../index';
import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';

const REFRESH_DELAY_TIME = 1.5 * 1000;

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
      setTimeout(() => {
        dispatch(fetchContactListAsync());
      }, REFRESH_DELAY_TIME);
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
        params: { id: contactItem.id },
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

export const useContactRelationIdMap = () => {
  return useAppCommonSelector(state => state.contact.contactRelationIdMap);
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
      if (!value) {
        return { contactFilterList: [], contactIndexFilterList: [] };
      }

      // STEP 1
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

      // STEP 2
      const contactIndexFilterList: ContactIndexType[] = [];
      const contactFilterList: ContactItemType[] = [];
      if (value.length <= 16) {
        filterList.forEach(({ index, contacts }) => {
          // Name search and Wallet Name search
          contactIndexFilterList.push({
            index,
            contacts: contacts.filter(
              contact =>
                contact.name.trim().toLowerCase() === value.trim().toLowerCase() ||
                contact.caHolderInfo?.walletName.trim().toLowerCase() === value.trim().toLowerCase(),
            ),
          });
        });
      } else {
        // Portkey ID search
        filterList.forEach(({ index, contacts }) => {
          contactIndexFilterList.push({
            index,
            contacts: contacts.filter(contact => contact.userId.trim() === value.trim()),
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
        filterList.forEach(({ index, contacts }) => {
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
  const { contactPortkeyIdMap, contactRelationIdMap } = useContact(false, false);

  return useCallback(
    ({ userId, relationId }: { userId?: string; relationId?: string }): boolean => {
      if (!userId && !relationId) {
        return false;
      }
      return (
        (contactPortkeyIdMap && userId && contactPortkeyIdMap?.[userId]?.length > 0) ||
        (contactRelationIdMap && relationId && contactRelationIdMap?.[relationId]?.length > 0) ||
        false
      );
    },
    [contactPortkeyIdMap, contactRelationIdMap],
  );
};
