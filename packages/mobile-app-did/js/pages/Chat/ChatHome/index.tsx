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
import { useChannelList, useCreateP2pChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { pTd } from 'utils/unit';
import im from '@portkey-wallet/im';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';

export default function DiscoverHome() {
  const createChannel = useCreateP2pChannel();
  const {
    list: channelList,
    init: initChannelList,
    next: nextChannelList,
    hasNext: hasNextChannelList,
  } = useChannelList();

  const RightDom = useMemo(() => {
    return (
      <View style={GStyles.flexRow}>
        <Touchable style={styles.searchIcon} onPress={() => navigationService.navigate('SearchPeople')}>
          <Svg icon="search" color={defaultColors.bg1} />
        </Touchable>
        <Touchable
          style={styles.addIcon}
          onPress={event => {
            const { pageY } = event.nativeEvent;

            ChatOverlay.showChatPopover({
              list: [
                {
                  title: 'New Chat',
                  onPress: () => navigationService.navigate('NewChatHome'),
                },
                { title: 'Add Contact asdasd' },
              ],
              formatType: 'dynamicWidth',
              customPosition: { right: pTd(20), top: pageY + 20 },
              customBounds: { x: screenWidth - pTd(20), y: pageY + 20, width: 0, height: 0 },
            });
          }}>
          <Svg icon="add2" />
        </Touchable>
      </View>
    );
  }, []);

  useEffect(() => {
    console.log('channelList', channelList);
    const imInstance = im.getInstance();
    if (!imInstance) return;
    imInstance.getUserInfo().then(e => console.log(e));
  }, [channelList]);

  const createCha = useCallback(async () => {
    try {
      const result = await createChannel('nutbk-6aaaa-aaaaj-7hatq-cai');
      console.log('result', result);
    } catch (error) {
      console.log('createChannel: error', error);
    }
  }, [createChannel]);

  const initChannel = useCallback(async () => {
    initChannelList();
  }, [initChannelList]);

  const sendMess = useCallback(async () => {
    console.log('===      c7b961729aaa46e6ab73f70fa0ee6055');
  }, []);

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.bg5]}>
      <CustomHeader noLeftDom themeType="blue" titleDom="Web3 Chat" rightDom={RightDom} />
      <ChatList chatList={channelList} />
      <CommonButton title="createChannel" onPress={createCha} />
      <CommonButton title="createChannel" onPress={createCha} />
      <CommonButton title="initChannel" onPress={initChannel} />
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
