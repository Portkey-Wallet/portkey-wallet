import { useCallback } from 'react';
import { useCreateP2pChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { setCurrentChannelId } from 'pages/Chat/context/chatsContext';
import { useChatsDispatch } from 'pages/Chat/context/hooks';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import myEvents from 'utils/deviceEvent';
import { ChatTabName } from '@portkey-wallet/constants/constants-ca/chat';
import { sleep } from '@portkey-wallet/utils';
import { useNavigation } from '@react-navigation/native';
import { RootStackName } from 'navigation';

export function useJumpToChatDetails() {
  const chatDispatch = useChatsDispatch();
  const createChannel = useCreateP2pChannel();
  const navigation = useNavigation();
  const routesArr: { name: RootStackName }[] = navigation.getState().routes;

  return useCallback(
    async ({ toRelationId, channelUuid }: { toRelationId?: string; channelUuid?: string }) => {
      try {
        if (channelUuid) {
          chatDispatch(setCurrentChannelId(channelUuid || ''));
        } else {
          const channelInfo = await createChannel(toRelationId || '');
          chatDispatch(setCurrentChannelId(channelInfo.channelUuid || ''));
        }

        // if group chat exist, destroy it
        if (routesArr.find(ele => ele.name === 'ChatGroupDetailsPage')) {
          navigationService.reset([{ name: 'Tab' }, { name: 'ChatDetailsPage' }]);
          await sleep(1000);
          myEvents.navToBottomTab.emit({ tabName: ChatTabName });
        } else {
          navigationService.navigate('ChatDetailsPage');
        }
      } catch (error) {
        console.log(error);
        CommonToast.failError(error);
      }
    },
    [chatDispatch, createChannel, routesArr],
  );
}

export function useJumpToChatGroupDetails() {
  const chatDispatch = useChatsDispatch();
  const createChannel = useCreateP2pChannel();

  return useCallback(
    async ({ toRelationId, channelUuid }: { toRelationId?: string; channelUuid?: string }) => {
      try {
        if (channelUuid) {
          chatDispatch(setCurrentChannelId(channelUuid || ''));
        } else {
          const channelInfo = await createChannel(toRelationId || '');
          chatDispatch(setCurrentChannelId(channelInfo.channelUuid || ''));
        }
        navigationService.navigate('ChatGroupDetailsPage');
      } catch (error) {
        console.log(error);
        CommonToast.failError(error);
      }
    },
    [chatDispatch, createChannel],
  );
}
