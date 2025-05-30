import clsx from 'clsx';
import ContactListIndexBar from '../ContactListIndexBar';
import NoContacts from '../NoContacts';
import { useNavigate } from 'react-router';
import { ContactIndexType, ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import './index.less';
import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
import CustomSvg from 'components/CustomSvg';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useGoProfile, useProfileChat } from 'hooks/useProfile';
import ContactList from '../ContactList';

export interface IContactsBodyProps {
  isSearch: boolean;
  list: ContactIndexType[];
  contactCount: number;
  initData: Partial<ContactItemType>;
  changeTab: (key: ContactsTab) => void;
}

export default function ContactsBody({ isSearch, list, contactCount, initData, changeTab }: IContactsBodyProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const showChat = useIsChatShow();
  const [activeKey, setActiveKey] = useState<string>(ContactsTab.ALL);
  const flatList = useMemo(() => {
    const transList: ContactItemType[] = [];
    list.forEach(({ contacts }) => {
      transList.push(...contacts);
    });
    return transList;
  }, [list]);

  const onChange = useCallback(
    async (key: string) => {
      setActiveKey(key);
      changeTab(key as ContactsTab);
    },
    [changeTab],
  );

  const findMoreHandler = useCallback(() => {
    navigate('/setting/contacts/find-more');
  }, [navigate]);

  const handleGoProfile = useGoProfile();
  const chatFn = useProfileChat();
  const handleChat = useCallback(
    (e: any, relationId: string) => {
      e.stopPropagation();

      chatFn(relationId);
    },
    [chatFn],
  );

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
          <ContactListIndexBar
            hasChatEntry={showChat}
            list={list}
            clickItem={(item) => handleGoProfile({ ...item, previousPage: 'contact-list' })}
            clickChat={(e, item) => handleChat(e, item?.imInfo?.relationId || '')}
          />
        )}
      </>
    );
  }, [contactCount, handleChat, handleGoProfile, initData, isSearch, list, showChat]);

  const portkeyChatListUI = useMemo(() => {
    return (
      <>
        <div onClick={findMoreHandler} className="flex find-more">
          <CustomSvg type="AddMorePeople" className="find-more-icon" />
          <span className="find-more-text">Find People</span>
        </div>
        {allContactListUI}
      </>
    );
  }, [allContactListUI, findMoreHandler]);

  const renderTabsData = useMemo(
    () => [
      {
        label: t('All'),
        key: ContactsTab.ALL,
        children: allContactListUI,
      },
      {
        label: t('Chats'),
        key: ContactsTab.Chats,
        children: portkeyChatListUI,
      },
    ],
    [allContactListUI, portkeyChatListUI, t],
  );

  return (
    <div className={clsx(['contacts-body', isSearch && 'index-bar-hidden'])}>
      {isSearch && (
        <ContactList
          className="contact-search-list"
          hasChatEntry={showChat}
          list={flatList}
          clickItem={(item) => handleGoProfile({ ...item, previousPage: 'contact-list' })}
          clickChat={(e, item) => handleChat(e, item?.imInfo?.relationId || '')}
        />
      )}
      {!isSearch && (
        <>
          {showChat && (
            <Tabs activeKey={activeKey} onChange={onChange} centered items={renderTabsData} className="contacts-tab" />
          )}
          {!showChat && <div className="testnet-list">{allContactListUI}</div>}
        </>
      )}
    </div>
  );
}
