import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { useLoading } from 'store/Provider/hooks';
import DropdownSearch from 'components/DropdownSearch';
import './index.less';

export default function ChatListSearch() {
  const { t } = useTranslation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [chatList, setChatList] = useState<[]>([]);

  const handleSearch = useCallback(async (keyword: string) => {
    if (!keyword) {
      setChatList([]);
    } else {
      setChatList([]);
    }
  }, []);

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
    <div className="chat-list-search-page flex-column">
      <div className="chat-list-search">
        <SettingHeader
          title={t('Search')}
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
            placeholder: 'Search chats',
          }}
        />
      </div>
      <div className="find-more flex">
        <CustomSvg type="AddContact" />
        Find More
      </div>
      <div className="chat-list-search-content">
        {chatList.length === 0 ? (
          <div className="search-empty flex-center">{filterWord ? 'No search result' : ''}</div>
        ) : (
          <div className="search-result-list">
            <div>Chats</div>
            {/* TODO contact list */}
          </div>
        )}
      </div>
    </div>
  );
}
