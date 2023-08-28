import { useCallback } from 'react';
import { useCreateP2pChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { setCurrentChannelId } from 'pages/Chat/context/chatsContext';
import { useChatsDispatch } from 'pages/Chat/context/hooks';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';

export function useJumpToChatDetails() {
  const chatDispatch = useChatsDispatch();
  const createChannel = useCreateP2pChannel();

  return useCallback(
    async ({ toRelationId, channelUuid }: { toRelationId: string; channelUuid?: string }) => {
      try {
        if (channelUuid) {
          chatDispatch(setCurrentChannelId(channelUuid || ''));
        } else {
          const channelInfo = await createChannel(toRelationId || '');
          chatDispatch(setCurrentChannelId(channelInfo.channelUuid || ''));
        }
        navigationService.navigate('ChatDetails');
      } catch (error) {
        console.log(error);
        CommonToast.failError(error);
      }
    },
    [chatDispatch, createChannel],
  );
}
