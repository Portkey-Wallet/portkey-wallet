import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { useLoading } from 'store/Provider/hooks';
import DropdownSearch from 'components/DropdownSearch';
import { useSearchChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import './index.less';
import SearchList from '../components/SearchList';
import { ISearchItem } from '../components/SearchItem';
import { useHandleClickChatItem } from 'hooks/im';
import { useLocationState, useNavigateState } from 'hooks/router';
import { FromPageEnum, TChatListSearchLocationState, TFindMoreLocationState } from 'types/router';

export default function ChatListSearch() {
  const { t } = useTranslation();
  const { state } = useLocationState<TChatListSearchLocationState>();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigateState<TFindMoreLocationState>();
  const { setLoading } = useLoading();
  const [chatList, setChatList] = useState<ISearchItem[]>([]);
  const searchChannel = useSearchChannel();

  const handleSearch = useCallback(
    async (keyword: string) => {
      if (!keyword) {
        setChatList([]);
      } else {
        try {
          const res = await searchChannel(keyword);
          const transRes = res.map((item) => ({
            ...item,
            id: item.channelUuid,
            index: item.displayName.slice(0, 1).toUpperCase(),
            name: item.displayName,
            addresses: [],
            modificationTime: 0,
            isDeleted: false,
            userId: '',
            isImputation: false,
            title: item.displayName,
          }));
          setChatList(transRes);
        } catch (e) {
          setChatList([]);
        }
      }
    },
    [searchChannel],
  );

  useEffect(() => {
    const _search = state?.search;
    if (_search) {
      setFilterWord(_search);
      handleSearch(_search);
    }
  }, [handleSearch, state]);

  const searchDebounce = useDebounceCallback(
    async (params) => {
      setLoading(true);
      await handleSearch(params);
      setLoading(false);
    },
    [handleSearch, setLoading],
    500,
  );

  const handleClickChatItem = useHandleClickChatItem();

  return (
    <div className="chat-list-search-page flex-column">
      <div className="chat-list-header">
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
                const _value = e.target.value.trim();
                setFilterWord(_value);
                searchDebounce(_value);
              },
              placeholder: 'Name in Chats',
            }}
          />
        </div>
        <div
          className="find-more flex"
          onClick={() =>
            navigate(`/setting/contacts/find-more`, {
              state: { search: filterWord, previousPage: FromPageEnum.chatSearch },
            })
          }>
          <CustomSvg type="AddMorePeople" />
          Find People
        </div>
      </div>
      <div className="chat-list-search-content">
        {chatList.length === 0 ? (
          <div className="search-empty flex-center">{filterWord ? 'No search result' : ''}</div>
        ) : (
          <div className="search-result-list">
            <div className="chat-title-text">Chats</div>
            <SearchList list={chatList} clickItem={(item) => handleClickChatItem(item)} />
          </div>
        )}
      </div>
    </div>
  );
}
