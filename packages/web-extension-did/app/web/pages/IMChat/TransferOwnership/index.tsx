import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { Button } from 'antd';
import { useGroupChannelInfo, useTransferChannelOwner } from '@portkey-wallet/hooks/hooks-ca/im';
import ContactListSelect, { IContactItemSelectProps } from '../components/ContactListSelect';
import { ISelectItemType } from '../components/ContactItemSelect';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import './index.less';

export default function TransferOwnership() {
  const { channelUuid } = useParams();
  const transferOwnershipApi = useTransferChannelOwner(`${channelUuid}`);
  const { groupInfo } = useGroupChannelInfo(`${channelUuid}`);
  const { t } = useTranslation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigateState();
  const formatAllMember: IContactItemSelectProps[] = useMemo(
    () =>
      groupInfo?.members
        ?.filter((m) => !m.isAdmin)
        .map((m) => ({
          id: m.relationId,
          index: m.name?.slice(0, 1),
          name: m.name,
          avatar: m.avatar,
        })) || [],
    [groupInfo?.members],
  );
  const allMemberRef = useRef<IContactItemSelectProps[]>(formatAllMember);
  const [selected, setSelected] = useState<string>('');
  const [showMemberList, setShowMemberList] = useState<IContactItemSelectProps[]>(allMemberRef.current);

  const handleSearch = useCallback((keyword: string) => {
    const _all = allMemberRef.current;
    if (keyword) {
      const _t = _all.filter((m) => m.id === keyword || m.name?.toLowerCase().includes(keyword.toLowerCase()));
      setShowMemberList(_t);
    } else {
      setShowMemberList(_all);
    }
  }, []);
  const searchDebounce = useDebounceCallback(
    (params) => {
      const _v = params.trim();
      handleSearch(_v);
      setFilterWord(_v);
    },
    [],
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
        const target = allMemberRef.current;
        const _t = target.map((m) => ({
          ...m,
          selected: false,
        }));
        allMemberRef.current = _t;
        const _v = showMemberList.map((m) => ({
          ...m,
          selected: false,
        }));
        setShowMemberList(_v);
      } else {
        setSelected(`${item.id}`);
        const target = allMemberRef.current;
        const _t = target.map((m) => ({
          ...m,
          selected: m.id === item.id,
        }));
        allMemberRef.current = _t;
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
        <SettingHeader
          title={t('Transfer Group Ownership')}
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
      <div className="transfer-ownership-body flex-column-between">
        <div className="member-list-container">
          {showMemberList.length !== 0 ? (
            <ContactListSelect type={ISelectItemType.RADIO} list={showMemberList} clickItem={clickItem} />
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
