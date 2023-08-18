import ViewContactPrompt from './Prompt';
import ViewContactPopup from './Popup';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import { useProfileChat, useProfileCopy, useGoProfileEdit } from 'hooks/useProfile';

export default function ViewContact() {
  const { isNotLessThan768 } = useCommonState();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const title = t('Details');
  const editText = t('Edit');
  const chatText = t('Chat');
  const addedText = t('Added');
  const addContactText = t('Add Contact');

  const goBack = useCallback(() => {
    navigate('/setting/contacts');
  }, [navigate]);

  const handleEdit = useGoProfileEdit();
  const handleChat = useProfileChat();
  const handleCopy = useProfileCopy();
  const handleAdd = () => {
    console.log('add');
  };

  // TODO btn show logic
  return isNotLessThan768 ? (
    <ViewContactPrompt
      headerTitle={title}
      editText={editText}
      chatText={chatText}
      addedText={addedText}
      addContactText={addContactText}
      data={state}
      goBack={goBack}
      handleEdit={() => handleEdit('1', state)} // TODO add or edit 1 2
      handleAdd={handleAdd}
      handleChat={() => handleChat(state)}
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
      handleEdit={() => handleEdit('1', state)} // TODO add or edit 1 2
      handleAdd={handleAdd}
      handleChat={() => handleChat(state)}
      handleCopy={handleCopy}
    />
  );
}
