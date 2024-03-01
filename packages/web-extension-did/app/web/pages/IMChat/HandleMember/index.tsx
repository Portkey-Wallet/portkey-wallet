import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { Button } from 'antd';
import { useAddChannelMembers, useGroupChannelInfo, useRemoveChannelMembers } from '@portkey-wallet/hooks/hooks-ca/im';
import { useChatContactFlatList } from '@portkey-wallet/hooks/hooks-ca/contact';
import ContactListSelect, { IContactItemSelectProps } from '../components/ContactListSelect';
import { ChannelMemberInfo } from '@portkey-wallet/im';
import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import './index.less';

export default function HandleMember() {
  const { channelUuid, operate } = useParams();
  const { t } = useTranslation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigateState();
  const [disabled, setDisabled] = useState(true);
  const allChatContact = useChatContactFlatList();
  const { groupInfo } = useGroupChannelInfo(`${channelUuid}`);
  const isAdd = useMemo(() => operate === 'add', [operate]);
  const addMemberApi = useAddChannelMembers(`${channelUuid}`);
  const removeMemberApi = useRemoveChannelMembers(`${channelUuid}`);
  const selectedContactRef = useRef<ChannelMemberInfo[]>([]);
  const formatAllChatContact: IContactItemSelectProps[] = useMemo(() => {
    if (isAdd) {
      return allChatContact.map((m) => {
        const isMember = groupInfo?.members.some((item) => item.relationId === m.imInfo?.relationId);
        return {
          ...m,
          selected: isMember,
          disable: isMember,
        };
      });
    } else {
      return (
        groupInfo?.members
          .filter((m) => !m.isAdmin)
          .map((m) => ({
            name: m.name,
            id: m.relationId,
            index: m.name.slice(0, 1),
            avatar: m.avatar,
          })) || []
      );
    }
  }, [allChatContact, groupInfo?.members, isAdd]);
  const allContactRef = useRef<IContactItemSelectProps[]>(formatAllChatContact);
  const [showMemberList, setShowMemberList] = useState<IContactItemSelectProps[]>(formatAllChatContact);

  const handleSearch = useCallback(
    (keyword: string) => {
      let res: IContactItemSelectProps[] = [];
      if (isAdd) {
        if (keyword.length <= 16) {
          // name search
          const _v = keyword.toLowerCase();
          res = allContactRef.current.filter((m) => {
            if (m?.caHolderInfo?.walletName) {
              return (
                m?.name?.trim().toLowerCase().includes(_v) ||
                m?.caHolderInfo?.walletName?.trim().toLowerCase().includes(_v)
              );
            } else {
              return m?.name?.trim().toLowerCase().includes(_v) || m?.imInfo?.name?.trim().toLowerCase().includes(_v);
            }
          });
        } else {
          // Portkey ID search
          res.push(...allContactRef.current.filter((m) => m?.imInfo?.portkeyId?.trim() === keyword.trim()));
          // Address search
          let suffix = '';
          if (keyword.includes('_')) {
            const arr = keyword.split('_');
            if (!isAelfAddress(arr[arr.length - 1])) {
              suffix = arr[arr.length - 1];
            }
          }
          const _v = getAelfAddress(keyword);
          res.push(
            ...allContactRef.current.filter((m) =>
              m?.addresses?.some((ads) => ads.address === _v && (!suffix || suffix === ads.chainId)),
            ),
          );
        }
      } else {
        const _v = keyword.toLowerCase();
        res = allContactRef.current.filter((m) => m.name?.toLowerCase().includes(_v));
      }
      setShowMemberList(res);
    },
    [isAdd],
  );
  const searchDebounce = useDebounceCallback(
    (params) => {
      const _v = params.trim();
      _v ? handleSearch(_v) : setShowMemberList(allContactRef.current || []);
      setFilterWord(_v);
    },
    [handleSearch],
    500,
  );
  const handleOperate = useCallback(async () => {
    if (isAdd) {
      try {
        await addMemberApi(selectedContactRef.current!);
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
            await removeMemberApi(selectedContactRef.current?.map((item) => item.relationId) || []);
            navigate(-1);
          } catch (e) {
            singleMessage.error('Failed to remove members');
            console.log('===Failed to remove members', e);
          }
        },
      });
    }
  }, [addMemberApi, isAdd, navigate, removeMemberApi, t]);
  const clickAddItem = useCallback(
    (item: IContactItemSelectProps) => {
      const target = selectedContactRef?.current || [];
      if (target?.some((m) => m.relationId === item.imInfo?.relationId)) {
        selectedContactRef.current = target.filter((m) => m.relationId !== item.imInfo?.relationId);
      } else {
        target.push({
          isAdmin: false,
          name: item.name || '',
          relationId: item.imInfo?.relationId || '',
          avatar: item.avatar || '',
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
  const clickRemoveItem = useCallback(
    (item: IContactItemSelectProps) => {
      const target = selectedContactRef?.current || [];
      if (target?.some((m) => m.relationId === item.id)) {
        selectedContactRef.current = target.filter((m) => m.relationId !== item.id);
      } else {
        target.push({
          isAdmin: false,
          name: item.name || '',
          relationId: item.id || '',
          avatar: item.avatar || '',
        });
        selectedContactRef.current = target;
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
      allContactRef.current.forEach((m) => {
        if (m.id === item.id) {
          m.selected = !m.selected;
        }
      });
      setDisabled(!selectedContactRef?.current?.length);
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
            <ContactListSelect list={showMemberList} clickItem={isAdd ? clickAddItem : clickRemoveItem} />
          ) : (
            <div className="flex-center member-list-empty">{filterWord ? 'No contact result' : 'No contact'}</div>
          )}
        </div>
        <div className="handle-member-btn flex-center" onClick={handleOperate}>
          <Button disabled={disabled} type="primary">
            {isAdd ? 'Add' : 'Remove'}
          </Button>
        </div>
      </div>
    </div>
  );
}
