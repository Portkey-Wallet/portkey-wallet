import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback, useEffectOnce } from '@portkey-wallet/hooks';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { Button } from 'antd';
import { useAddChannelMembers, useGroupChannelInfo, useRemoveChannelMembers } from '@portkey-wallet/hooks/hooks-ca/im';
import ContactListSelect, { IContactItemSelectProps } from '../components/ContactListSelect';
import { ChannelMemberInfo, IChannelContactItem } from '@portkey-wallet/im';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { fetchChannelContactList, searchChannelMembers } from '../utils';
import { useLoading } from 'store/Provider/hooks';
import { SEARCH_MEMBER_LIST_LIMIT, MEMBER_LIST_LIMIT } from '@portkey-wallet/constants/constants-ca/im';
import './index.less';

export default function HandleMember() {
  const { channelUuid, operate } = useParams();
  const { t } = useTranslation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigateState();
  const { groupInfo, refreshChannelMembersInfo, refresh } = useGroupChannelInfo(`${channelUuid}`);
  const [contact, setContact] = useState<IChannelContactItem[]>([]);
  const [contactTotalCount, setContactTotalCount] = useState(groupInfo?.totalCount ?? 0);
  const isAdd = useMemo(() => operate === 'add', [operate]);
  const addMemberApi = useAddChannelMembers(`${channelUuid}`);
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
  const formatMemberToAdd = useCallback(
    (data: IChannelContactItem[]) => {
      return data.map((m) => ({
        ...m,
        id: m.imInfo?.relationId,
        index: m.name.slice(0, 1),
        disable: m.isGroupMember,
        selected: selectMember.some((v) => v.relationId === m.imInfo?.relationId),
      }));
    },
    [selectMember],
  );
  const allMemberList = useMemo(() => {
    if (isAdd) {
      return formatMemberToAdd(contact);
    } else {
      return formatMemberToRemove(groupInfo?.members || []);
    }
  }, [contact, formatMemberToAdd, formatMemberToRemove, groupInfo, isAdd]);
  const [showMemberList, setShowMemberList] = useState<IContactItemSelectProps[]>(allMemberList);
  const hasMoreMember = useMemo(() => {
    if (isAdd) {
      return contact.length < contactTotalCount;
    } else {
      return (groupInfo?.members?.length ?? 0) < (groupInfo?.totalCount ?? 0);
    }
  }, [contact.length, groupInfo?.members?.length, groupInfo?.totalCount, isAdd, contactTotalCount]);

  const initContactList = useCallback(async () => {
    try {
      const data = await fetchChannelContactList({ channelUuid: `${channelUuid}`, maxResultCount: MEMBER_LIST_LIMIT });
      setContact(data?.contacts || []);
      setContactTotalCount(data.totalCount);
    } catch (error) {
      console.log('===initContactList error', error);
    }
  }, [channelUuid]);

  useEffectOnce(() => {
    if (isAdd) {
      initContactList();
    } else {
      refresh();
    }
  });

  useEffect(() => {
    if (!filterWord) {
      setShowMemberList(allMemberList);
    }
  }, [allMemberList, filterWord]);

  const fetchMoreMembers = useCallback(async () => {
    try {
      if (isAdd) {
        if (contact.length === contactTotalCount) return;
        const data = await fetchChannelContactList({
          channelUuid: `${channelUuid}`,
          skipCount: groupInfo?.members?.length,
          maxResultCount: MEMBER_LIST_LIMIT,
        });
        setContact((pre) => [...pre, ...data.contacts]);
        setContactTotalCount(data.totalCount);
      } else {
        if ((groupInfo?.members?.length ?? 0) === (groupInfo?.totalCount ?? 0)) return;
        await refreshChannelMembersInfo(groupInfo?.members?.length);
      }
    } catch (error) {
      console.log('===fetchMoreMembers error', error);
    }
  }, [
    channelUuid,
    contact.length,
    contactTotalCount,
    groupInfo?.members.length,
    groupInfo?.totalCount,
    isAdd,
    refreshChannelMembersInfo,
  ]);

  const handleSearch = useCallback(
    async (keyword: string) => {
      let res: IContactItemSelectProps[] = [];
      try {
        setLoading(true);
        if (isAdd) {
          const data = await fetchChannelContactList({
            channelUuid: `${channelUuid}`,
            keyword,
            skipCount: 0,
            maxResultCount: SEARCH_MEMBER_LIST_LIMIT,
          });
          res = formatMemberToAdd(data.contacts);
        } else {
          const { data } = await searchChannelMembers({ channelUuid: `${channelUuid}`, keyword });
          res = formatMemberToRemove(data.members);
        }
        setShowMemberList(res);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log('===handleSearch error', error);
      }
    },
    [channelUuid, formatMemberToAdd, formatMemberToRemove, isAdd, setLoading],
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
    if (isAdd) {
      try {
        await addMemberApi(selectMember);
        navigate(-1);
      } catch (e) {
        singleMessage.error('Failed to add members');
        console.log('===Failed to add members', e);
      }
      return false;
    } else {
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
    }
  }, [addMemberApi, isAdd, navigate, removeMemberApi, selectMember, t]);
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
        <SettingHeader
          title={t(`${isAdd ? 'Add' : 'Remove'} Members`)}
          leftCallBack={() => navigate(-1)}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate(-1)} />}
        />
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
            {isAdd ? 'Add' : 'Remove'}
          </Button>
        </div>
      </div>
    </div>
  );
}
