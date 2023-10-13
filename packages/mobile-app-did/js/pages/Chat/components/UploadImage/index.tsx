import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import CommonAvatar from 'components/CommonAvatar';
import * as ImagePicker from 'expo-image-picker';
import { getInfo } from 'utils/fs';
import { MAX_FILE_SIZE_BYTE } from '@portkey-wallet/constants/constants-ca/im';

import { uploadPortkeyImage } from 'utils/uploadImage';
import Loading from 'components/Loading';
import Touchable from 'components/Touchable';

type UploadImageType = {
  title: string;
  imageUrl?: string;
  onChangeImage?: (url: string) => void;
};

function UploadImage(props: UploadImageType) {
  const { title, imageUrl, onChangeImage } = props;

  const selectPhoto = useCallback(async () => {
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
      if (!result?.fileSize || result.fileSize > MAX_FILE_SIZE_BYTE) return;
      Loading.show();
      const s3Url = await uploadPortkeyImage(result);
      if (s3Url) onChangeImage?.(s3Url);
    } catch (error) {
      console.log('==', error);
    } finally {
      Loading.hide();
    }
  }, [onChangeImage]);

  return (
    <View style={styles.wrap}>
      <Touchable onPress={selectPhoto}>
        <CommonAvatar title={title} avatarSize={60} imageUrl={imageUrl} resizeMode="cover" />
      </Touchable>
    </View>
  );
}

export default UploadImage;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'pink',
  },
});
