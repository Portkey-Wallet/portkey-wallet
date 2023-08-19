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
import { bindUriToLocalImage } from 'utils/fs/img';

export const ToolBar = memo(function ToolBar({ style }: { style?: ViewStyleType }) {
  const selectPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: false,
    });
    if (result.cancelled) return;
    await bindUriToLocalImage(result.uri, 'https://google.com');
    if (result.uri) {
      SendPicModal.showSendPic({
        uri: result.uri,
        buttons: [
          {
            title: 'Cancel',
            type: 'outline',
          },
          {
            title: 'Send',
            type: 'primary',
          },
        ],
      });
    }
  }, []);

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
            onPressCallBack: item => {
              console.log(item);
            },
          }),
      },
    ];
  }, [selectPhoto]);

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
  hideInput: {
    position: 'absolute',
    top: -1000,
    opacity: 0,
    ...GStyles.flex1,
  },
  inputContainerStyle: {
    height: 80,
    ...GStyles.flex1,
  },
  hide: {
    width: 0,
    height: 0,
  },
  absolute: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    zIndex: 999,
  },
});
