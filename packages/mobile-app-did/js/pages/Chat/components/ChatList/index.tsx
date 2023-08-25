import React, { useCallback } from 'react';
import { FlatList, GestureResponderEvent } from 'react-native';
import { BGStyles } from 'assets/theme/styles';
import ChatOverlay from '../ChatOverlay';
import ChatHomeListItemSwiped from '../ChatHomeListItemSwiper';
import { ChannelItem } from '@portkey-wallet/im/types';
import NoData from 'components/NoData';
import {
  useChannelList,
  useHideChannel,
  useIsIMReady,
  useMuteChannel,
  usePinChannel,
} from '@portkey-wallet/hooks/hooks-ca/im';
import CommonToast from 'components/CommonToast';
import { handleErrorMessage } from '@portkey-wallet/utils';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import useEffectOnce from 'hooks/useEffectOnce';
import { useJumpToChatDetails } from 'hooks/chat';
import { useFocusEffect } from '@react-navigation/native';
import { useLatestRef } from '@portkey-wallet/hooks';

export default function ChatList() {
  const {
    list: channelList,
    init: initChannelList,
    next: nextChannelList,
    hasNext: hasNextChannelList,
  } = useChannelList();

  const isReady = useIsIMReady();
  const pinChannel = usePinChannel();
  const muteChannel = useMuteChannel();
  const hideChannel = useHideChannel();
  const navToChatDetails = useJumpToChatDetails();
  const lastInitChannelList = useLatestRef(initChannelList);

  useFocusEffect(
    useCallback(() => {
      lastInitChannelList.current();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const onHideChannel = useCallback(
    async (item: ChannelItem) => {
      try {
        await hideChannel(item.channelUuid);
      } catch (error) {
        CommonToast.fail(handleErrorMessage(error));
      }
    },
    [hideChannel],
  );

  const longPress = useCallback(
    (event: GestureResponderEvent, item: ChannelItem) => {
      const { pageX, pageY } = event.nativeEvent;
      ChatOverlay.showChatPopover({
        list: [
          {
            title: item.pin ? 'Unpin' : 'Pin',
            iconName: 'chat-pin',
            onPress: async () => {
              try {
                await pinChannel(item.channelUuid, !item.pin);
              } catch (error) {
                CommonToast.fail(handleErrorMessage(error));
              }
            },
          },
          {
            title: item.mute ? 'Unmute' : 'Mute',
            iconName: 'chat-mute',
            onPress: async () => {
              try {
                await muteChannel(item.channelUuid, !item.mute, true);
              } catch (error) {
                CommonToast.fail(handleErrorMessage(error));
              }
            },
          },
          {
            title: 'Delete',
            iconName: 'chat-delete',
            onPress: () => onHideChannel(item),
          },
        ],
        px: pageX,
        py: pageY,
        formatType: 'dynamicWidth',
      });
    },
    [muteChannel, onHideChannel, pinChannel],
  );

  const onEndReached = useLockCallback(async () => {
    if (hasNextChannelList) await nextChannelList();
  }, []);

  useEffectOnce(() => {
    if (!isReady) return CommonToast.fail('Synchronizing on-chain data…');
  });

  useEffectOnce(() => {
    initChannelList();
  });

  return (
    <FlatList
      style={BGStyles.bg1}
      data={channelList}
      ListEmptyComponent={<NoData icon="no-message" message="No message" />}
      onEndReached={onEndReached}
      renderItem={({ item }) => (
        <ChatHomeListItemSwiped
          item={item}
          onDelete={() => onHideChannel(item)}
          onPress={() => navToChatDetails({ toRelationId: item?.toRelationId, channelUuid: item?.channelUuid })}
          onLongPress={event => longPress(event, item)}
        />
      )}
    />
  );
}
