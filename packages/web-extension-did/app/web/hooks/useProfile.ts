import { message } from 'antd';
import CustomModal from 'pages/components/CustomModal';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useCopyToClipboard } from 'react-use';
import { useCommonState } from 'store/Provider/hooks';
import { ChatType } from 'types/Profile';

export const useProfileEdit = () => {
  const navigate = useNavigate();

  return useCallback(
    (chat: ChatType, state: any) => {
      navigate(`/setting/contacts/edit/${chat}`, { state });
    },
    [navigate],
  );
};

export const useProfileAddContact = () => {
  const navigate = useNavigate();

  return useCallback(
    (chat: ChatType, state: any) => {
      navigate(`/setting/contacts/add/${chat}`, { state });
    },
    [navigate],
  );
};

export const useProfileChat = () => {
  const navigate = useNavigate();
  const { isPrompt } = useCommonState();

  return useCallback(
    (state: any) => {
      if (isPrompt) {
        CustomModal({
          content: `Please click on the Portkey browser extension in the top right corner to access the chat feature`,
        });
      } else {
        navigate('/chat-list', { state });
      }
    },
    [isPrompt, navigate],
  );
};

export const useProfileCopy = () => {
  const [, setCopied] = useCopyToClipboard();
  const { t } = useTranslation();

  return useCallback(
    (val: string) => {
      setCopied(val);
      message.success(t('Copy Success'));
    },
    [setCopied, t],
  );
};
