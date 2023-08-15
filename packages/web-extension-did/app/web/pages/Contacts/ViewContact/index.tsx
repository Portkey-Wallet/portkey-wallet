import ViewContactPrompt from './Prompt';
import ViewContactPopup from './Popup';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import { useProfileAddContact, useProfileChat, useProfileCopy, useProfileEdit } from 'hooks/useProfile';

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

  const handleEdit = useProfileEdit();
  const handleAdd = useProfileAddContact();
  const handleChat = useProfileChat();
  const handleCopy = useProfileCopy();

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
      // TODO 1 2
      handleEdit={() => handleEdit('1', state)}
      handleAdd={() => handleAdd('2', state)}
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
      // TODO 1 2
      handleEdit={() => handleEdit('1', state)}
      handleAdd={() => handleAdd('2', state)}
      handleChat={() => handleChat(state)}
      handleCopy={handleCopy}
    />
  );
}
