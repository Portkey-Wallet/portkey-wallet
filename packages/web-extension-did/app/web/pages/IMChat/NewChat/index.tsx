import { useCallback, useEffect, useState } from 'react';
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
import { useCreateP2pChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import singleMessage from 'utils/singleMessage';
import { useLocationState, useNavigateState } from 'hooks/router';
import { TNewChatLocationState, TViewContactLocationState } from 'types/router';
import './index.less';

export default function NewChat() {
  const { t } = useTranslation();
  const { state } = useLocationState<TNewChatLocationState>();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigateState<TViewContactLocationState>();
  const { setLoading } = useLoading();
  const [chatList, setChatList] = useState<ContactItemType[]>([]);
  const localSearch = useLocalContactSearch();
  const createChannel = useCreateP2pChannel();

  const handleSearch = useCallback(
    (keyword: string) => {
      const { contactFilterList = [] } = localSearch(keyword, ContactsTab.Chats);
      setChatList(contactFilterList);
    },
    [localSearch],
  );
  const searchDebounce = useDebounceCallback(
    (params) => {
      try {
        setLoading(true);
        handleSearch(params);
      } catch (e) {
        console.log('===handleSearch error', e);
      } finally {
        setLoading(false);
      }
    },
    [],
    500,
  );
  const handleClickChat = useCallback(
    async (e: any, item: Partial<ContactItemType>) => {
      e.stopPropagation();
      try {
        const res = await createChannel(item?.imInfo?.relationId || '');
        console.log('===create channel res', res, 'item', item);
        navigate(`/chat-box/${res.channelUuid}`);
      } catch (e) {
        console.log('===create channel error', e);
        singleMessage.error('create channel error');
      }
    },
    [createChannel, navigate],
  );
  useEffect(() => {
    const _v = state?.search;
    if (_v) {
      setFilterWord(state?.search ?? '');
      handleSearch(state?.search ?? '');
    }
  }, [handleSearch, state]);

  return (
    <div className="new-chat-page flex-column">
      <div className="new-chat-top">
        <SettingHeader
          title={t('New Chat')}
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
            placeholder: 'Name/address/Portkey ID',
          }}
        />
      </div>
      <div className="new-chat-content">
        {chatList.length === 0 ? (
          <div className="empty flex-center">{filterWord ? `No contact found` : `No contact`}</div>
        ) : (
          <div className="search-result-list">
            <ContactList
              hasChatEntry={true}
              list={chatList}
              clickItem={(item: ContactItemType) =>
                navigate('/setting/contacts/view', { state: { ...item, search: filterWord, previousPage: 'new-chat' } })
              }
              clickChat={handleClickChat}
            />
          </div>
        )}
      </div>
    </div>
  );
}
