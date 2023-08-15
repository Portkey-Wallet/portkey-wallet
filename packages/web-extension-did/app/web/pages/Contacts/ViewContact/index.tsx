import ViewContactPrompt from './Prompt';
import ViewContactPopup from './Popup';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { BaseHeaderProps } from 'types/UI';
import { useCommonState } from 'store/Provider/hooks';
import { IViewContactBodyProps } from '../components/ViewContactBody';
import { useCopyToClipboard } from 'react-use';
import { message } from 'antd';
import CustomModal from 'pages/components/CustomModal';

export type IViewContactProps = BaseHeaderProps & IViewContactBodyProps;

export default function ViewContact() {
  const { isPrompt, isNotLessThan768 } = useCommonState();
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

  const handleEdit = useCallback(() => {
    navigate('/setting/contacts/edit', { state: state });
  }, [navigate, state]);

  const handleAdd = useCallback(() => {
    navigate('/setting/contacts/add', { state: state });
  }, [navigate, state]);

  const handleChat = useCallback(() => {
    if (isPrompt) {
      CustomModal({
        content: (
          <>{`Please click on the Portkey browser extension in the top right corner to access the chat feature`}</>
        ),
      });
    } else {
      navigate('/chat-list', { state: state });
    }
  }, [isPrompt, navigate, state]);

  const [, setCopied] = useCopyToClipboard();
  const handleCopy = useCallback(
    (v: string) => {
      setCopied(v);
      message.success(t('Copy Success'));
    },
    [setCopied, t],
  );

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
