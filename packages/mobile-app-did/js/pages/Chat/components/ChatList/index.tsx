import React, { useCallback } from 'react';
import { FlatList, GestureResponderEvent } from 'react-native';
import navigationService from 'utils/navigationService';
import { BGStyles } from 'assets/theme/styles';
import ChatOverlay from '../ChatOverlay';
import ChatHomeListItemSwiped from '../ChatHomeListItemSwiper';
import { ChannelItem } from '@portkey-wallet/im/types';
import NoData from 'components/NoData';
import { useChannelList, useHideChannel, useMuteChannel, usePinChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import CommonToast from 'components/CommonToast';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useChatsDispatch } from '../../context/hooks';
import { setCurrentChannelId } from '../../context/chatsContext';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import useEffectOnce from 'hooks/useEffectOnce';

export default function ChatList() {
  const {
    list: channelList,
    init: initChannelList,
    next: nextChannelList,
    hasNext: hasNextChannelList,
  } = useChannelList();

  const pinChannel = usePinChannel();
  const muteChannel = useMuteChannel();
  const hideChannel = useHideChannel();
  const chatDispatch = useChatsDispatch();

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

  const navToDetail = useCallback(
    (item: ChannelItem) => {
      chatDispatch(setCurrentChannelId(item.channelUuid));
      navigationService.navigate('ChatDetails', { channelInfo: item });
    },
    [chatDispatch],
  );

  const onEndReached = useLockCallback(async () => {
    if (hasNextChannelList) await nextChannelList();
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     initChannelList();
  //   }, [initChannelList]),
  // );

  useEffectOnce(() => {
    initChannelList();
  });

  console.log('channelList', channelList);

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
          onPress={() => navToDetail(item)}
          onLongPress={event => longPress(event, item)}
        />
      )}
    />
  );
}
