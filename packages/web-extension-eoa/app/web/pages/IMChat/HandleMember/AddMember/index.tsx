import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback, useEffectOnce } from '@portkey-wallet/hooks';
import CommonHeader from 'components/CommonHeader';
import DropdownSearch from 'components/DropdownSearch';
import { Button } from 'antd';
import { useAddChannelMembers } from '@portkey-wallet/hooks/hooks-ca/im';
import ContactListSelect, { IContactItemSelectProps } from '../../components/ContactListSelect';
import { ChannelMemberInfo, IChannelContactItem } from '@portkey-wallet/im';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { fetchChannelContactList } from '../../utils';
import { useLoading } from 'store/Provider/hooks';
import { SEARCH_MEMBER_LIST_LIMIT, MEMBER_LIST_LIMIT } from '@portkey-wallet/constants/constants-ca/im';

export default function AddMember() {
  const { channelUuid } = useParams();
  const { t } = useTranslation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigateState();
  const [contact, setContact] = useState<IChannelContactItem[]>([]);
  const [contactTotalCount, setContactTotalCount] = useState(0);
  const addMemberApi = useAddChannelMembers(`${channelUuid}`);
  const [selectMember, setSelectMember] = useState<ChannelMemberInfo[]>([]);
  const { setLoading } = useLoading();
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
    return formatMemberToAdd(contact);
  }, [contact, formatMemberToAdd]);
  const [showMemberList, setShowMemberList] = useState<IContactItemSelectProps[]>(allMemberList);
  const hasMoreMember = useMemo(() => {
    return contact.length < contactTotalCount;
  }, [contact.length, contactTotalCount]);

  const initContactList = useCallback(async () => {
    try {
      const data = await fetchChannelContactList({
        channelUuid: `${channelUuid}`,
        skipCount: 0,
        maxResultCount: MEMBER_LIST_LIMIT,
      });
      setContact(data?.contacts || []);
      setContactTotalCount(data.totalCount);
    } catch (error) {
      console.log('===initContactList error', error);
    }
  }, [channelUuid]);

  useEffectOnce(() => {
    initContactList();
  });

  useEffect(() => {
    if (!filterWord) {
      setShowMemberList(allMemberList);
    }
  }, [allMemberList, filterWord]);

  const fetchMoreMembers = useCallback(async () => {
    try {
      if (contact.length === contactTotalCount) return;
      const data = await fetchChannelContactList({
        channelUuid: `${channelUuid}`,
        skipCount: contact.length,
        maxResultCount: MEMBER_LIST_LIMIT,
      });
      setContact((pre) => [...pre, ...data.contacts]);
      setContactTotalCount(data.totalCount);
    } catch (error) {
      console.log('===fetchMoreMembers error', error);
    }
  }, [channelUuid, contact.length, contactTotalCount]);

  const handleSearch = useCallback(
    async (keyword: string) => {
      try {
        setLoading(true);
        const data = await fetchChannelContactList({
          channelUuid: `${channelUuid}`,
          keyword,
          skipCount: 0,
          maxResultCount: SEARCH_MEMBER_LIST_LIMIT,
        });
        const res = formatMemberToAdd(data.contacts);
        setShowMemberList(res);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log('===handleSearch error', error);
      }
    },
    [channelUuid, formatMemberToAdd, setLoading],
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
    try {
      await addMemberApi(selectMember);
      navigate(-1);
    } catch (e) {
      singleMessage.error('Failed to add members');
      console.log('===Failed to add members', e);
    }
    return false;
  }, [addMemberApi, navigate, selectMember]);
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
        <CommonHeader title={t(`Add Members`)} onLeftBack={() => navigate(-1)} />
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
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
