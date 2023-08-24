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
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';

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
              navigate('/setting/contacts/view', { state: { ...item, from: 'contact-list' } });
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
        <div onClick={findMoreHandler} className="flex find-more">
          <CustomSvg type="AddMorePeople" className="find-more-icon" />
          <span className="find-more-text">Find more</span>
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
      {showChat && (
        <Tabs activeKey={activeKey} onChange={onChange} centered items={renderTabsData} className="contacts-tab" />
      )}
      {!showChat && <div className="testnet-list">{allContactListUI}</div>}
    </div>
  );
}
