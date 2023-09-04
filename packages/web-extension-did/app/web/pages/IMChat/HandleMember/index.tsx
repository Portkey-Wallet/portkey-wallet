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
import './index.less';

export default function HandleMember() {
  const { channelUuid, operate } = useParams();
  const isAdd = useMemo(() => operate === 'add', [operate]);
  const { t } = useTranslation();
  const { state } = useLocation();
  const [filterWord, setFilterWord] = useState<string>('');
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  // TODO
  // const allMemberList = api();
  const [showMemberList, setShowMemberList] = useState<ContactItemType[]>([]);

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
  const handleConfirm = useCallback(() => {
    if (isAdd) {
      try {
        // TODO addMember()
        message.success('add member success');
        navigate(`/group-info/${channelUuid}`);
      } catch (e) {
        console.log('===add member error', e);
        message.error('add member failed');
      }
      return false;
    } else {
      return Modal.confirm({
        width: 320,
        content: t('Remove these members?'),
        className: 'remove-member-modal',
        autoFocusButton: null,
        icon: null,
        centered: true,
        okText: t('Confirm'),
        cancelText: t('Cancel'),
        onOk: async () => {
          try {
            // TODO removeMember()
            message.success('remove member success');
            navigate(`/group-info/${channelUuid}`);
          } catch (e) {
            console.log('===remove member error', e);
            message.error('remove member failed');
          }
        },
      });
    }
  }, [channelUuid, isAdd, navigate, t]);
  const renderMemberList = useMemo(
    () => (
      <div>
        {showMemberList?.map((m) => (
          <div key={m.id}>{m.name}</div>
        ))}
      </div>
    ),
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
          title={t(isAdd ? 'Add Members' : 'Remove Members')}
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
      <div className="handle-member-container">
        {showMemberList.length !== 0 ? renderMemberList : filterWord ? 'no search result' : 'no members available'}
      </div>
      <div className="handle-member-btn" onClick={handleConfirm}>
        <Button>{isAdd ? 'Add' : 'Remove'}</Button>
      </div>
    </div>
  );
}
