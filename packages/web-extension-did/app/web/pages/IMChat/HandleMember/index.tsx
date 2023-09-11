import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { Button, Modal, message } from 'antd';
import { useAddChannelMembers, useGroupChannelInfo, useRemoveChannelMembers } from '@portkey-wallet/hooks/hooks-ca/im';
import { useChatContactFlatList } from '@portkey-wallet/hooks/hooks-ca/contact';
import ContactListSelect, { IContactItemSelectProps } from '../components/ContactListSelect';
import { ChannelMemberInfo } from '@portkey-wallet/im';
import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import './index.less';

export default function HandleMember() {
  const { channelUuid, operate } = useParams();
  const { t } = useTranslation();
  const { state } = useLocation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const allChatContact = useChatContactFlatList();
  const { groupInfo } = useGroupChannelInfo(`${channelUuid}`);
  const addMemberApi = useAddChannelMembers(`${channelUuid}`);
  const removeMemberApi = useRemoveChannelMembers(`${channelUuid}`);
  const selectedContactRef = useRef<ChannelMemberInfo[]>([]);
  const formatChatContact: IContactItemSelectProps[] = useMemo(
    () =>
      allChatContact.map((m) => ({
        ...m,
        selected: groupInfo?.members.some((item) => item.relationId === m.imInfo?.relationId),
        disable: groupInfo?.members.some((item) => item.relationId === m.imInfo?.relationId),
      })),
    [allChatContact, groupInfo?.members],
  );
  const allContactRef = useRef<IContactItemSelectProps[]>(formatChatContact);
  const [showMemberList, setShowMemberList] = useState<IContactItemSelectProps[]>(formatChatContact);
  const isAdd = useMemo(() => operate === 'add', [operate]);
  const handleSearch = useCallback((keyword: string) => {
    const res: IContactItemSelectProps[] = [];
    if (keyword.length <= 16) {
      const _v = keyword.trim().toLowerCase();
      allContactRef.current.forEach((m) => {
        if (m?.caHolderInfo?.walletName) {
          if (
            m?.name?.trim().toLowerCase().includes(_v) ||
            m?.caHolderInfo?.walletName?.trim().toLowerCase().includes(_v)
          ) {
            res.push(m);
          }
        } else {
          if (m?.name?.trim().toLowerCase().includes(_v) || m?.imInfo?.name?.trim().toLowerCase().includes(_v)) {
            res.push(m);
          }
        }
      });
    } else {
      // Portkey ID search
      allContactRef.current.forEach((m) => {
        if (m?.imInfo?.portkeyId?.trim() === keyword.trim()) {
          res.push(m);
        }
      });
      // Address search
      let suffix = '';
      if (keyword.includes('_')) {
        const arr = keyword.split('_');
        if (!isAelfAddress(arr[arr.length - 1])) {
          suffix = arr[arr.length - 1];
        }
      }
      keyword = getAelfAddress(keyword);
      allContactRef.current.forEach((m) => {
        if (m.addresses.some((ads) => ads.address === keyword && (!suffix || suffix === ads.chainId))) {
          res.push(m);
        }
      });
    }
    setShowMemberList(res);
  }, []);
  const searchDebounce = useDebounceCallback(
    (params) => {
      const _v = params.trim();
      _v ? handleSearch(_v) : setShowMemberList(allContactRef.current || []);
    },
    [],
    500,
  );
  const handleOperate = useCallback(async () => {
    if (isAdd) {
      try {
        await addMemberApi(selectedContactRef.current!);
        navigate(-1);
      } catch (e) {
        message.error('Failed to add members');
        console.log('===Failed to add members', e);
      }
      return false;
    } else {
      return Modal.confirm({
        width: 320,
        content: t('Remove the group?'),
        className: 'remove-group-modal',
        autoFocusButton: null,
        icon: null,
        centered: true,
        okText: t('Yes'),
        cancelText: t('No'),
        onOk: async () => {
          try {
            await removeMemberApi(selectedContactRef.current?.map((item) => item.relationId) || []);
            navigate(-1);
          } catch (e) {
            message.error('Failed to remove members');
            console.log('===Failed to remove members', e);
          }
        },
      });
    }
  }, [addMemberApi, isAdd, navigate, removeMemberApi, t]);
  const clickItem = useCallback(
    (item: IContactItemSelectProps) => {
      const target = selectedContactRef?.current || [];
      if (target?.some((m) => m.relationId === item.imInfo?.relationId)) {
        selectedContactRef.current = target.filter((m) => m.relationId !== item.imInfo?.relationId);
      } else {
        target.push({
          isAdmin: false,
          name: item.name,
          relationId: item.imInfo?.relationId || '',
          avatar: '',
        });
        selectedContactRef.current = target;
      }
      const _v = showMemberList.map((m) => {
        if (m.imInfo?.relationId === item.imInfo?.relationId) {
          return {
            ...m,
            selected: !m.selected,
          };
        } else {
          return m;
        }
      });
      setShowMemberList(_v);
      allContactRef.current.forEach((m) => {
        if (m.imInfo?.relationId === item.imInfo?.relationId) {
          m.selected = !m.selected;
        }
      });
      setDisabled(!selectedContactRef?.current?.length);
    },
    [showMemberList],
  );
  useEffect(() => {
    setFilterWord(state?.search ?? '');
    handleSearch(state?.search ?? '');
  }, [handleSearch, state?.search]);

  return (
    <div className="handle-member-page flex-column">
      <div className="handle-member-top">
        <SettingHeader
          title={t(`${isAdd ? 'Add' : 'Remove'} Members`)}
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
        {showMemberList.length !== 0 ? (
          <ContactListSelect list={showMemberList} clickItem={clickItem} />
        ) : (
          <div className="empty">{filterWord ? 'No search found' : 'No contact result'}</div>
        )}
      </div>
      <div className="handle-member-btn flex-center" onClick={handleOperate}>
        <Button disabled={disabled} type="primary">
          {isAdd ? 'Add' : 'Remove'}
        </Button>
      </div>
    </div>
  );
}
