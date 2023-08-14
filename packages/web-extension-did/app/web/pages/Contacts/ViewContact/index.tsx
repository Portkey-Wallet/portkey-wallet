import ViewContactPrompt from './Prompt';
import ViewContactPopup from './Popup';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import { useCallback } from 'react';
import { BaseHeaderProps } from 'types/UI';
import { useCommonState } from 'store/Provider/hooks';

export interface IViewContactProps extends BaseHeaderProps {
  data: {
    name: string;
    remark: string;
    portkeyId: string;
    relationOneId: string;
    index: string;
    addresses: AddressItem[];
  };
  editText: string;
  chatText: string;
  addedText: string;
  addContactText: string;
  handleEdit: () => void;
  handleChat: () => void;
  handleAdd: () => void;
  handleCopy: (v: string) => void;
}

export default function ViewContact() {
  const { isNotLessThan768 } = useCommonState();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const title = t('Contacts');
  const editText = t('Edit');
  const chatText = t('Chat');
  const addedText = t('Added');
  const addContactText = t('Add Contact');

  const goBack = useCallback(() => {
    navigate('/setting/contacts');
  }, [navigate]);

  const handleEdit = useCallback(() => {
    navigate('/setting/contacts/edit', { state: state });
  }, [navigate, state]);

  const handleChat = useCallback(() => {
    navigate('/chat-list', { state: state });
  }, [navigate, state]);

  const handleAdd = useCallback(() => {
    navigate('/setting/contacts/add', { state: state });
  }, [navigate, state]);

  const handleCopy = useCallback((v: string) => {
    console.log('🌈 🌈 🌈 🌈 🌈 🌈 v', v);
  }, []);

  return isNotLessThan768 ? (
    <ViewContactPrompt
      headerTitle={title}
      editText={editText}
      chatText={chatText}
      addedText={addedText}
      addContactText={addContactText}
      data={state}
      goBack={goBack}
      handleEdit={handleEdit}
      handleChat={handleChat}
      handleAdd={handleAdd}
      handleCopy={handleCopy}
    />
  ) : (
    <ViewContactPopup
      headerTitle={title}
      editText={editText}
      chatText={chatText}
      addedText={addedText}
      addContactText={addContactText}
      data={state}
      goBack={goBack}
      handleEdit={handleEdit}
      handleChat={handleChat}
      handleAdd={handleAdd}
      handleCopy={handleCopy}
    />
  );
}
