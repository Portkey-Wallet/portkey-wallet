import React, { useCallback } from 'react';
import { FlatList, GestureResponderEvent } from 'react-native';
import navigationService from 'utils/navigationService';
import { BGStyles } from 'assets/theme/styles';
import ChatOverlay from '../ChatOverlay';
import ChatHomeListItemSwiped from '../ChatHomeListItemSwiper';
import { ChannelItem } from '@portkey-wallet/im/types';
import NoData from 'components/NoData';
import { useHideChannel, useMuteChannel, usePinChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import CommonToast from 'components/CommonToast';
import { handleErrorMessage } from '@portkey-wallet/utils';

type ChatListType = {
  chatList: ChannelItem[];
};

export default function ChatList(props: ChatListType) {
  const { chatList = [] } = props;
  const pinChannel = usePinChannel();
  const muteChannel = useMuteChannel();
  const hideChannel = useHideChannel();

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

  return (
    <FlatList
      style={BGStyles.bg1}
      data={chatList}
      ListEmptyComponent={<NoData icon="no-message" message="No message" />}
      renderItem={({ item }) => (
        <ChatHomeListItemSwiped
          item={item}
          onDelete={() => onHideChannel(item)}
          onPress={() => navigationService.navigate('ChatDetails', { channelInfo: item })}
          onLongPress={event => longPress(event, item)}
        />
      )}
    />
  );
}
