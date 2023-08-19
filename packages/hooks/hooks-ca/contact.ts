import { request } from '@portkey-wallet/api/api-did';
import { CheckContactNameResponseType } from '@portkey-wallet/api/api-did/contact/type';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { AddContactItemApiType, ContactItemType, EditContactItemApiType } from '@portkey-wallet/types/types-ca/contact';
import { useCallback, useEffect, useMemo } from 'react';
import {
  addContactAction,
  deleteContactAction,
  editContactAction,
  fetchContactListAsync,
  readImputationAction,
} from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppCASelector, useAppCommonDispatch, useAppCommonSelector } from '../index';

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
