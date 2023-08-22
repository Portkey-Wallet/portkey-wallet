import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useAllContactList,
  useIsImputation,
  useLocalContactSearch,
  usePortkeyContactList,
} from '@portkey-wallet/hooks/hooks-ca/contact';
import { useAppDispatch } from 'store/Provider/hooks';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { ContactIndexType, ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { useEffectOnce } from 'react-use';
import ContactsPopup from './Popup';
import ContactsPrompt from './Prompt';
import { BaseHeaderProps } from 'types/UI';
import { useCommonState } from 'store/Provider/hooks';
import { useGoAddNewContact } from 'hooks/useProfile';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';

const initContactItem: Partial<ContactItemType> = {
  id: '-1',
  name: '',
  addresses: [{ chainId: 'AELF', address: '', chainName: 'aelf' }],
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
  showImputation?: boolean;
  closeImputationTip: () => void;
  changeTab: (key: ContactsTab) => void;
}

export default function Contacts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();
  const allContact = useAllContactList();
  const portkeyChatList = usePortkeyContactList();
  const [curList, setCurList] = useState<ContactIndexType[]>(allContact);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const searchStr = useRef('');
  const tabKey = useRef(ContactsTab.ALL);
  const isImputation = useIsImputation();
  const [isCloseImputationManually, setIsCloseImputationManually] = useState(false);
  const showImputation = isImputation && !isCloseImputationManually;

  useEffectOnce(() => {
    appDispatch(fetchContactListAsync());
  });

  useEffect(() => {
    if (tabKey.current === ContactsTab.ALL) {
      setCurList(allContact);
    } else {
      setCurList(portkeyChatList);
    }
    setIsSearch(false);
  }, [allContact, portkeyChatList]);

  const localSearch = useLocalContactSearch();

  const searchContacts = useCallback(() => {
    if (!searchStr.current) {
      if (tabKey.current === ContactsTab.ALL) {
        setCurList(allContact);
      } else {
        setCurList(portkeyChatList);
      }
      setIsSearch(false);
      return;
    }
    const { contactIndexFilterList: searchResult } = localSearch(searchStr.current, tabKey.current);
    setCurList(searchResult);
    setIsSearch(true);
  }, [allContact, localSearch, portkeyChatList]);

  const searchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      searchStr.current = e.target.value;
      searchContacts();
    },
    [searchContacts],
  );

  const curTotalContactsNum = useMemo(() => {
    return curList.reduce((pre, cv) => pre + cv.contacts.length, 0);
  }, [curList]);

  const { isNotLessThan768 } = useCommonState();
  const searchPlaceholder = 'Wallet Name/Remark/Portkey ID/Address';
  const title = t('Contacts');
  const addText = t('Add contact');

  const goBack = useCallback(() => {
    navigate('/setting');
  }, [navigate]);

  const handleAdd = useGoAddNewContact();

  const closeImputationTip = () => {
    setIsCloseImputationManually(true);
  };

  const changeTab = (key: ContactsTab) => {
    tabKey.current = key;
    if (isSearch) {
      searchContacts();
    } else {
      if (key === ContactsTab.ALL) {
        setCurList(allContact);
      } else {
        setCurList(portkeyChatList);
      }
    }
  };

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
      showImputation={showImputation}
      closeImputationTip={closeImputationTip}
      handleAdd={() => handleAdd('3', initContactItem)}
      handleSearch={searchChange}
      changeTab={changeTab}
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
      showImputation={showImputation}
      closeImputationTip={closeImputationTip}
      handleAdd={() => handleAdd('3', initContactItem)}
      handleSearch={searchChange}
      changeTab={changeTab}
    />
  );
}
