import {
  useEditContact,
  useAddContact,
  useDeleteContact,
  useCheckContactName,
} from '@portkey-wallet/hooks/hooks-ca/contactNew';
import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import { useCallback, useMemo, useState } from 'react';
import { IEditContactItemFormType } from './types';

export const defaultContactFormData: IEditContactItemFormType = {
  contactName: '',
  addressInfo: {
    chainId: 'AELF',
    network: 'aelf',
    isExchange: false,
    address: '',
  },
};

export const useContactAction = () => {
  const addContactApi = useAddContact();
  const editContactApi = useEditContact();
  const deleteContactApi = useDeleteContact();
  const checkName = useCheckContactName();

  return { addContactApi, editContactApi, deleteContactApi, checkName };
};

export const useDefaultContactFormValue = (contact?: IContactItemType) => {
  // exist contact, enter edit page, fill form default value
  return useMemo<IEditContactItemFormType>(() => {
    if (!contact) return defaultContactFormData;

    const _contact: IContactItemType = JSON.parse(JSON.stringify(contact));
    console.log('_contact', _contact);

    return {
      contactName: _contact.name,
      addressInfo: {
        id: _contact.id,
        chainId: _contact.addressInfo.chainId,
        network: _contact.addressInfo.network,
        isExchange: _contact.addressInfo.isExchange ?? false,
        address: _contact.addressInfo.address,
      },
    };
  }, [contact]);
};

export const useNetworkModalShow = () => {
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState<boolean>(false);

  const handleNetworkModalState = useCallback((v: boolean) => {
    setIsNetworkModalOpen(v);
  }, []);

  return { isNetworkModalOpen, handleNetworkModalState };
};
