import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contactNew';
import { useAppDispatch } from 'store/Provider/hooks';
import { fetchContactListV2Async } from '@portkey-wallet/store/store-ca/contact/actions';
import { IContactIndexType } from '@portkey-wallet/types/types-ca/contactNew';
import { useEffectOnce } from 'react-use';
import ContactsPopup from './Popup';
// import ContactsPrompt from './Prompt';
import { BaseHeaderProps } from 'types/UI';
// import { useCommonState } from 'store/Provider/hooks';
import { useGoAddNewContact } from 'hooks/useProfile';
import { ContactHandleActionTypeEnum } from 'types/Profile';
import { defaultContactFormData } from './AddContact/hooks';
import { IEditContactItemFormType } from './AddContact/types';

export interface IContactsProps extends BaseHeaderProps {
  searchPlaceholder?: string;
  addText: string;
  handleAdd: () => void;
  isSearch: boolean;
  handleSearch: ChangeEventHandler<HTMLInputElement>;
  list: IContactIndexType[];
  contactCount: number;
  initData: Partial<IEditContactItemFormType>;
}

export default function Contacts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();
  const localSearch = useLocalContactSearch();
  const [curList, setCurList] = useState<IContactIndexType[]>([]);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  useEffectOnce(() => {
    appDispatch(fetchContactListV2Async());
  });

  useEffect(() => {
    const { contactIndexFilterList: searchResult } = localSearch('');
    setCurList(searchResult);
    setIsSearch(false);
  }, [localSearch]);

  const searchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsSearch(!!e.target.value);

      const { contactIndexFilterList: searchResult } = localSearch(e.target.value);
      setCurList(searchResult);
    },
    [localSearch],
  );

  const curTotalContactsNum = useMemo(() => {
    return curList.reduce((pre, cv) => pre + cv.contacts.length, 0);
  }, [curList]);

  // const { isNotLessThan768 } = useCommonState();
  const searchPlaceholder = 'Name, address';
  const title = t('Address Book');
  const addText = t('Add contact');

  const goBack = useCallback(() => {
    navigate('/setting');
  }, [navigate]);

  const handleAdd = useGoAddNewContact();

  return (
    <ContactsPopup
      initData={defaultContactFormData}
      headerTitle={title}
      goBack={goBack}
      searchPlaceholder={searchPlaceholder}
      addText={addText}
      isSearch={isSearch}
      list={curList}
      contactCount={curTotalContactsNum}
      handleAdd={() => handleAdd(ContactHandleActionTypeEnum.ADD_CONTACT)}
      handleSearch={searchChange}
    />
  );

  // return isNotLessThan768 ? (
  //   <ContactsPrompt
  //     headerTitle={title}
  //     goBack={goBack}
  //     searchPlaceholder={searchPlaceholder}
  //     addText={addText}
  //     isSearch={isSearch}
  //     list={curList}
  //     contactCount={curTotalContactsNum}
  //     initData={initContactItem}
  //     showImputation={showImputation}
  //     closeImputationTip={closeImputationTip}
  //     handleAdd={() => handleAdd(ExtraTypeEnum.ADD_NEW_CHAT, initContactItem)}
  //     handleSearch={searchChange}
  //     changeTab={changeTab}
  //   />
  // ) : (
  //   <ContactsPopup
  //     headerTitle={title}
  //     goBack={goBack}
  //     searchPlaceholder={searchPlaceholder}
  //     addText={addText}
  //     isSearch={isSearch}
  //     list={curList}
  //     contactCount={curTotalContactsNum}
  //     initData={initContactItem}
  //     showImputation={showImputation}
  //     closeImputationTip={closeImputationTip}
  //     handleAdd={() => handleAdd(ExtraTypeEnum.ADD_NEW_CHAT, initContactItem)}
  //     handleSearch={searchChange}
  //     changeTab={changeTab}
  //   />
  // );
}
