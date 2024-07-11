import React, { useCallback, useMemo } from 'react';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { TextL } from 'components/CommonText';
import ChatsDetailContent from '../components/ChatsDetailContent';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import { ChatOperationsEnum } from '@portkey-wallet/constants/constants-ca/chat';
import CommonAvatar from 'components/CommonAvatar';
import { FontStyles } from 'assets/theme/styles';
import FloatingActionButton from '../components/FloatingActionButton';
import {
  useMuteChannel,
  usePinChannel,
  useHideChannel,
  useChannelItemInfo,
  useIsStranger,
} from '@portkey-wallet/hooks/hooks-ca/im';
import ActionSheet from 'components/ActionSheet';
import { useCurrentChannelId } from '../context/hooks';
import CommonToast from 'components/CommonToast';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import Loading from 'components/Loading';
import { useAddStrangerContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import type { ListItemType } from '../../../components/FloatOverlay/Popover';
import { useHardwareBackPress } from '@portkey-wallet/hooks/mobile';
import { measurePageY } from 'utils/measure';
import { useIsFocused } from '@react-navigation/native';
import { TabRouteNameEnum } from 'types/navigate';
import FloatOverlay from 'components/FloatOverlay';
import ChatDetailsContext from './ChatDetailContext';
import AIChatMark from '../components/AIChatMark';

const ChatDetailsPage = () => {
  const dispatch = useAppCommonDispatch();
  const isFocused = useIsFocused();

  const pinChannel = usePinChannel();
  const muteChannel = useMuteChannel();
  const hideChannel = useHideChannel();
  const addStranger = useAddStrangerContact();

  const currentChannelId = useCurrentChannelId();
  const currentChannelInfo = useChannelItemInfo(currentChannelId || '');

  const isStranger = useIsStranger(currentChannelInfo?.toRelationId || '');

  const toRelationId = useMemo(() => currentChannelInfo?.toRelationId, [currentChannelInfo?.toRelationId]);
  const displayName = useMemo(() => currentChannelInfo?.displayName, [currentChannelInfo?.displayName]);
  const avatar = useMemo(() => currentChannelInfo?.channelIcon, [currentChannelInfo?.channelIcon]);
  const pin = useMemo(() => currentChannelInfo?.pin, [currentChannelInfo?.pin]);
  const mute = useMemo(() => currentChannelInfo?.mute, [currentChannelInfo?.mute]);
  const isBot = useMemo(() => !!currentChannelInfo?.botChannel, [currentChannelInfo?.botChannel]);

  const addContact = useLockCallback(async () => {
    try {
      await addStranger(toRelationId || '');
      CommonToast.success('Contact Added');
      dispatch(fetchContactListAsync());
    } catch (error: any) {
      CommonToast.failError(error);
    }
  }, [addStranger, dispatch, toRelationId]);

  const handleList = useMemo((): ListItemType[] => {
    const list: ListItemType[] = [
      {
        title: ChatOperationsEnum.PROFILE,
        iconName: 'chat-profile',
        onPress: () => {
          navigationService.navigate('ChatContactProfile', {
            relationId: toRelationId,
          });
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

    if (isStranger)
      list.push({
        title: ChatOperationsEnum.ADD_CONTACT,
        iconName: 'chat-add-contact',
        onPress: () => addContact(),
      });

    return list;
  }, [addContact, currentChannelId, hideChannel, isStranger, mute, muteChannel, pin, pinChannel, toRelationId]);

  const onPressMore = useCallback(
    async (event: GestureResponderEvent) => {
      const { pageY } = event.nativeEvent;

      const top = await measurePageY(event.target);
      FloatOverlay.showFloatPopover({
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
          onBack();
          return true;
        };
      }
    }, [isFocused, onBack]),
  );

  const leftDom = useMemo(
    () => (
      <View style={[GStyles.flexRow, GStyles.itemCenter, GStyles.paddingLeft(pTd(16))]}>
        <Touchable style={GStyles.marginRight(pTd(20))} onPress={onBack}>
          <Svg size={pTd(20)} icon="left-arrow" color={defaultColors.icon5} />
        </Touchable>
        <Touchable
          style={[GStyles.flexRow, GStyles.itemCenter]}
          onPress={() => {
            navigationService.navigate('ChatContactProfile', {
              relationId: toRelationId,
              contact: {
                name: currentChannelInfo?.displayName,
              },
            });
          }}>
          <CommonAvatar
            title={displayName}
            avatarSize={pTd(32)}
            titleStyle={FontStyles.size16}
            imageUrl={avatar}
            resizeMode="cover"
          />

          <TextL
            numberOfLines={1}
            style={[
              FontStyles.font5,
              GStyles.marginRight(pTd(4)),
              GStyles.marginLeft(pTd(8)),
              FontStyles.weight500,
              styles.name,
            ]}>
            {displayName}
          </TextL>
          {isBot && <AIChatMark />}
        </Touchable>

        {mute && <Svg size={pTd(16)} icon="chat-mute" color={defaultColors.font11} />}
      </View>
    ),
    [avatar, currentChannelInfo?.displayName, displayName, mute, onBack, toRelationId],
  );

  return (
    <ChatDetailsContext.Provider value={{ toRelationId: toRelationId || '', isBot, displayName: displayName || '' }}>
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
        <FloatingActionButton shouldShowFirstTime={isStranger} onPressButton={addContact} />
        <ChatsDetailContent />
      </PageContainer>
    </ChatDetailsContext.Provider>
  );
};

export default ChatDetailsPage;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  name: {
    maxWidth: pTd(150),
  },
});
