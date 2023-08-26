import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { TextL } from 'components/CommonText';
import Chats from '../components/Chats';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import ChatOverlay from '../components/ChatOverlay';
import navigationService from 'utils/navigationService';
import { ChatOperationsEnum } from '@portkey-wallet/constants/constants-ca/chat';
import CommonAvatar from 'components/CommonAvatar';
import { FontStyles } from 'assets/theme/styles';
import AddContactButton from '../components/AddContactButton';
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
import { handleErrorMessage } from '@portkey-wallet/utils';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import Loading from 'components/Loading';
import { useAddStrangerContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import type { ListItemType } from '../components/ChatOverlay/chatPopover';

const ChatDetails = () => {
  const dispatch = useAppCommonDispatch();

  const pinChannel = usePinChannel();
  const muteChannel = useMuteChannel();
  const hideChannel = useHideChannel();
  const addStranger = useAddStrangerContact();

  const currentChannelId = useCurrentChannelId();
  const currentChannelInfo = useChannelItemInfo(currentChannelId || '');

  const isStranger = useIsStranger(currentChannelInfo?.toRelationId || '');

  const toRelationId = useMemo(() => currentChannelInfo?.toRelationId, [currentChannelInfo?.toRelationId]);
  const displayName = useMemo(() => currentChannelInfo?.displayName, [currentChannelInfo?.displayName]);
  const pin = useMemo(() => currentChannelInfo?.pin, [currentChannelInfo?.pin]);
  const mute = useMemo(() => currentChannelInfo?.mute, [currentChannelInfo?.mute]);

  const addContact = useLockCallback(async () => {
    try {
      await addStranger(toRelationId || '');
      CommonToast.success('Add Success');
      dispatch(fetchContactListAsync());
    } catch (error) {
      CommonToast.fail(handleErrorMessage(error));
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
            contact: {
              name: currentChannelInfo?.displayName,
            },
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
  }, [
    addContact,
    currentChannelId,
    currentChannelInfo?.displayName,
    hideChannel,
    isStranger,
    mute,
    muteChannel,
    pin,
    pinChannel,
    toRelationId,
  ]);

  const onPressMore = useCallback(
    (event: { nativeEvent: { pageX: any; pageY: any } }) => {
      const { pageY } = event.nativeEvent;
      ChatOverlay.showChatPopover({
        list: handleList,
        formatType: 'dynamicWidth',
        customPosition: { right: pTd(20), top: pageY + 20 },
        customBounds: { x: screenWidth - pTd(20), y: pageY + 20, width: 0, height: 0 },
      });
    },
    [handleList],
  );

  return (
    <PageContainer
      noCenterDom
      hideTouchable
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}
      leftCallback={() => {
        navigationService.navigate('Tab');
      }}
      leftDom={
        <View style={[GStyles.flexRow, GStyles.itemCenter, GStyles.paddingLeft(pTd(16))]}>
          <Touchable style={GStyles.marginRight(pTd(20))} onPress={() => navigationService.navigate('Tab')}>
            <Svg size={pTd(20)} icon="left-arrow" color={defaultColors.bg1} />
          </Touchable>
          <Touchable
            onPress={() => {
              navigationService.navigate('ChatContactProfile', {
                relationId: toRelationId,
                contact: {
                  name: currentChannelInfo?.displayName,
                },
              });
            }}>
            <CommonAvatar title={displayName} avatarSize={pTd(32)} style={styles.headerAvatar} />
          </Touchable>
          <TextL style={[FontStyles.font2, GStyles.marginRight(pTd(4)), GStyles.marginLeft(pTd(8))]}>
            {displayName}
          </TextL>
          {mute && <Svg size={pTd(16)} icon="chat-mute" color={defaultColors.bg1} />}
        </View>
      }
      rightDom={
        <Touchable style={GStyles.marginRight(pTd(16))} onPress={onPressMore}>
          <Svg size={pTd(20)} icon="more" color={defaultColors.bg1} />
        </Touchable>
      }>
      <AddContactButton isStranger={isStranger} onPressButton={addContact} />
      <Chats />
    </PageContainer>
  );
};

export default ChatDetails;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  headerAvatar: {
    fontSize: pTd(14),
  },
});
