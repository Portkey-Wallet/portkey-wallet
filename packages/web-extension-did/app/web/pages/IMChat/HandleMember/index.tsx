import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { useLoading } from 'store/Provider/hooks';
import DropdownSearch from 'components/DropdownSearch';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { Button, Modal, message } from 'antd';
import { mockSearchRes } from '../mock';
import { Avatar } from '@portkey-wallet/im-ui-web';
import './index.less';

export default function HandleMember() {
  const { channelUuid, operate } = useParams();
  const { t } = useTranslation();
  const { state } = useLocation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const { setLoading } = useLoading();
  // TODO
  // const allMemberList = api();
  const [showMemberList, setShowMemberList] = useState<ContactItemType[]>([]);
  const isAdd = useMemo(() => operate === 'add', [operate]);
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
  const handleOperate = useCallback(() => {
    if (isAdd) {
      try {
        // TODO api add member
        message.success('add success');
        navigate(`/chat-box-group/${channelUuid}`);
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
            //TODO await remove member();
            navigate(`/chat-box-group/${channelUuid}`);
            message.success('remove success');
          } catch (e) {
            message.error('Failed to remove members');
            console.log('===Failed to remove members', e);
          }
        },
      });
    }
  }, [channelUuid, isAdd, navigate, t]);
  const handleSelect = useCallback(() => {
    setDisabled(false);
  }, []);
  const renderMemberList = useMemo(
    () => (
      <div className="member-list">
        {showMemberList?.map((m) => (
          <div className="member-item flex" key={m.id} onClick={handleSelect}>
            <Avatar width={28} height={28} letter={m.name.slice(0, 1)} />
            {m.name}
          </div>
        ))}
      </div>
    ),
    [handleSelect, showMemberList],
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
        {showMemberList.length !== 0 ? renderMemberList : filterWord ? 'No search found' : 'No contact result'}
      </div>
      <div className="handle-member-btn flex-center" onClick={handleOperate}>
        <Button disabled={disabled} type="primary">
          {isAdd ? 'Add' : 'Remove'}
        </Button>
      </div>
    </div>
  );
}
