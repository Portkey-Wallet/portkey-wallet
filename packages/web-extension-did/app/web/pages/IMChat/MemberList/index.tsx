import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { Avatar } from '@portkey-wallet/im-ui-web';
import { useGroupChannelInfo, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import { ChannelMemberInfo } from '@portkey-wallet/im';
import './index.less';

export default function MemberList() {
  const { channelUuid } = useParams();
  const myRelationId = useRelationId();
  const { groupInfo, refresh } = useGroupChannelInfo(`${channelUuid}`);
  const { t } = useTranslation();
  const { state } = useLocation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigate();
  const [showMemberList, setShowMemberList] = useState<ChannelMemberInfo[]>(groupInfo?.members || []);

  const handleSearch = useCallback(
    (keyword: string) => {
      let _res = groupInfo?.members || [];
      if (keyword) {
        _res = (groupInfo?.members || []).filter((item) => item.name.toLowerCase().includes(keyword.toLowerCase()));
      }
      setShowMemberList(_res);
    },
    [groupInfo?.members],
  );
  const searchDebounce = useDebounceCallback(
    (params) => {
      const _v = params.trim();
      setFilterWord(_v);
      handleSearch(_v);
    },
    [],
    500,
  );
  const handleGoProfile = useCallback(
    (item: ChannelMemberInfo) => {
      if (item.relationId === myRelationId) {
        navigate('/setting/wallet/wallet-name', {
          state: { from: 'chat-member-list', channelUuid, search: filterWord },
        });
      } else {
        navigate('/setting/contacts/view', {
          state: { relationId: item.relationId, from: 'chat-member-list', channelUuid, search: filterWord },
        });
      }
    },
    [myRelationId, navigate, channelUuid, filterWord],
  );
  const renderMemberList = useMemo(
    () => (
      <div className="member-list">
        {showMemberList?.map((m) => (
          <div className="member-item flex-between" key={m.relationId} onClick={() => handleGoProfile(m)}>
            <div className="flex member-basic">
              <Avatar width={28} height={28} letter={m.name.slice(0, 1).toUpperCase()} />
              <div className="member-name">{m.name}</div>
            </div>
            {m.isAdmin && <div className="admin-icon flex-center">Owner</div>}
          </div>
        ))}
      </div>
    ),
    [handleGoProfile, showMemberList],
  );
  useEffect(() => {
    setFilterWord(state?.search ?? '');
    handleSearch(state?.search ?? '');
  }, [handleSearch, state?.search]);
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="member-list-page flex-column-between">
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
              const _v = e.target.value;
              setFilterWord(_v);
              searchDebounce(_v);
            },
            placeholder: 'Search',
          }}
        />
      </div>
      <div className="member-list-container">
        {showMemberList.length !== 0 ? (
          renderMemberList
        ) : (
          <div className="empty flex-center">{filterWord ? 'No search result' : 'No members'}</div>
        )}
      </div>
    </div>
  );
}
