import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { useLoading } from 'store/Provider/hooks';
import DropdownSearch from 'components/DropdownSearch';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import './index.less';
import { mockSearchRes } from '../mock';

export default function TransferOwnership() {
  const { channelUuid } = useParams();
  const { t } = useTranslation();
  const { state } = useLocation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  // TODO
  // const allMemberList = api();
  const [showMemberList, setShowMemberList] = useState<ContactItemType[]>([]);

  const handleSearch = useCallback(async (keyword: string) => {
    try {
      // TODO api
      console.log(keyword);
      // const res = await search();
      setShowMemberList(mockSearchRes);
    } catch (e) {
      console.log('===search error', e);
      setShowMemberList([]);
    }
  }, []);
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
  const renderMemberList = useMemo(
    () => (
      <div>
        {showMemberList?.map((m) => (
          <div key={m.id}>{m.name}</div>
        ))}
      </div>
    ),
    [showMemberList],
  );
  useEffect(() => {
    setFilterWord(state?.search ?? '');
    handleSearch(state?.search ?? '');
  }, [handleSearch, state?.search]);

  return (
    <div className="member-list-page flex-column">
      <div className="member-list-top">
        <SettingHeader
          title={t('Members')}
          leftCallBack={() => navigate(`/chat-group-info/${channelUuid}`)}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate(`/chat-group-info/${channelUuid}`)} />}
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
            placeholder: 'Search',
          }}
        />
      </div>
      <div className="operation-container">
        <div className="add-member" onClick={() => navigate(`/chat-group-info/${channelUuid}/member-list/add`)}>
          Add Member
        </div>
        <div className="remove-member" onClick={() => navigate(`/chat-group-info/${channelUuid}/member-list/remove`)}>
          remove
        </div>
      </div>
      <div className="member-list-container">
        {showMemberList.length !== 0 ? renderMemberList : filterWord ? 'no search result' : 'no members available'}
      </div>
    </div>
  );
}
