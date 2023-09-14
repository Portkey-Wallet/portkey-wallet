import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import { TextM } from 'components/CommonText';
import * as ImagePicker from 'expo-image-picker';
import useQrScanPermission from 'hooks/useQrScanPermission';
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

export const ToolBar = memo(function ToolBar({ style }: { style?: ViewStyleType }) {
  const { t } = useLanguage();
  const [, requestQrPermission] = useQrScanPermission();
  const { sendChannelImage, sendChannelMessage } = useSendCurrentChannelMessage();

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
              sendChannelMessage(item.url);
            },
          }),
      },
    ];
  }, [requestQrPermission, selectPhoto, sendChannelMessage, showDialog]);

  return (
    <View style={[GStyles.flex1, GStyles.flexRowWrap, styles.wrap, style]}>
      {toolList.map(ele => (
        <Touchable key={ele.label} style={[GStyles.center, styles.toolsItem]} onPress={ele.onPress}>
          <View style={[GStyles.center, styles.toolsItemIconWrap]}>
            <Svg icon={ele.icon} size={pTd(24)} color={defaultColors.font5} />
          </View>
          <TextM style={FontStyles.font3}>{ele.label}</TextM>
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
    width: pTd(77),
    height: pTd(76),
    marginRight: pTd(8),
  },
  toolsItemIconWrap: {
    backgroundColor: defaultColors.bg1,
    marginBottom: pTd(8),
    width: pTd(52),
    height: pTd(52),
    borderRadius: pTd(6),
  },
});
