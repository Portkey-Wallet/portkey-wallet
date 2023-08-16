import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import { TextM } from 'components/CommonText';
import * as ImagePicker from 'expo-image-picker';

import GStyles from 'assets/theme/GStyles';
import SendPicModal from '../SendPicModal';
import BookmarkOverlay from '../../BookmarkOverlay';

export const ToolBar = memo(function ToolBar() {
  const selectPhoto = useCallback(async () => {
    const result = (await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: false,
    })) as unknown as { uri: string };

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

  return (
    <View style={GStyles.flex1}>
      <Touchable style={styles.toolsItem} onPress={() => navigationService.navigate('ChatCamera')}>
        <TextM>camera</TextM>
      </Touchable>
      <Touchable style={styles.toolsItem} onPress={selectPhoto}>
        <TextM>photo</TextM>
      </Touchable>
      <Touchable
        style={styles.toolsItem}
        onPress={() =>
          BookmarkOverlay.showBookmarkList({
            onPressCallBack: item => {
              console.log(item);
            },
          })
        }>
        <TextM>Bookmark</TextM>
      </Touchable>
    </View>
  );
});

const styles = StyleSheet.create({
  toolsItem: {
    width: '25%',
    margin: pTd(2),
    backgroundColor: 'skyblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
