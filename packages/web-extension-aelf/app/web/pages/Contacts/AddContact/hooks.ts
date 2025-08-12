import { useEditContact, useAddContact, useDeleteContact } from '@portkey-wallet/hooks/hooks-eoa/contact';
import { useCallback, useMemo, useState } from 'react';
import { IEditContactItemFormType } from './types';
import { IContactItemType } from '@portkey-wallet/types/types-eoa/contact';

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

  return { addContactApi, editContactApi, deleteContactApi };
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
