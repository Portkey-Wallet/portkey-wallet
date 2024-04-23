import React, { useCallback, useMemo, useState } from 'react';
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
import SessionList from '../components/SessionList';
import { pTd } from 'utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import myEvents from 'utils/deviceEvent';
import { useFocusEffect } from '@react-navigation/native';
import { useLatestRef } from '@portkey-wallet/hooks';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';
import { measurePageY } from 'utils/measure';
import useRequestNotifyPermission from 'hooks/usePermission';
import InviteFriendsSection from '../components/InviteFriendsSection';
import OfficialChatGroup from '../components/OfficialChatGroup';

import { useJoinOfficialGroupTipModal } from 'hooks/guide';
import { useChannelList } from '@portkey-wallet/hooks/hooks-ca/im';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';

export default function DiscoverHome() {
  const qrScanPermissionAndToast = useQrScanPermissionAndToast();
  const emitCloseSwiped = useCallback(() => myEvents.chatHomeListCloseSwiped.emit(''), []);
  const lastEmitCloseSwiped = useLatestRef(emitCloseSwiped);
  const requestNotifyPermission = useRequestNotifyPermission();
  const joinOfficialGroupModal = useJoinOfficialGroupTipModal();
  const { list: channelList, init: initChannelList } = useChannelList();
  const [hasFinishInit, setHasFinishInit] = useState(false);

  const lastInitChannelList = useLatestRef(initChannelList);

  const initList = useLockCallback(async () => {
    try {
      await lastInitChannelList.current();
    } catch (error) {
      console.log(error);
    } finally {
      setHasFinishInit(true);
    }
  }, [lastInitChannelList]);

  const onRightPress = useCallback(
    async (event: GestureResponderEvent) => {
      const { pageY } = event.nativeEvent;
      const top = await measurePageY(event.target);
      ChatOverlay.showChatPopover({
        list: [
          {
            title: 'New Chat',
            iconName: 'chat-new-chat',
            onPress: () => navigationService.navigate('NewChatHomePage'),
          },
          {
            title: 'Create Group',
            iconName: 'chat-create-group',
            onPress: () => navigationService.navigate('CreateGroupPage'),
          },
          {
            title: 'Find People',
            iconName: 'chat-find-more',
            onPress: () => navigationService.navigate('FindMorePeoplePage'),
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
    },
    [qrScanPermissionAndToast],
  );

  const RightDom = useMemo(() => {
    return (
      <View style={GStyles.flexRow}>
        <Touchable
          style={styles.searchIcon}
          onPress={() => {
            myEvents.chatHomeListCloseSwiped.emit(Math.random());
            navigationService.navigate('SearchPeoplePage');
          }}>
          <Svg icon="search" color={defaultColors.bg1} size={pTd(20)} />
        </Touchable>
        <Touchable style={styles.addIcon} onPress={onRightPress}>
          <Svg size={pTd(20)} icon="chat-add" />
        </Touchable>
      </View>
    );
  }, [onRightPress]);

  const checkModal = useLockCallback(async () => {
    const isShowNotice = await requestNotifyPermission();
    if (!isShowNotice) await joinOfficialGroupModal();
  }, [joinOfficialGroupModal, requestNotifyPermission]);

  useFocusEffect(
    useCallback(() => {
      initList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      lastEmitCloseSwiped.current();
    }, [lastEmitCloseSwiped]),
  );

  useFocusEffect(
    useCallback(() => {
      checkModal();
    }, [checkModal]),
  );

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.white]}>
      <Touchable activeOpacity={1} onPressIn={emitCloseSwiped}>
        <CustomHeader noLeftDom themeType="white" titleDom="Chats" rightDom={RightDom} />
      </Touchable>
      {
        <View style={[BGStyles.bg1, GStyles.flex1]}>
          {hasFinishInit && channelList?.length === 0 ? (
            <>
              <InviteFriendsSection />
              <OfficialChatGroup />
            </>
          ) : (
            <SessionList />
          )}
        </View>
      }
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
