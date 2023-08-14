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
import CustomModal from 'pages/components/CustomModal';
import CustomSvg from 'components/CustomSvg';

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

  const handleChat = useCallback((e: any) => {
    e.stopPropagation();
    CustomModal({
      content: (
        <>{`Please click on the Portkey browser extension in the top right corner to access the chat feature`}</>
      ),
    });
  }, []);

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
            list={list}
            isSearch={isSearch}
            clickItem={(item) => {
              console.log('🌈 🌈 🌈 🌈 🌈 🌈 ', JSON.stringify(item));
              navigate('/setting/contacts/view', { state: item });
            }}
            clickChat={handleChat}
          />
        )}
      </>
    );
  }, [contactCount, handleChat, initData, isSearch, list, navigate]);

  const portkeyChatListUI = useMemo(() => {
    return (
      <>
        <div onClick={findMoreHandler} className="flex find-more-people">
          <CustomSvg type="AddMorePeople" className="find-more-people-icon" />
          <span className="find-more-people-text">Find more people</span>
        </div>
        {portkeyChatCount === 0 ? (
          isSearchPortkeyChat ? (
            <div className="flex-center no-search-result">There is no search result.</div>
          ) : (
            <NoContacts initData={portkeyChatInitData} />
          )
        ) : (
          <ContactListIndexBar
            list={portkeyChatList}
            isSearch={isSearchPortkeyChat}
            clickItem={(item) => {
              navigate('/setting/contacts/view', { state: item });
            }}
            clickChat={handleChat}
          />
        )}
      </>
    );
  }, [
    findMoreHandler,
    handleChat,
    isSearchPortkeyChat,
    navigate,
    portkeyChatCount,
    portkeyChatInitData,
    portkeyChatList,
  ]);

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
