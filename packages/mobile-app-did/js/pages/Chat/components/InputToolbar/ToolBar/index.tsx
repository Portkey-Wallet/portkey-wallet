import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import { TextS } from 'components/CommonText';
import * as ImagePicker from 'expo-image-picker';
import { useQrScanPermission } from 'hooks/useQrScan';
import ActionSheet from 'components/ActionSheet';

import GStyles from 'assets/theme/GStyles';
import SendPicModal from '../SendPicModal';
import BookmarkOverlay from '../../BookmarkOverlay';
import Svg, { IconName } from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import { ViewStyleType } from 'types/styles';
import { useSendCurrentChannelMessage } from '../../hooks';
import OverlayModal from 'components/OverlayModal';
import { sleep } from '@portkey-wallet/utils';
import CommonToast from 'components/CommonToast';
import { getInfo } from 'utils/fs';
import { MAX_FILE_SIZE_BYTE } from '@portkey-wallet/constants/constants-ca/im';
import { changeCanLock } from 'utils/LockManager';
import { useLanguage } from 'i18n/hooks';
import { useCurrentChannel, useCurrentChannelId } from 'pages/Chat/context/hooks';
import { showAssetList } from 'pages/DashBoard/AssetsOverlay';
import im from '@portkey-wallet/im';
import { useChannelItemInfo } from '@portkey-wallet/hooks/hooks-ca/im';
import Loading from 'components/Loading';

export const ToolBar = memo(function ToolBar({ style }: { style?: ViewStyleType }) {
  const { t } = useLanguage();
  const currentChannel = useCurrentChannel();
  const currentIsGroupChat = currentChannel?.currentChannelType === 'Group';
  const [, requestQrPermission] = useQrScanPermission();
  const { sendChannelImage, sendChannelMessage } = useSendCurrentChannelMessage();

  const currentChannelId = useCurrentChannelId();
  const currentChannelInfo = useChannelItemInfo(currentChannelId || '');
  const { toRelationId } = currentChannelInfo || {};

  const showDialog = useCallback(
    () =>
      ActionSheet.alert({
        title: t('Enable Camera Access'),
        message: t('Cannot connect to the camera. Please make sure it is turned on'),
        buttons: [
          {
            title: t('Close'),
            type: 'solid',
          },
        ],
      }),
    [t],
  );

  const selectPhoto = useCallback(async () => {
    changeCanLock(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: false,
        quality: 1,
      });
      if (result.cancelled || !result.uri) return;

      if (!result?.fileSize) {
        const info = await getInfo(result.uri);
        result.fileSize = info.size;
      }

      if (!result?.fileSize || result.fileSize > MAX_FILE_SIZE_BYTE) return CommonToast.fail('File too large');

      SendPicModal.showSendPic({
        uri: result.uri,
        autoClose: false,
        height: result.height,
        width: result.width,
        buttons: [
          {
            title: 'Cancel',
            type: 'outline',
            onPress: OverlayModal.hide,
          },
          {
            title: 'Send',
            type: 'primary',
            onPress: async () => {
              await sendChannelImage(result);
            },
          },
        ],
      });
    } catch (error) {
      // error
    } finally {
      changeCanLock(true);
    }
  }, [sendChannelImage]);

  const toolList = useMemo((): { label: string; icon: IconName; onPress: () => void }[] => {
    return [
      {
        label: 'Camera',
        icon: 'chat-camera',
        onPress: async () => {
          if (!(await requestQrPermission())) return showDialog();
          navigationService.navigate('ChatCameraPage');
        },
      },
      {
        label: 'Album',
        icon: 'chat-album',
        onPress: selectPhoto,
      },

      {
        label: 'Bookmarks',
        icon: 'chat-bookmark',
        onPress: () =>
          BookmarkOverlay.showBookmarkList({
            onPressCallBack: async item => {
              OverlayModal.hide();
              await sleep(200);
              sendChannelMessage({
                content: item.url,
              });
            },
          }),
      },
      {
        label: 'Crypto Box',
        icon: 'send-red-packet-button',
        onPress: () => {
          navigationService.navigate(currentIsGroupChat ? 'SendPacketGroupPage' : 'SendPacketP2PPage');
        },
      },
      {
        label: 'Transfer',
        icon: 'chat-transfer',
        onPress: async () => {
          if (currentChannel?.currentChannelType === 'P2P') {
            try {
              Loading.show();
              const { data } = await im.service.getProfile({
                relationId: toRelationId || '',
              });

              showAssetList({
                imTransferInfo: {
                  addresses: data.addresses || [],
                  toUserId: data?.caHolderInfo?.userId,
                  channelId: currentChannelId || '',
                  name: data.name || data.caHolderInfo?.walletName || data.imInfo?.name || '',
                },
              });
            } catch (e) {
              console.log('e', e);
            } finally {
              Loading.hide();
            }
          } else {
            navigationService.navigate('SelectGroupMembersToTransferPage');
          }
        },
      },
    ];
  }, [
    currentChannel?.currentChannelType,
    currentChannelId,
    currentIsGroupChat,
    requestQrPermission,
    selectPhoto,
    sendChannelMessage,
    showDialog,
    toRelationId,
  ]);

  return (
    <View style={[GStyles.flex1, GStyles.flexRowWrap, styles.wrap, style]}>
      {toolList.map((ele, index) => (
        <Touchable
          key={ele.label}
          style={[GStyles.center, styles.toolsItem, index % 4 === 3 && styles.marginRight0]}
          onPress={ele.onPress}>
          <View style={[GStyles.center, styles.toolsItemIconWrap]}>
            <Svg icon={ele.icon} size={pTd(24)} color={defaultColors.font5} />
          </View>
          <TextS style={FontStyles.font3}>{ele.label}</TextS>
        </Touchable>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    padding: pTd(16),
  },
  toolsItem: {
    width: pTd(77.8),
    height: pTd(76),
    marginRight: pTd(10),
    marginBottom: pTd(12),
  },
  toolsItemIconWrap: {
    backgroundColor: defaultColors.bg1,
    marginBottom: pTd(8),
    width: pTd(52),
    height: pTd(52),
    borderRadius: pTd(6),
  },
  marginRight0: {
    marginRight: 0,
  },
});
