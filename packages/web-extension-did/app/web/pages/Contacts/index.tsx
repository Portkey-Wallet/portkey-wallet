import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { useContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import { useAppDispatch } from 'store/Provider/hooks';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import { ContactIndexType, ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { useEffectOnce } from 'react-use';
import ContactsPopup from './Popup';
import ContactsPrompt from './Prompt';
import { BaseHeaderProps } from 'types/UI';
import { useCommonState } from 'store/Provider/hooks';
import { useProfileAddNewContact } from 'hooks/useProfile';

const initContactItem: Partial<ContactItemType> = {
  id: '-1',
  name: '',
  addresses: [{ chainId: 'AELF', address: '' }],
};

export interface IContactsProps extends BaseHeaderProps {
  searchPlaceholder?: string;
  addText: string;
  handleAdd: () => void;
  isSearch: boolean;
  handleSearch: ChangeEventHandler<HTMLInputElement>;
  list: ContactIndexType[];
  contactCount: number;
  initData: Partial<ContactItemType>;
}

export default function Contacts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();
  const { contactIndexList } = useContact();
  const [curList, setCurList] = useState<ContactIndexType[]>(contactIndexList);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const filterContact = useMemo(() => contactIndexList.filter((c) => c.contacts.length > 0), [contactIndexList]);

  useEffectOnce(() => {
    appDispatch(fetchContactListAsync());
  });

  useEffect(() => {
    setCurList(filterContact);
    setIsSearch(false);
  }, [filterContact]);

  const searchContacts = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (!value) {
        setCurList(filterContact);
        setIsSearch(false);
        return;
      }
      const contactIndexFilterList: ContactIndexType[] = [];

      if (value.length <= 16) {
        // Name search
        filterContact.forEach(({ index, contacts }) => {
          contactIndexFilterList.push({
            index,
            contacts: contacts.filter((contact) => contact.name.trim().toLowerCase() === value.trim().toLowerCase()),
          });
        });
      } else {
        // Address search
        let suffix = '';
        if (value.includes('_')) {
          const arr = value.split('_');
          if (!isAelfAddress(arr[arr.length - 1])) {
            suffix = arr[arr.length - 1];
          }
        }
        value = getAelfAddress(value);
        filterContact.forEach(({ index, contacts }) => {
          contactIndexFilterList.push({
            index,
            contacts: contacts.filter((contact) =>
              contact.addresses.some((ads) => ads.address === value && (!suffix || suffix === ads.chainId)),
            ),
          });
        });
      }
      setCurList(contactIndexFilterList);
      setIsSearch(true);
    },
    [filterContact],
  );

  const curTotalContactsNum = useMemo(() => {
    return curList.reduce((pre, cv) => pre + cv.contacts.length, 0);
  }, [curList]);

  const { isNotLessThan768 } = useCommonState();
  const searchPlaceholder = 'Wallet Name/Remark/ Portkey ID/Address';
  const title = t('Contacts');
  const addText = t('Add contact');

  const goBack = useCallback(() => {
    navigate('/setting');
  }, [navigate]);

  const handleAdd = useProfileAddNewContact();

  return isNotLessThan768 ? (
    <ContactsPrompt
      headerTitle={title}
      goBack={goBack}
      searchPlaceholder={searchPlaceholder}
      addText={addText}
      isSearch={isSearch}
      list={curList}
      contactCount={curTotalContactsNum}
      initData={initContactItem}
      handleAdd={() => handleAdd('3', initContactItem)}
      handleSearch={searchContacts}
    />
  ) : (
    <ContactsPopup
      headerTitle={title}
      goBack={goBack}
      searchPlaceholder={searchPlaceholder}
      addText={addText}
      isSearch={isSearch}
      list={curList}
      contactCount={curTotalContactsNum}
      initData={initContactItem}
      handleAdd={() => handleAdd('3', initContactItem)}
      handleSearch={searchContacts}
    />
  );
}
