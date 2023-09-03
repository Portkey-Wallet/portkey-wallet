import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { useLoading } from 'store/Provider/hooks';
import DropdownSearch from 'components/DropdownSearch';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { mockSearchRes } from '../mock';
import { Avatar } from '@portkey-wallet/im-ui-web';
import './index.less';

export default function MemberList() {
  const { channelUuid } = useParams();
  console.log('channelUuid', channelUuid);
  const { t } = useTranslation();
  const { state } = useLocation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigate();
  // TODO
  const isAdmin = true;
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
      <div className="member-list">
        {showMemberList?.map((m) => (
          <div className="member-item flex-between" key={m.id}>
            <div className="flex member-basic">
              <Avatar width={28} height={28} letter={m.name.slice(0, 1)} />
              <div className="member-name">{m.name}</div>
            </div>
            {isAdmin && <div className="admin-icon flex-center">Owner</div>}
          </div>
        ))}
      </div>
    ),
    [isAdmin, showMemberList],
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
          leftCallBack={() => navigate(-1)}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate(-1)} />}
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
      <div className="member-list-container">
        {showMemberList.length !== 0 ? renderMemberList : filterWord ? 'no search result' : 'no members available'}
      </div>
    </div>
  );
}
