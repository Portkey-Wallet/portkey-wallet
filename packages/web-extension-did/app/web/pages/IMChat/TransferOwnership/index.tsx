import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import CommonHeader from 'components/CommonHeader';
import DropdownSearch from 'components/DropdownSearch';
import { Button } from 'antd';
import { useGroupChannelInfo, useTransferChannelOwner } from '@portkey-wallet/hooks/hooks-ca/im';
import ContactListSelect, { IContactItemSelectProps } from '../components/ContactListSelect';
import { ISelectItemType } from '../components/ContactItemSelect';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import { ChannelMemberInfo } from '@portkey-wallet/im';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { searchChannelMembers } from '../utils';
import { useLoading } from 'store/Provider/hooks';
import './index.less';

export default function TransferOwnership() {
  const { channelUuid } = useParams();
  const transferOwnershipApi = useTransferChannelOwner(`${channelUuid}`);
  const { groupInfo, refreshChannelMembersInfo } = useGroupChannelInfo(`${channelUuid}`);
  const { t } = useTranslation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigateState();
  const { setLoading } = useLoading();
  const [selected, setSelected] = useState<string>('');
  const formatMemberList = useCallback(
    (data: ChannelMemberInfo[]) => {
      return data
        .filter((m) => !m.isAdmin)
        .map((m) => ({
          id: m.relationId,
          index: m.name?.slice(0, 1),
          name: m.name,
          avatar: m.avatar,
          selected: selected === m.relationId,
        }));
    },
    [selected],
  );
  const allMemberList = useMemo(() => {
    return formatMemberList(groupInfo?.members || []);
  }, [formatMemberList, groupInfo?.members]);
  const [showMemberList, setShowMemberList] = useState<IContactItemSelectProps[]>(allMemberList);
  const hasMoreMember = useMemo(
    () => (groupInfo?.members?.length ?? 0) < (groupInfo?.totalCount ?? 0),
    [groupInfo?.members?.length, groupInfo?.totalCount],
  );

  useEffect(() => {
    if (!filterWord) {
      setShowMemberList(allMemberList);
    }
  }, [allMemberList, filterWord]);

  const fetchMoreMembers = useCallback(async () => {
    if ((groupInfo?.members?.length ?? 0) === (groupInfo?.totalCount ?? 0)) return;
    await refreshChannelMembersInfo(groupInfo?.members?.length);
  }, [groupInfo?.members?.length, groupInfo?.totalCount, refreshChannelMembersInfo]);

  const handleSearch = useCallback(
    async (keyword: string) => {
      if (keyword) {
        try {
          setLoading(true);
          const { data } = await searchChannelMembers({ channelUuid: `${channelUuid}`, keyword });
          setShowMemberList(formatMemberList(data.members));
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log('===searchChannelMembers error', error);
        }
      } else {
        setShowMemberList(allMemberList);
      }
    },
    [allMemberList, channelUuid, formatMemberList, setLoading],
  );
  const searchDebounce = useDebounceCallback(
    (params) => {
      const _v = params.trim();
      handleSearch(_v);
      setFilterWord(_v);
    },
    [handleSearch],
    500,
  );
  const handleTransfer = useCallback(() => {
    CustomModalConfirm({
      content: t('Are you sure to transfer group ownership to others?'),
      okText: t('Yes'),
      cancelText: t('No'),
      onOk: async () => {
        try {
          await transferOwnershipApi(selected);
          navigate(-1);
          singleMessage.success('Owner changed');
        } catch (e) {
          singleMessage.error('Failed to transfer ownership');
          console.log('===transfer ownership error', e);
        }
      },
    });
  }, [navigate, selected, t, transferOwnershipApi]);
  const clickItem = useCallback(
    (item: IContactItemSelectProps) => {
      if (item.selected) {
        setSelected('');
        const _v = showMemberList.map((m) => ({
          ...m,
          selected: false,
        }));
        setShowMemberList(_v);
      } else {
        setSelected(`${item.id}`);
        const _v = showMemberList.map((m) => ({
          ...m,
          selected: m.id === item.id,
        }));
        setShowMemberList(_v);
      }
    },
    [showMemberList],
  );
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const _value = e.target.value;
      searchDebounce(_value);
    },
    [searchDebounce],
  );
  return (
    <div className="transfer-ownership-page flex-column-between">
      <div className="transfer-ownership-top">
        <CommonHeader title={t('Transfer Group Ownership')} onLeftBack={() => navigate(-1)} />
        <DropdownSearch
          overlay={<></>}
          inputProps={{
            onChange: handleInputChange,
            placeholder: 'Search',
          }}
        />
      </div>
      <div className="transfer-ownership-body flex-column-between">
        <div className="member-list-container">
          {showMemberList.length !== 0 ? (
            <>
              <ContactListSelect type={ISelectItemType.RADIO} list={showMemberList} clickItem={clickItem} />
              {!filterWord && <LoadingMore hasMore={hasMoreMember} loadMore={fetchMoreMembers} className="load-more" />}
            </>
          ) : (
            <div className="member-list-empty flex-center">{filterWord ? 'No search result' : 'No member'}</div>
          )}
        </div>
        <div className="transfer-ownership-btn flex-center" onClick={handleTransfer}>
          <Button disabled={!selected} type="primary">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
