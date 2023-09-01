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

export default function MemberList() {
  const { channelUuid } = useParams();
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
  const handleTransfer = useCallback(() => {
    return Modal.confirm({
      width: 320,
      content: t('Transfer ownership?'),
      className: 'transfer-ownership-modal',
      autoFocusButton: null,
      icon: null,
      centered: true,
      okText: t('Confirm'),
      cancelText: t('Cancel'),
      onOk: async () => {
        try {
          //TODO await transfer();
          navigate(`/chat-box-group/${channelUuid}`);
          message.success('Owned changed');
        } catch (e) {
          message.error('Failed to delete chat');
          console.log('===transfer ownership error', e);
        }
      },
    });
  }, [channelUuid, navigate, t]);
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
    <div className="member-list-page flex-column">
      <div className="member-list-top">
        <SettingHeader
          title={t('Transfer Ownership')}
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
        {showMemberList.length !== 0 ? renderMemberList : filterWord ? 'no search result' : 'no members available'}
      </div>
      <div className="btn" onClick={handleTransfer}>
        <Button>Confirm</Button>
      </div>
    </div>
  );
}
