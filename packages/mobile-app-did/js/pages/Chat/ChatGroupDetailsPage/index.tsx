import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { TextL } from 'components/CommonText';
import ChatsGroupDetailContent from '../components/ChatsGroupDetailContent';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import ChatOverlay from '../components/ChatOverlay';
import navigationService from 'utils/navigationService';
import { ChatOperationsEnum } from '@portkey-wallet/constants/constants-ca/chat';
import { FontStyles } from 'assets/theme/styles';
import {
  useMuteChannel,
  usePinChannel,
  useHideChannel,
  useGroupChannelInfo,
  useLeaveChannel,
  useChannelItemInfo,
} from '@portkey-wallet/hooks/hooks-ca/im';
import ActionSheet from 'components/ActionSheet';
import { useCurrentChannelId } from '../context/hooks';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import type { ListItemType } from '../components/ChatOverlay/chatPopover';
import FloatingActionButton from '../components/FloatingActionButton';
import { useHardwareBackPress } from '@portkey-wallet/hooks/mobile';
import { measurePageY } from 'utils/measure';
import GroupAvatarShow from '../components/GroupAvatarShow';
import { useIsFocused } from '@react-navigation/native';
import HeaderPinSection from '../components/HeaderPinSection';
import { useIMPin } from '@portkey-wallet/hooks/hooks-ca/im/pin';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { TabRouteNameEnum } from 'types/navigate';

const ChatGroupDetailsPage = () => {
  const isFocused = useIsFocused();

  const pinChannel = usePinChannel();
  const muteChannel = useMuteChannel();
  const hideChannel = useHideChannel();

  const [hasPinWhenInit, setHasPinWhenInit] = useState(false);
  const currentChannelId = useCurrentChannelId();
  const { isAdmin, groupInfo } = useGroupChannelInfo(currentChannelId || '', true);
  const { pin, mute, displayName } = useChannelItemInfo(currentChannelId || '') || {};
  const { lastPinMessage, refreshLastPin, refresh } = useIMPin(currentChannelId || '', true);

  const leaveGroup = useLeaveChannel();

  const addMembers = useCallback(() => {
    navigationService.navigate('AddMembersPage');
  }, []);

  const handleList = useMemo((): ListItemType[] => {
    const list: ListItemType[] = [
      {
        title: ChatOperationsEnum.GROUP_INFO,
        iconName: 'chat-group-info',
        onPress: () => {
          navigationService.navigate('GroupInfoPage');
        },
      },
      {
        title: pin ? ChatOperationsEnum.UNPIN : ChatOperationsEnum.PIN,
        iconName: pin ? 'chat-unpin' : 'chat-pin',
        onPress: async () => {
          try {
            await pinChannel(currentChannelId || '', !pin);
          } catch (error) {
            CommonToast.fail(`Failed to ${pin ? 'unpin' : 'pin'} chat`);
          }
        },
      },
      {
        title: mute ? ChatOperationsEnum.UNMUTE : ChatOperationsEnum.MUTE,
        iconName: mute ? 'chat-unmute' : 'chat-mute',
        onPress: async () => {
          try {
            await muteChannel(currentChannelId || '', !mute);
          } catch (error) {
            CommonToast.fail(`Failed to ${mute ? 'unmute' : 'mute'} chat`);
          }
        },
      },
      {
        title: ChatOperationsEnum.DELETE_CHAT,
        iconName: 'chat-delete',
        onPress: () => {
          ActionSheet.alert({
            title: 'Delete chat?',
            buttons: [
              {
                title: 'Cancel',
                type: 'outline',
              },
              {
                title: 'Confirm',
                type: 'primary',
                onPress: async () => {
                  try {
                    Loading.show();
                    await hideChannel(currentChannelId || '');
                    navigationService.navigate('Tab');
                  } catch (error) {
                    CommonToast.fail(`Failed to delete chat`);
                  } finally {
                    Loading.hide();
                  }
                },
              },
            ],
          });
        },
      },
    ];

    if (!isAdmin)
      list.push({
        title: ChatOperationsEnum.LEAVE_GROUP,
        iconName: 'chat-leave-group',
        onPress: async () => {
          try {
            Loading.show();
            await leaveGroup(currentChannelId || '');
            navigationService.goBack();
          } catch (error) {
            CommonToast.failError(error);
          } finally {
            Loading.hide();
          }
        },
      });

    return list;
  }, [currentChannelId, hideChannel, isAdmin, leaveGroup, mute, muteChannel, pin, pinChannel]);

  const onPressMore = useCallback(
    async (event: GestureResponderEvent) => {
      const { pageY } = event.nativeEvent;

      const top = await measurePageY(event.target);
      ChatOverlay.showChatPopover({
        list: handleList,
        formatType: 'dynamicWidth',
        customPosition: { right: pTd(8), top: (top || pageY) + 30 },
        customBounds: {
          x: screenWidth - pTd(20),
          y: pageY,
          width: 0,
          height: 0,
        },
      });
    },
    [handleList],
  );

  const onBack = useCallback(() => {
    navigationService.navigate('Tab');
    navigationService.navToBottomTab(TabRouteNameEnum.CHAT);
  }, []);

  useHardwareBackPress(
    useMemo(() => {
      if (isFocused) {
        return () => {
          console.log('useHardwareBackPress');
          onBack();
          return true;
        };
      }
    }, [isFocused, onBack]),
  );

  const leftDom = useMemo(
    () => (
      <View style={[GStyles.flexRow, GStyles.itemCenter, GStyles.paddingLeft(pTd(16))]}>
        <Touchable onPress={onBack} style={GStyles.marginRight(pTd(20))}>
          <Svg size={pTd(20)} icon="left-arrow" color={defaultColors.icon5} />
        </Touchable>
        <Touchable
          style={[GStyles.flexRow, GStyles.itemCenter]}
          onPress={() => {
            navigationService.navigate('GroupInfoPage');
          }}>
          <GroupAvatarShow
            logoSize={pTd(12)}
            avatarSize={pTd(32)}
            imageUrl={groupInfo?.icon || ''}
            svgName={groupInfo?.icon ? undefined : 'chat-group-avatar-header'}
          />
          <View style={[GStyles.marginRight(pTd(4)), GStyles.marginLeft(pTd(8))]}>
            <TextL numberOfLines={1} style={[FontStyles.font5, FontStyles.weight500, styles.name]}>
              {groupInfo?.name || displayName || ''}
            </TextL>
          </View>
        </Touchable>

        {mute && <Svg size={pTd(16)} icon="chat-mute" color={defaultColors.font11} />}
      </View>
    ),
    [displayName, groupInfo?.icon, groupInfo?.name, mute, onBack],
  );

  const headerDom = useMemo(() => {
    if (lastPinMessage) return <HeaderPinSection channelUUid={currentChannelId || ''} />;

    return hasPinWhenInit ? null : (
      <FloatingActionButton title="Add Members" shouldShowFirstTime={isAdmin} onPressButton={addMembers} />
    );
  }, [addMembers, currentChannelId, hasPinWhenInit, isAdmin, lastPinMessage]);

  useEffectOnce(() => {
    refreshLastPin();
    refresh();
  });

  useEffect(() => {
    if (!lastPinMessage) return;
    setHasPinWhenInit(!!lastPinMessage);
  }, [lastPinMessage]);

  return (
    <PageContainer
      noCenterDom
      hideTouchable
      safeAreaColor={['white', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}
      leftDom={leftDom}
      rightDom={
        <Touchable style={[GStyles.marginRight(pTd(16))]} onPress={onPressMore}>
          <Svg size={pTd(20)} icon="more" color={defaultColors.icon5} />
        </Touchable>
      }>
      {headerDom}
      <ChatsGroupDetailContent />
    </PageContainer>
  );
};

export default ChatGroupDetailsPage;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  memberInfo: {
    opacity: 0.6,
  },
  lottieLoadingStyle: {
    width: pTd(10),
  },
  name: {
    maxWidth: pTd(150),
  },
});
