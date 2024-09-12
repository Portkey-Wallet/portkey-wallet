import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import CustomHeader from 'components/CustomHeader';
import Touchable from 'components/Touchable';
import SessionList from '../components/SessionList';
import { pTd } from 'utils/unit';
import myEvents from 'utils/deviceEvent';
import { useFocusEffect } from '@react-navigation/native';
import { useLatestRef, useThrottleCallback } from '@portkey-wallet/hooks';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';
import useRequestNotifyPermission from 'hooks/usePermission';
// import InviteFriendsSection from '../components/InviteFriendsSection';
import OfficialChatGroup from '../components/OfficialChatGroup';

import { useJoinOfficialGroupAndAiChatTipModal } from 'hooks/guide';
import { useChannelList } from '@portkey-wallet/hooks/hooks-ca/im';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useOnTouchAndPopUp } from 'components/FloatOverlay/touch';
import { ListItemType } from 'components/FloatOverlay/Popover';
import KeyGenieChat from '../components/KeyGenieChat';

export default function ChatHomePage() {
  const qrScanPermissionAndToast = useQrScanPermissionAndToast();
  const emitCloseSwiped = useCallback(() => myEvents.chatHomeListCloseSwiped.emit(''), []);
  const lastEmitCloseSwiped = useLatestRef(emitCloseSwiped);
  const requestNotifyPermission = useRequestNotifyPermission();
  const joinOfficialGroupAndAiChatModal = useJoinOfficialGroupAndAiChatTipModal();
  const { list: channelList, init: initChannelList } = useChannelList();
  const [hasFinishInit, setHasFinishInit] = useState(false);
  const popUpList: ListItemType[] = useMemo(() => {
    return [
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
    ];
  }, [qrScanPermissionAndToast]);
  const onTouch = useOnTouchAndPopUp({ list: popUpList });

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

  const RightDom = useMemo(() => {
    return (
      <View style={GStyles.flexRow}>
        <Touchable
          style={styles.searchIcon}
          onPress={() => {
            myEvents.chatHomeListCloseSwiped.emit(Math.random());
            navigationService.navigate('SearchPeoplePage');
          }}>
          <Svg icon="search" color={defaultColors.bg31} size={pTd(20)} />
        </Touchable>
        <Touchable style={styles.addIcon} onPress={onTouch}>
          <Svg color={defaultColors.bg31} size={pTd(20)} icon="chat-add" />
        </Touchable>
      </View>
    );
  }, [onTouch]);

  const checkModal = useThrottleCallback(
    async () => {
      const isShowNotice = await requestNotifyPermission();
      if (!isShowNotice) await joinOfficialGroupAndAiChatModal();
    },
    [joinOfficialGroupAndAiChatModal, requestNotifyPermission],
    1000,
  );

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
              {/* <InviteFriendsSection /> */}
              <OfficialChatGroup />
              <KeyGenieChat />
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
