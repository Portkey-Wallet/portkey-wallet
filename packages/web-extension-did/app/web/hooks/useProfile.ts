import CustomModal from 'pages/components/CustomModal';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import { ExtraType, IProfileDetailDataProps } from 'types/Profile';
import { useCreateP2pChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import singleMessage from 'utils/singleMessage';

export const useGoProfile = () => {
  const navigate = useNavigate();

  return useCallback(
    (state: IProfileDetailDataProps) => {
      navigate('/setting/contacts/view', { state });
    },
    [navigate],
  );
};

export const useGoProfileEdit = () => {
  const navigate = useNavigate();

  return useCallback(
    (extra: ExtraType, state: IProfileDetailDataProps) => {
      navigate(`/setting/contacts/edit/${extra}`, { state });
    },
    [navigate],
  );
};

export const useGoAddNewContact = () => {
  const navigate = useNavigate();

  return useCallback(
    (extra: ExtraType, state: IProfileDetailDataProps) => {
      navigate(`/setting/contacts/add/${extra}`, { state });
    },
    [navigate],
  );
};

export const useProfileChat = () => {
  const navigate = useNavigate();
  const createChannel = useCreateP2pChannel();
  const { isPrompt } = useCommonState();

  return useCallback(
    async (relationId: string) => {
      if (isPrompt) {
        CustomModal({
          content: `Please click on the Portkey browser extension in the top right corner to access the chat feature`,
        });
      } else {
        try {
          const res = await createChannel(relationId);
          navigate(`/chat-box/${res.channelUuid}`);
        } catch (error) {
          singleMessage.error('cannot chat');
        }
      }
    },
    [createChannel, isPrompt, navigate],
  );
};
