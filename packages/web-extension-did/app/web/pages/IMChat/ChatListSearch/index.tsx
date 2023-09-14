import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { useLoading } from 'store/Provider/hooks';
import DropdownSearch from 'components/DropdownSearch';
import { useHideChannel, useSearchChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import './index.less';
import SearchList from '../components/SearchList';
import { ISearchItem } from '../components/SearchItem';
import { IChatItemProps } from '@portkey-wallet/im-ui-web';
import { ChannelStatusEnum, ChannelTypeEnum } from '@portkey-wallet/im';
import { message } from 'antd';
import CustomModal from 'pages/components/CustomModal';

export default function ChatListSearch() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [chatList, setChatList] = useState<ISearchItem[]>([]);
  const searchChannel = useSearchChannel();
  const hideChannel = useHideChannel();

  const handleSearch = useCallback(
    async (keyword: string) => {
      if (!keyword) {
        setChatList([]);
      } else {
        try {
          const res = await searchChannel(keyword);
          const transRes = res.map((item) => ({
            id: item.channelUuid,
            index: item.displayName.slice(0, 1).toUpperCase(),
            name: item.displayName,
            addresses: [],
            modificationTime: 0,
            isDeleted: false,
            userId: '',
            isImputation: false,
            channelType: item.channelType,
            title: item.displayName,
            status: item.status,
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
    setFilterWord(state?.search || '');
    handleSearch(state?.search || '');
  }, [handleSearch, state?.search]);

  const searchDebounce = useDebounceCallback(
    async (params) => {
      setLoading(true);
      await handleSearch(params);
      setLoading(false);
    },
    [],
    500,
  );

  const handleClickChatItem = useCallback(
    (item: IChatItemProps) => {
      switch (item.channelType) {
        case ChannelTypeEnum.P2P:
          navigate(`/chat-box/${item.id}`);
          break;
        case ChannelTypeEnum.GROUP:
          if (item.status === ChannelStatusEnum.NORMAL) {
            navigate(`/chat-box-group/${item.id}`);
          } else if (item.status === ChannelStatusEnum.DISBAND) {
            CustomModal({
              content: 'This group has been deleted by the owner',
              onOk: () => hideChannel(String(item.id)),
            });
          } else if (item.status === ChannelStatusEnum.BE_REMOVED) {
            CustomModal({
              content: 'You have been removed by the group owner',
              onOk: () => hideChannel(String(item.id)),
            });
          } else {
            hideChannel(String(item.id));
          }
          break;
        default:
          message.error('Invalid chat');
      }
    },
    [hideChannel, navigate],
  );

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
              placeholder: 'Search chats',
            }}
          />
        </div>
        <div
          className="find-more flex"
          onClick={() =>
            navigate(`/setting/contacts/find-more`, { state: { search: filterWord, from: 'chat-search' } })
          }>
          <CustomSvg type="AddMorePeople" />
          Find More
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
