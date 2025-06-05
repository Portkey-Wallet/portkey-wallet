import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback, useEffectOnce } from '@portkey-wallet/hooks';
import CommonHeader from 'components/CommonHeader';
import DropdownSearch from 'components/DropdownSearch';
import { Button } from 'antd';
import { useGroupChannelInfo, useRemoveChannelMembers } from '@portkey-wallet/hooks/hooks-ca/im';
import ContactListSelect, { IContactItemSelectProps } from '../../components/ContactListSelect';
import { ChannelMemberInfo } from '@portkey-wallet/im';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { searchChannelMembers } from '../../utils';
import { useLoading } from 'store/Provider/hooks';

export default function RemoveMember() {
  const { channelUuid } = useParams();
  const { t } = useTranslation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigateState();
  const { groupInfo, refreshChannelMembersInfo, refresh } = useGroupChannelInfo(`${channelUuid}`);
  const removeMemberApi = useRemoveChannelMembers(`${channelUuid}`);
  const [selectMember, setSelectMember] = useState<ChannelMemberInfo[]>([]);
  const { setLoading } = useLoading();
  const formatMemberToRemove = useCallback(
    (data: ChannelMemberInfo[]) => {
      return (
        data
          .filter((m) => !m.isAdmin)
          .map((m) => ({
            ...m,
            id: m.relationId,
            index: m.name.slice(0, 1),
            selected: selectMember.some((v) => v.relationId === m.relationId),
          })) || []
      );
    },
    [selectMember],
  );
  const allMemberList = useMemo(() => {
    return formatMemberToRemove(groupInfo?.members || []);
  }, [formatMemberToRemove, groupInfo]);
  const [showMemberList, setShowMemberList] = useState<IContactItemSelectProps[]>(allMemberList);
  const hasMoreMember = useMemo(() => {
    return (groupInfo?.members?.length ?? 0) < (groupInfo?.totalCount ?? 0);
  }, [groupInfo?.members?.length, groupInfo?.totalCount]);

  useEffectOnce(() => {
    refresh();
  });

  useEffect(() => {
    if (!filterWord) {
      setShowMemberList(allMemberList);
    }
  }, [allMemberList, filterWord]);

  const fetchMoreMembers = useCallback(async () => {
    try {
      if ((groupInfo?.members?.length ?? 0) === (groupInfo?.totalCount ?? 0)) return;
      await refreshChannelMembersInfo(groupInfo?.members?.length);
    } catch (error) {
      console.log('===fetchMoreMembers error', error);
    }
  }, [groupInfo?.members?.length, groupInfo?.totalCount, refreshChannelMembersInfo]);

  const handleSearch = useCallback(
    async (keyword: string) => {
      try {
        setLoading(true);
        const { data } = await searchChannelMembers({ channelUuid: `${channelUuid}`, keyword });
        const res = formatMemberToRemove(data.members);
        setShowMemberList(res);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log('===handleSearch error', error);
      }
    },
    [channelUuid, formatMemberToRemove, setLoading],
  );
  const searchDebounce = useDebounceCallback(
    (params) => {
      const _v = params.trim();
      _v ? handleSearch(_v) : setShowMemberList(allMemberList || []);
      setFilterWord(_v);
    },
    [allMemberList, handleSearch],
    500,
  );
  const handleOperate = useCallback(async () => {
    return CustomModalConfirm({
      content: t('Remove these members from the group?'),
      okText: t('Yes'),
      cancelText: t('No'),
      onOk: async () => {
        try {
          await removeMemberApi(selectMember.map((item) => item.relationId) || []);
          navigate(-1);
        } catch (e) {
          singleMessage.error('Failed to remove members');
          console.log('===Failed to remove members', e);
        }
      },
    });
  }, [navigate, removeMemberApi, selectMember, t]);
  const clickItem = useCallback(
    (item: IContactItemSelectProps) => {
      if (selectMember.some((m) => m.relationId === item.id)) {
        setSelectMember((pre) => pre.filter((m) => m.relationId !== item.id));
      } else {
        setSelectMember((pre) => [
          ...pre,
          {
            isAdmin: false,
            name: item.name || '',
            relationId: item.id || '',
            avatar: item.avatar || '',
          },
        ]);
      }
      const _v = showMemberList.map((m) => {
        if (m.id === item.id) {
          return {
            ...m,
            selected: !m.selected,
          };
        } else {
          return m;
        }
      });
      setShowMemberList(_v);
    },
    [selectMember, showMemberList],
  );
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const _value = e.target.value;
      searchDebounce(_value);
    },
    [searchDebounce],
  );
  return (
    <div className="handle-member-page flex-column-between">
      <div className="handle-member-top">
        <CommonHeader title={t(`Remove Members`)} onLeftBack={() => navigate(-1)} />
        <DropdownSearch
          overlay={<></>}
          inputProps={{
            onChange: handleInputChange,
            placeholder: 'Search',
          }}
        />
      </div>
      <div className="handle-member-body flex-column-between">
        <div className="member-list-container">
          {showMemberList.length !== 0 ? (
            <>
              <ContactListSelect list={showMemberList} clickItem={clickItem} />
              {!filterWord && <LoadingMore hasMore={hasMoreMember} loadMore={fetchMoreMembers} className="load-more" />}
            </>
          ) : (
            <div className="flex-center member-list-empty">{filterWord ? 'No contact result' : 'No contact'}</div>
          )}
        </div>
        <div className="handle-member-btn flex-center" onClick={handleOperate}>
          <Button disabled={!selectMember.length} type="primary">
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
