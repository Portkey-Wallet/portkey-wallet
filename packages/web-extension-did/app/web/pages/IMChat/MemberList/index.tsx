import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback, useEffectOnce } from '@portkey-wallet/hooks';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { Avatar } from '@portkey-wallet/im-ui-web';
import { useGroupChannelInfo, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import { ChannelMemberInfo } from '@portkey-wallet/im';
import { useLocationState, useNavigateState } from 'hooks/router';
import {
  FromPageEnum,
  TMemberListLocationState,
  TViewContactLocationState,
  TWalletNameLocationState,
} from 'types/router';
import './index.less';

export default function MemberList() {
  const { channelUuid } = useParams();
  const { relationId: myRelationId } = useRelationId();
  const { groupInfo, refresh } = useGroupChannelInfo(`${channelUuid}`);
  const { t } = useTranslation();
  const { state } = useLocationState<TMemberListLocationState>();
  const [filterWord, setFilterWord] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const navigate = useNavigateState<TWalletNameLocationState | TViewContactLocationState>();
  const [showMemberList, setShowMemberList] = useState<ChannelMemberInfo[]>(groupInfo?.members || []);

  const handleSearch = useCallback(
    (keyword: string) => {
      keyword = keyword.trim();
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
      _v ? handleSearch(_v) : setShowMemberList(groupInfo?.members || []);
      setFilterWord(_v);
    },
    [groupInfo?.members, handleSearch],
    500,
  );
  const handleGoProfile = useCallback(
    (item: ChannelMemberInfo) => {
      if (item.relationId === myRelationId) {
        navigate('/setting/wallet/wallet-name', {
          state: { previousPage: FromPageEnum.chatMemberList, channelUuid, search: filterWord },
        });
      } else {
        navigate('/setting/contacts/view', {
          state: {
            relationId: item.relationId,
            previousPage: FromPageEnum.chatMemberList,
            channelUuid,
            search: filterWord,
          },
        });
      }
    },
    [myRelationId, navigate, channelUuid, filterWord],
  );
  const renderMemberList = useMemo(
    () => (
      <div className="member-list">
        {showMemberList?.map((m) => (
          <div className="member-item flex-row-between" key={m.relationId} onClick={() => handleGoProfile(m)}>
            <div className="flex member-basic">
              <Avatar avatarSize="small" src={m.avatar} letter={m.name.slice(0, 1).toUpperCase()} />
              <div className="member-name">{m.name}</div>
            </div>
            {m.isAdmin && <div className="admin-icon flex-center">Owner</div>}
          </div>
        ))}
      </div>
    ),
    [handleGoProfile, showMemberList],
  );
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const _value = e.target.value;
      setInputValue(_value);
      searchDebounce(_value);
    },
    [searchDebounce],
  );
  useEffect(() => {
    const _v = state?.search;
    if (_v) {
      setFilterWord(_v);
      setInputValue(_v);
      handleSearch(_v);
    }
  }, [handleSearch, state?.search]);
  useEffectOnce(() => {
    refresh();
  });

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
          value={inputValue}
          inputProps={{
            onChange: handleInputChange,
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
