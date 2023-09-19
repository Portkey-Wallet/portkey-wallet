import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, GestureResponderEvent } from 'react-native';
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
import { pTd } from 'utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import myEvents from 'utils/deviceEvent';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';

export default function DiscoverHome() {
  const qrScanPermissionAndToast = useQrScanPermissionAndToast();
  const onRightPress = useCallback(async (event: GestureResponderEvent) => {
    const { pageY } = event.nativeEvent;
    const top: number =
      (await new Promise(_resolve => {
        event.target.measure((x, y, width, height, pageX, topY) => {
          _resolve(topY);
        });
      })) || 0;
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
        {
          title: 'Scan',
          iconName: 'scan',
          onPress: async () => {
            if (!(await qrScanPermissionAndToast())) return;
            navigationService.navigate('QrScanner');
          },
        },
      ],
      formatType: 'dynamicWidth',
      customPosition: { right: pTd(8), top: (top || pageY) + 30 },
      customBounds: { x: screenWidth - pTd(20), y: pageY + 20, width: 0, height: 0 },
    });
  }, []);

  const RightDom = useMemo(() => {
    return (
      <View style={GStyles.flexRow}>
        <Touchable
          style={styles.searchIcon}
          onPress={() => {
            myEvents.chatHomeListCloseSwiped.emit(Math.random());
            navigationService.navigate('SearchPeople');
          }}>
          <Svg icon="search" color={defaultColors.bg1} size={pTd(20)} />
        </Touchable>
        <Touchable style={styles.addIcon} onPress={onRightPress}>
          <Svg size={pTd(20)} icon="chat-add" />
        </Touchable>
      </View>
    );
  }, [onRightPress]);

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.bg5]}>
      <Touchable activeOpacity={1} onPressIn={() => myEvents.chatHomeListCloseSwiped.emit('')}>
        <CustomHeader noLeftDom themeType="blue" titleDom="Chats" rightDom={RightDom} />
      </Touchable>
      <ChatList />
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
