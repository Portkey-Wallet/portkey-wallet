import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import { TextM } from 'components/CommonText';
import * as ImagePicker from 'expo-image-picker';

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

export const ToolBar = memo(function ToolBar({ style }: { style?: ViewStyleType }) {
  const { sendChannelImage, sendChannelMessage } = useSendCurrentChannelMessage();

  const selectPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: false,
    });

    if (result.cancelled || !result.uri) return;
    if (result?.fileSize && result?.fileSize > 10 * 1024 * 1024) return CommonToast.fail('File too large');

    console.log('result', result);

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
  }, [sendChannelImage]);

  const toolList = useMemo((): { label: string; icon: IconName; onPress: () => void }[] => {
    return [
      {
        label: 'Camera',
        icon: 'chat-camera',
        onPress: () => navigationService.navigate('ChatCamera'),
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
  }, [selectPhoto, sendChannelMessage]);

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
