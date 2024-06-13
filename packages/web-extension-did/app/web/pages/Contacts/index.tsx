import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { useIsImputation, useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contact';
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
import { ExtraTypeEnum } from 'types/Profile';
import { useBlockAndReport } from '@portkey-wallet/hooks/hooks-ca/im';

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
  const localSearch = useLocalContactSearch();
  const [curList, setCurList] = useState<ContactIndexType[]>([]);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const isImputation = useIsImputation();
  const [isCloseImputationManually, setIsCloseImputationManually] = useState(false);
  const showImputation = isImputation && !isCloseImputationManually;
  const { fetchAndSetBlockList } = useBlockAndReport();

  useEffectOnce(() => {
    appDispatch(fetchContactListAsync());
    fetchAndSetBlockList();
  });

  useEffect(() => {
    const { contactIndexFilterList: searchResult } = localSearch('', ContactsTab.ALL);
    setCurList(searchResult);
    setIsSearch(false);
  }, [localSearch]);

  const searchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsSearch(!!e.target.value);

      const { contactIndexFilterList: searchResult } = localSearch(e.target.value, ContactsTab.ALL);
      setCurList(searchResult);
    },
    [localSearch],
  );

  const curTotalContactsNum = useMemo(() => {
    return curList.reduce((pre, cv) => pre + cv.contacts.length, 0);
  }, [curList]);

  const { isNotLessThan768 } = useCommonState();
  const searchPlaceholder = 'Name/address';
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
    const { contactIndexFilterList: searchResult } = localSearch('', key);
    setCurList(searchResult);
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
      handleAdd={() => handleAdd(ExtraTypeEnum.ADD_NEW_CHAT, initContactItem)}
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
      handleAdd={() => handleAdd(ExtraTypeEnum.ADD_NEW_CHAT, initContactItem)}
      handleSearch={searchChange}
      changeTab={changeTab}
    />
  );
}
