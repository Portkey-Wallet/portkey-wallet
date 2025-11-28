import React, { useCallback } from 'react';
import { FlatList, GestureResponderEvent } from 'react-native';
import { BGStyles } from 'assets/theme/styles';
import ChatHomeListItemSwiped from '../ChatHomeListItemSwiper';
import { ChannelItem, ChannelStatusEnum, ChannelTypeEnum } from '@portkey-wallet/im/types';
import NoData from 'components/NoData';
import { useChannelList, useHideChannel, useMuteChannel, usePinChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import CommonToast from 'components/CommonToast';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useJumpToChatDetails, useJumpToChatGroupDetails } from 'hooks/chat';

import Touchable from 'components/Touchable';
import myEvents from 'utils/deviceEvent';
import GStyles from 'assets/theme/GStyles';
import ActionSheet from 'components/ActionSheet';
import { PIN_LIMIT_EXCEED } from '@portkey-wallet/constants/constants-ca/chat';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
import FloatOverlay from 'components/FloatOverlay';

export default function SessionList() {
  const { list: channelList, next: nextChannelList, hasNext: hasNextChannelList } = useChannelList();

  const pinChannel = usePinChannel();
  const muteChannel = useMuteChannel();
  const hideChannel = useHideChannel();
  const navToChatDetails = useJumpToChatDetails();
  const navToChatGroupDetails = useJumpToChatGroupDetails();

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
      if (item.channelType !== ChannelTypeEnum.GROUP && item.channelType !== ChannelTypeEnum.P2P) {
        return FloatOverlay.showFloatPopover({
          list: [
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
      }

      FloatOverlay.showFloatPopover({
        list: [
          {
            title: item.pin ? 'Unpin' : 'Pin',
            iconName: item.pin ? 'chat-unpin' : 'chat-pin',
            onPress: async () => {
              try {
                await pinChannel(item.channelUuid, !item.pin);
              } catch (error: any) {
                console.log(error);
                if (error.code === PIN_LIMIT_EXCEED) return CommonToast.fail('Pin limit exceeded');
                CommonToast.fail(`Failed to ${item.pin ? 'unpin' : 'pin'} chat`);
              }
            },
          },
          {
            title: item.mute ? 'Unmute' : 'Mute',
            iconName: item.mute ? 'chat-unmute' : 'chat-mute',
            onPress: async () => {
              try {
                await muteChannel(item.channelUuid, !item.mute);
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
  }, [hasNextChannelList, nextChannelList]);

  const onPressItem = useCallback(
    (item: ChannelItem) => {
      if (item.channelType !== ChannelTypeEnum.GROUP && item.channelType !== ChannelTypeEnum.P2P)
        return CommonToast.warn(
          'Downloading the latest Portkey for you. To proceed, please close and restart the App.',
        );

      switch (item.status) {
        case ChannelStatusEnum.NORMAL:
          if (item.channelType === 'G') {
            navToChatGroupDetails({ channelUuid: item.channelUuid });
          } else {
            navToChatDetails({ toRelationId: item?.toRelationId || '', channelUuid: item?.channelUuid });
          }
          break;
        case ChannelStatusEnum.LEFT:
          hideChannel(item.channelUuid, true);
          break;
        case ChannelStatusEnum.BE_REMOVED:
          hideChannel(item.channelUuid, true);
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
          hideChannel(item.channelUuid, true);
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

  return (
    <Touchable style={[GStyles.flex1, BGStyles.bg1]} activeOpacity={1} onPress={myEvents.chatHomeListCloseSwiped.emit}>
      <FlatList
        style={BGStyles.bg1}
        data={channelList}
        ListEmptyComponent={<NoData icon="no-message" message="No message" />}
        keyExtractor={item => item.channelUuid}
        onEndReached={onEndReached}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
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
