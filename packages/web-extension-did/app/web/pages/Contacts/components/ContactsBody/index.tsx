import clsx from 'clsx';
import ContactList from '../ContactList';
import NoContacts from '../NoContacts';
import { useNavigate } from 'react-router';
import { ContactIndexType, ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import './index.less';
import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';

export interface IContactsBodyProps {
  isSearch: boolean;
  list: ContactIndexType[];
  contactCount: number;
  initData: Partial<ContactItemType>;
  portkeyChatCount: number;
  portkeyChatInitData: Partial<ContactItemType>;
  portkeyChatList: ContactIndexType[];
  isSearchPortkeyChat: boolean;
}

export default function ContactsBody({
  isSearch,
  list,
  contactCount,
  initData,
  portkeyChatCount,
  portkeyChatInitData,
  portkeyChatList,
  isSearchPortkeyChat,
}: IContactsBodyProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState<string>(ContactsTab.ALL);

  const onChange = useCallback(async (key: string) => {
    setActiveKey(key);
  }, []);

  const findMoreHandler = useCallback(() => {
    navigate('/setting/contacts/find-more-people');
  }, [navigate]);

  const allContactListUI = useMemo(() => {
    return (
      <>
        {contactCount === 0 ? (
          isSearch ? (
            <div className="flex-center no-search-result">There is no search result.</div>
          ) : (
            <NoContacts initData={initData} />
          )
        ) : (
          <ContactList
            list={list}
            isSearch={isSearch}
            clickItem={(item, index) => {
              navigate('/setting/contacts/view', { state: { ...item, index: index } });
            }}
          />
        )}
      </>
    );
  }, [contactCount, initData, isSearch, list, navigate]);

  const portkeyChatListUI = useMemo(() => {
    return (
      <>
        <div onClick={findMoreHandler}>Find more people</div>
        {portkeyChatCount === 0 ? (
          isSearchPortkeyChat ? (
            <div className="flex-center no-search-result">There is no search result.</div>
          ) : (
            <NoContacts initData={portkeyChatInitData} />
          )
        ) : (
          <ContactList
            list={portkeyChatList}
            isSearch={isSearchPortkeyChat}
            clickItem={(item, index) => {
              navigate('/setting/contacts/view', { state: { ...item, index: index } });
            }}
          />
        )}
      </>
    );
  }, [findMoreHandler, isSearchPortkeyChat, navigate, portkeyChatCount, portkeyChatInitData, portkeyChatList]);

  const renderTabsData = useMemo(
    () => [
      {
        label: t('All'),
        key: ContactsTab.ALL,
        children: allContactListUI,
      },
      {
        label: t('Portkey Chat'),
        key: ContactsTab.PORTKEY_CHAT,
        children: portkeyChatListUI,
      },
    ],
    [allContactListUI, portkeyChatListUI, t],
  );

  return (
    <div className={clsx(['contacts-body', isSearch && 'index-bar-hidden'])}>
      <Tabs activeKey={activeKey} onChange={onChange} centered items={renderTabsData} className="contacts-tab" />
    </div>
  );
}
