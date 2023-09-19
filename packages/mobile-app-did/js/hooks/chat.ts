import { useCallback } from 'react';
import { useCreateP2pChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { setCurrentChannelId } from 'pages/Chat/context/chatsContext';
import { useChatsDispatch } from 'pages/Chat/context/hooks';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import { getIDByAddContactUrl } from 'utils/scheme';
import { useDiscoverJumpWithNetWork } from './discover';
import { useHandlePortkeyUrl } from './useQrScan';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
const WWW_URL_PATTERN = /^www\./i;

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

export function useOnUrlPress() {
  const jump = useDiscoverJumpWithNetWork();
  const handlePortkeyUrl = useHandlePortkeyUrl();
  const isChatShow = useIsChatShow();

  return useThrottleCallback(
    (url: string) => {
      if (WWW_URL_PATTERN.test(url)) url = `https://${url}`;
      const id = getIDByAddContactUrl(url);
      if (id && isChatShow) {
        handlePortkeyUrl({
          portkeyId: id,
          showLoading: true,
        });
      } else {
        jump({ item: { url: url, name: url } });
      }
    },
    [jump],
  );
}
