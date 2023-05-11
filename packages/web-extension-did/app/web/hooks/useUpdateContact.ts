import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useEffect } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { RegisterStatus } from 'types';
import { getLocalStorage } from 'utils/storage/chromeStorage';

export default function useUpdateContact() {
  const appDispatch = useAppDispatch();
  useEffect(() => {
    getLocalStorage<RegisterStatus>('registerStatus').then((state) => {
      state === 'Registered' && appDispatch(fetchContactListAsync());
    });
  }, [appDispatch]);
}
