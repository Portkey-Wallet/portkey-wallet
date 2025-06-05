import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CommonHeader from 'components/CommonHeader';
import DropdownSearch from 'components/DropdownSearch';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { useNavigateState } from 'hooks/router';
import { TViewContactLocationState } from 'types/router';
import './index.less';

export default function NewChat() {
  const { t } = useTranslation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigateState<TViewContactLocationState>();
  const [chatList] = useState<ContactItemType[]>([]);

  return (
    <div className="new-chat-page flex-column">
      <div className="new-chat-top">
        <CommonHeader title={t('New Chat')} onLeftBack={() => navigate('/chat-list')} />
        <DropdownSearch
          overlay={<></>}
          value={filterWord}
          inputProps={{
            onChange: (e) => {
              const _value = e.target.value.trim();
              setFilterWord(_value);
            },
            placeholder: 'Name/address',
          }}
        />
      </div>
      <div className="new-chat-content">
        {chatList.length === 0 ? (
          <div className="empty flex-center">{filterWord ? `No contact found` : `No contact`}</div>
        ) : (
          <div className="search-result-list"></div>
        )}
      </div>
    </div>
  );
}
