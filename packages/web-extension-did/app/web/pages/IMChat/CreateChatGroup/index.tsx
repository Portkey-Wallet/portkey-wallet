import SettingHeader from 'pages/components/SettingHeader';
import './index.less';
import { useTranslation } from 'react-i18next';
import { Button, Form, Input } from 'antd';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import ContactsSearchInput from 'pages/Contacts/components/ContactsSearchInput';
import { ContactsTab } from '@portkey-wallet/constants/constants-ca/assets';
import { useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contact';
import { handleErrorMessage } from '@portkey-wallet/utils';
import ContactListSelect, { IContactItemSelectProps } from '../components/ContactListSelect';
import { useCreateGroupChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import CustomSvg from 'components/CustomSvg';
import UploadAvatar from 'pages/components/UploadAvatar';
import { useLoading } from 'store/Provider/hooks';
import uploadImageToS3 from 'utils/compressAndUploadToS3';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';

const { Item: FormItem } = Form;

export default function CreateChatGroup() {
  const navigate = useNavigateState();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const localSearch = useLocalContactSearch();
  const [isSearch, setIsSearch] = useState(false);
  const [canChatCount, setCanChatCount] = useState(0);
  const [chatList, setChatList] = useState<IContactItemSelectProps[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const selectedContactCount = useRef(0);
  const [disable, setDisabled] = useState<boolean>(true);
  const createGroupChannel = useCreateGroupChannel();
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { setLoading } = useLoading();

  const handleFormValueChange = useCallback(() => {
    const { name } = form.getFieldsValue();

    setDisabled(!name || selectedContactCount.current === 0);
  }, [form]);

  const handleNameChange = useCallback(() => {
    handleFormValueChange();
  }, [handleFormValueChange]);

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsSearch(!!e.target.value);

      const { contactFilterList: searchResult } = localSearch(e.target.value, ContactsTab.Chats);
      const list: IContactItemSelectProps[] = [];

      searchResult.forEach((ele) => {
        if (!ele.imInfo?.relationId) return;

        if (selectedContacts.includes(ele.imInfo?.relationId)) {
          list.push({ ...ele, selected: true });
        } else {
          list.push({ ...ele, selected: false });
        }
      });
      setChatList(list);
    },
    [localSearch, selectedContacts],
  );

  const handleSelect = useCallback(
    (item: IContactItemSelectProps) => {
      const relationId = item.imInfo?.relationId;
      if (!relationId) return;

      // trans chatList selected
      const list: IContactItemSelectProps[] = JSON.parse(JSON.stringify(chatList));
      list.forEach((ele) => {
        if (ele.imInfo?.relationId === relationId) {
          ele.selected = !item.selected;
        }
      });
      setChatList(list);

      // handle selected list
      const selectedList: string[] = JSON.parse(JSON.stringify(selectedContacts));
      if (selectedList.includes(relationId)) {
        const deleteIndex = selectedList.findIndex((ele) => ele === relationId);

        if (deleteIndex >= 0) {
          selectedList.splice(deleteIndex, 1);
        }
      } else {
        selectedList.push(relationId);
      }
      setSelectedContacts(selectedList);
      selectedContactCount.current = selectedList?.length || 0;

      handleFormValueChange();
    },
    [chatList, handleFormValueChange, selectedContacts],
  );

  const onFinish = useCallback(async () => {
    try {
      setLoading(true);
      const { name } = form.getFieldsValue();

      let s3Url = '';
      if (file) {
        s3Url = await uploadImageToS3(file);
      }

      const res = await createGroupChannel(name.trim(), selectedContacts, s3Url);

      setLoading(false);
      singleMessage.success('Group Created');

      navigate(`/chat-box-group/${res?.channelUuid}`);
    } catch (error) {
      const msg = handleErrorMessage(error, 'Error Creating Group');
      singleMessage.error(msg);
      setLoading(false);
    }
  }, [createGroupChannel, file, form, navigate, selectedContacts, setLoading]);

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
        <SettingHeader
          title={t('Create Group')}
          leftCallBack={() => navigate(-1)}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate(-1)} />}
        />
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
              <Input
                prefix={
                  <UploadAvatar
                    getTemporaryDataURL={setPreviewUrl}
                    wrapperClass="group-avatar-upload"
                    getFile={setFile}
                    avatarUrl={previewUrl}
                  />
                }
                placeholder={t('Group Name')}
                onChange={handleNameChange}
                maxLength={40}
              />
            </FormItem>

            <div className="create-chat-search">
              <div className="search-title flex-row-between">
                <div>{t('Select Contacts')}</div>
                <div>
                  {selectedContacts?.length || 0}/{canChatCount}
                </div>
              </div>
              <ContactsSearchInput
                className="find-more-search"
                placeholder="Wallet Name/Remark/Address"
                handleChange={handleSearch}
              />
            </div>

            <div className="create-chat-contact">
              {/* searching, no result */}
              {isSearch && chatList?.length === 0 && (
                <div className="flex-center no-search-result">No search result</div>
              )}

              {/* no search, no result */}
              {!isSearch && chatList?.length === 0 && <div className="flex-center no-search-result">No contact</div>}

              {/* contacts available to chat */}
              {chatList?.length > 0 && <ContactListSelect list={chatList} clickItem={handleSelect} />}
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
