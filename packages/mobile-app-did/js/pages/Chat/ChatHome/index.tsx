import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';

import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import CustomHeader from 'components/CustomHeader';
import ChatOverlay from '../components/ChatOverlay';
import Touchable from 'components/Touchable';
import ChatList from '../components/ChatList';
import CommonButton from 'components/CommonButton';
import { useCreateP2pChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { pTd } from 'utils/unit';
import im from '@portkey-wallet/im';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { v4 } from 'uuid';
import { formatChatListTime } from '@portkey-wallet/utils/chat';

export default function DiscoverHome() {
  const createChannel = useCreateP2pChannel();

  const RightDom = useMemo(() => {
    return (
      <View style={GStyles.flexRow}>
        <Touchable style={styles.searchIcon} onPress={() => navigationService.navigate('SearchPeople')}>
          <Svg icon="search" color={defaultColors.bg1} size={pTd(20)} />
        </Touchable>
        <Touchable
          style={styles.addIcon}
          onPress={event => {
            const { pageY } = event.nativeEvent;

            ChatOverlay.showChatPopover({
              list: [
                {
                  title: 'New Chat',
                  iconName: 'chat-new-chat',
                  onPress: () => navigationService.navigate('NewChatHome'),
                },
                {
                  title: 'Find More',
                  iconName: 'chat-add-contact',
                  onPress: () => navigationService.navigate('FindMorePeople'),
                },
              ],
              formatType: 'dynamicWidth',
              customPosition: { right: pTd(20), top: pageY + 20 },
              customBounds: { x: screenWidth - pTd(20), y: pageY + 20, width: 0, height: 0 },
            });
          }}>
          <Svg size={pTd(20)} icon="chat-add" />
        </Touchable>
      </View>
    );
  }, []);

  const createCha = useCallback(async () => {
    try {
      const result = await createChannel('5h7d6-liaaa-aaaaj-vgmya-cai');
      console.log('result', result);
    } catch (error) {
      console.log('createChannel: error', error);
    }
  }, [createChannel]);

  const sendMess = useCallback(async () => {
    im.service.sendMessage({
      toRelationId: 'e7i7y-giaaa-aaaaj-2ooma-cai',
      type: 'TEXT',
      sendUuid: v4(),
      content: ` hello sa---  ${formatChatListTime(Date.now())} `,
    });
    console.log('sendMess', v4());
  }, []);

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.bg5]}>
      <CustomHeader noLeftDom themeType="blue" titleDom="Web3 Chat" rightDom={RightDom} />
      <ChatList />
      <CommonButton title="createChannel" onPress={createCha} />
      <CommonButton title="sendMessage" onPress={sendMess} />
    </SafeAreaBox>
  );
}

export const styles = StyleSheet.create({
  searchIcon: {
    paddingHorizontal: pTd(12),
  },
  addIcon: {
    paddingLeft: pTd(12),
    paddingRight: pTd(16),
  },
});
