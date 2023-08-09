import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import { BGStyles } from 'assets/theme/styles';
import ChatOverlay from '../ChatOverlay';
import ChatHomeListItemSwiped from '../ChatHomeListItemSwiper';

type ChatListType = {
  chatList: { id: string; name: string }[];
};

export default function ChatList(props: ChatListType) {
  const { chatList = [] } = props;

  return (
    <FlatList
      style={BGStyles.bg1}
      data={chatList}
      renderItem={item => (
        <ChatHomeListItemSwiped
          onPress={() => navigationService.navigate('ChatDetails')}
          onLongPress={(event, i) => {
            const { pageX, pageY } = event.nativeEvent;
            ChatOverlay.showChatPopover(
              [
                { title: 'pin', onPress: () => navigationService.navigate('NewChatHome', { item }) },
                { title: 'mute', onPress: () => navigationService.navigate('NewChatHome', { item }) },
                { title: 'delete', onPress: () => navigationService.navigate('NewChatHome', { item }) },
              ],
              pageX,
              pageY,
              'left',
            );
          }}
          {...item}
          onDelete={() => console.log('delete')}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg4,
    paddingHorizontal: 0,
    paddingBottom: 0,
    flex: 1,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  svgWrap: {
    padding: pTd(16),
  },
});
