import React, { useCallback } from 'react';
import { FlatList, GestureResponderEvent } from 'react-native';
import { BGStyles } from 'assets/theme/styles';
import ChatOverlay from '../ChatOverlay';
import ChatHomeListItemSwiped from '../ChatHomeListItemSwiper';
import { ChannelItem, ChannelStatusEnum } from '@portkey-wallet/im/types';
import NoData from 'components/NoData';
import { useChannelList, useHideChannel, useMuteChannel, usePinChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import CommonToast from 'components/CommonToast';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import useEffectOnce from 'hooks/useEffectOnce';
import { useJumpToChatDetails, useJumpToChatGroupDetails } from 'hooks/chat';
import { useFocusEffect } from '@react-navigation/native';
import { useLatestRef } from '@portkey-wallet/hooks';
import Touchable from 'components/Touchable';
import myEvents from 'utils/deviceEvent';
import GStyles from 'assets/theme/GStyles';
import ActionSheet from 'components/ActionSheet';

export default function SessionList() {
  const {
    list: channelList,
    init: initChannelList,
    next: nextChannelList,
    hasNext: hasNextChannelList,
  } = useChannelList();

  const pinChannel = usePinChannel();
  const muteChannel = useMuteChannel();
  const hideChannel = useHideChannel();
  const navToChatDetails = useJumpToChatDetails();
  const navToChatGroupDetails = useJumpToChatGroupDetails();

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
        CommonToast.fail(`Failed to delete chat`);
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
            iconName: item.pin ? 'chat-unpin' : 'chat-pin',
            onPress: async () => {
              try {
                await pinChannel(item.channelUuid, !item.pin);
              } catch (error: any) {
                console.log(error);
                if (error.code === '13310') return CommonToast.fail('Pin limit exceeded');
                CommonToast.fail(`Failed to ${item.pin ? 'unpin' : 'pin'} chat`);
              }
            },
          },
          {
            title: item.mute ? 'Unmute' : 'Mute',
            iconName: item.mute ? 'chat-unmute' : 'chat-mute',
            onPress: async () => {
              try {
                await muteChannel(item.channelUuid, !item.mute, true);
              } catch (error) {
                console.log(error);
                CommonToast.fail(`Failed to ${item.mute ? 'unmute' : 'mute'} chat`);
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
    try {
      if (hasNextChannelList) await nextChannelList();
    } catch (error) {
      console.log('error nextChannelList', error);
    }
  }, [channelList, hasNextChannelList, nextChannelList]);

  const onPressItem = useCallback(
    (item: ChannelItem) => {
      switch (item.status) {
        case ChannelStatusEnum.NORMAL:
          if (item.channelType === 'G') {
            navToChatGroupDetails({ channelUuid: item.channelUuid });
          } else {
            navToChatDetails({ toRelationId: item?.toRelationId || '', channelUuid: item?.channelUuid });
          }
          break;
        case ChannelStatusEnum.LEFT:
          hideChannel(item.channelUuid);
          break;
        case ChannelStatusEnum.BE_REMOVED:
          hideChannel(item.channelUuid);
          ActionSheet.alert({
            title: 'You have been removed by the group owner',

            buttons: [
              {
                title: 'OK',
                type: 'primary',
              },
            ],
          });
          break;
        case ChannelStatusEnum.DISBAND:
          hideChannel(item.channelUuid);
          ActionSheet.alert({
            title: 'This group has been deleted by the owner',
            buttons: [
              {
                title: 'OK',
                type: 'primary',
              },
            ],
          });
          break;
        default:
          break;
      }
    },
    [hideChannel, navToChatDetails, navToChatGroupDetails],
  );

  useEffectOnce(() => {
    initChannelList();
  });

  return (
    <Touchable style={[GStyles.flex1, BGStyles.bg1]} activeOpacity={1} onPress={myEvents.chatHomeListCloseSwiped.emit}>
      <FlatList
        style={BGStyles.bg1}
        data={channelList}
        ListEmptyComponent={<NoData icon="no-message" message="No message" />}
        keyExtractor={item => item.channelUuid}
        onEndReached={onEndReached}
        renderItem={({ item }) => (
          <ChatHomeListItemSwiped
            item={item}
            onDelete={() => onHideChannel(item)}
            onPress={() => onPressItem(item)}
            onLongPress={event => longPress(event, item)}
          />
        )}
      />
    </Touchable>
  );
}
