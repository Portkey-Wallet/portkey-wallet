import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { useLoading } from 'store/Provider/hooks';
import DropdownSearch from 'components/DropdownSearch';
import ContactList from 'pages/Contacts/components/ContactList';
import { useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contact';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import './index.less';

export default function ChatListSearch() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [chatList, setChatList] = useState<ContactItemType[]>([]);
  const localSearch = useLocalContactSearch();

  const handleSearch = useCallback(
    async (keyword: string) => {
      if (!keyword) {
        const { contactFilterList = [] } = localSearch(keyword, ContactsTab.ALL);
        console.log('searchResult', contactFilterList);
        setChatList(contactFilterList);
        // setChatList([]);
      } else {
        const { contactFilterList = [] } = localSearch(keyword, ContactsTab.Chats);
        setChatList(contactFilterList);
      }
    },
    [localSearch],
  );

  useEffect(() => {
    setFilterWord(state?.search ?? '');
  }, [state?.search]);

  const searchDebounce = useDebounceCallback(
    async (params) => {
      setLoading(true);
      await handleSearch(params);
      setLoading(false);
    },
    [filterWord],
    500,
  );

  return (
    <div className="new-chat-page flex-column">
      <div className="new-chat-top">
        <SettingHeader
          title={t('Chats')}
          leftCallBack={() => navigate('/chat-list')}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate('/chat-list')} />}
        />
        <DropdownSearch
          overlay={<></>}
          value={filterWord}
          inputProps={{
            onChange: (e) => {
              const _value = e.target.value.replaceAll(' ', '');
              setFilterWord(_value);
              searchDebounce(_value);
            },
            placeholder: 'Search',
          }}
        />
      </div>
      <div className="new-chat-content">
        {chatList.length === 0 ? (
          <div className="empty flex-center">{filterWord ? `No search result` : `No contact found`}</div>
        ) : (
          <div className="search-result-list">
            <ContactList
              hasChatEntry={true}
              list={chatList}
              clickItem={(item: ContactItemType) =>
                navigate('/setting/contacts/view', { state: { ...item, search: filterWord } })
              }
              clickChat={(_e, item) => navigate(`/chat-box/${item?.imInfo?.relationId}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
