import SettingHeader from 'pages/components/SettingHeader';
import './index.less';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button, Form, Input, message } from 'antd';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import ContactsSearchInput from 'pages/Contacts/components/ContactsSearchInput';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
import { useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contact';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import ContactList from 'pages/Contacts/components/ContactList';
import { handleErrorMessage } from '@portkey-wallet/utils';

const { Item: FormItem } = Form;

export default function CreateChatGroup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const localSearch = useLocalContactSearch();
  const [isSearch, setIsSearch] = useState(false);
  const [canChatCount, setCanChatCount] = useState(0);
  const [chatList, setChatList] = useState<ContactItemType[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [disable, setDisabled] = useState<boolean>(true);

  const handleFormValueChange = useCallback(() => {
    const { name } = form.getFieldsValue();
    setDisabled(!name || selectedContacts?.length === 0);
  }, [form, selectedContacts?.length]);

  const handleNameChange = useCallback(
    (v: string) => {
      console.log('🌈 🌈 🌈 🌈 🌈 🌈 v', v);
      handleFormValueChange();
    },
    [handleFormValueChange],
  );

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsSearch(!!e.target.value);

      const { contactFilterList: searchResult } = localSearch(e.target.value, ContactsTab.Chats);
      setChatList(searchResult);
    },
    [localSearch],
  );

  const handleSelect = useCallback(
    (item: ContactItemType) => {
      console.log('🌈 🌈 🌈 🌈 🌈 🌈 ', item);
      // setSelectedContacts[]

      handleFormValueChange();
    },
    [handleFormValueChange],
  );

  const onFinish = useCallback(() => {
    try {
      // api createChannel
      const res: any = '';
      message.success('Group Created!');

      navigate(`/chat-box/${res.channelUuid}`);
    } catch (error) {
      const msg = handleErrorMessage(error, 'Error Creating Group');
      message.error(msg);
    }
  }, [navigate]);

  useEffect(() => {
    setIsSearch(false);
    setDisabled(true);

    const { contactFilterList: searchResult } = localSearch('', ContactsTab.Chats);
    setChatList(searchResult);
    setCanChatCount(searchResult?.length || 0);
  }, [localSearch]);

  return (
    <div className="create-chat-group">
      <div className="create-chat-top">
        <SettingHeader title={t('Create Group')} leftCallBack={() => navigate(-1)} />
      </div>
      <div className="create-chat-body">
        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          className="flex-column create-chat-form"
          requiredMark={false}
          onFinish={onFinish}>
          <div className="form-content">
            {/* input */}
            <FormItem name="name" label={t('Group Name')} className="group-name-input">
              <Input placeholder={t('Enter name')} onChange={(e) => handleNameChange(e.target.value)} maxLength={40} />
            </FormItem>

            <div className="create-chat-search">
              <div className="search-title flex-row-between">
                <div>{t('Select Contact')}</div>
                <div>
                  {selectedContacts?.length || 0}/{canChatCount}
                </div>
              </div>
              <ContactsSearchInput
                className="find-more-search"
                placeholder="Wallet Name/Remark/Portkey ID/Address"
                handleChange={handleSearch}
              />
            </div>

            <div className="create-chat-contact">
              {/* searching, no result */}
              {isSearch && chatList?.length === 0 && (
                <div className="flex-center no-search-result">There is no search result.</div>
              )}

              {/* no search, no result */}
              {!isSearch && chatList?.length === 0 && (
                <div className="flex-center no-search-result">No contact available</div>
              )}

              {/* contacts available to chat */}
              {/* TODO checkbox */}
              {chatList?.length > 0 && <ContactList list={chatList} clickItem={handleSelect} hasChatEntry={false} />}
            </div>
          </div>

          <FormItem className="form-btn">
            <Button className="create-btn" type="primary" htmlType="submit" disabled={disable}>
              {t('Done')}
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
}
