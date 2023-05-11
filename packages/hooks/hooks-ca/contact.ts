import { request } from '@portkey-wallet/api/api-did';
import { CheckContactNameResponseType } from '@portkey-wallet/api/api-did/contact/type';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { AddContactItemApiType, ContactItemType, EditContactItemApiType } from '@portkey-wallet/types/types-ca/contact';
import { useCallback, useEffect } from 'react';
import {
  addContactAction,
  deleteContactAction,
  editContactAction,
  fetchContactListAsync,
} from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppCommonDispatch, useAppCommonSelector } from '../index';

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
