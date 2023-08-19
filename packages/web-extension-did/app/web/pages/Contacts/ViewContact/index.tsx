import ViewContactPrompt from './Prompt';
import ViewContactPopup from './Popup';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import { useProfileChat, useProfileCopy, useGoProfileEdit } from 'hooks/useProfile';
import CustomModal from 'pages/components/CustomModal';
import { useReadImputation } from '@portkey-wallet/hooks/hooks-ca/contact';

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

  const readImputationApi = useReadImputation();
  useEffect(() => {
    if (state?.isImputation) {
      // imputation from unread to read
      readImputationApi(state);

      CustomModal({
        content: (
          <div>
            <div className="auto-update-title">{`Auto Updates`}</div>
            <div>
              {'Portkey has grouped contacts with the same Portkey ID into one and removed duplicate contacts.'}
            </div>
          </div>
        ),
        okText: 'OK',
      });
    }
  }, [readImputationApi, state]);

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
