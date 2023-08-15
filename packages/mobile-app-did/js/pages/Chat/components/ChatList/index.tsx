import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import { BGStyles } from 'assets/theme/styles';
import ChatOverlay from '../ChatOverlay';
import ChatHomeListItemSwiped from '../ChatHomeListItemSwiper';
import { ChannelItem } from '@portkey-wallet/im/types';
import NoData from 'components/NoData';

type ChatListType = {
  chatList: ChannelItem[];
};

export default function ChatList(props: ChatListType) {
  const { chatList = [] } = props;

  return (
    <FlatList
      style={BGStyles.bg1}
      data={chatList}
      ListEmptyComponent={<NoData message="No message" />}
      renderItem={item => (
        <ChatHomeListItemSwiped
          onPress={() => navigationService.navigate('ChatDetails')}
          onLongPress={event => {
            const { pageX, pageY } = event.nativeEvent;

            ChatOverlay.showChatPopover({
              list: [
                {
                  title: 'pin',
                  iconName: 'chat-pin',
                  onPress: () => navigationService.navigate('NewChatHome', { item }),
                },
                {
                  title: 'mute',
                  iconName: 'chat-mute',
                  onPress: () => navigationService.navigate('NewChatHome', { item }),
                },
                {
                  title: 'delete',
                  iconName: 'chat-delete',
                  onPress: () => navigationService.navigate('NewChatHome', { item }),
                },
              ],
              px: pageX,
              py: pageY,
              formatType: 'dynamicWidth',
            });
          }}
          {...item}
          onDelete={() => console.log('delete')}
        />
      )}
    />
  );
}
