import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import CommonAvatar from 'components/CommonAvatar';
import * as ImagePicker from 'expo-image-picker';
import { getInfo } from 'utils/fs';
import { MAX_FILE_SIZE_BYTE } from '@portkey-wallet/constants/constants-ca/im';
import { uploadPortkeyImage } from 'utils/uploadImage';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';
import FastImage from 'react-native-fast-image';
import Loading from 'components/Loading';
import { isValidAvatarFile } from '@portkey-wallet/utils/reg';
import CommonToast from 'components/CommonToast';

type UploadImageType = {
  title: string;
  imageUrl?: string;
  avatarSize?: number;
  onChangeImage?: (url: string) => void;
};

export type ImageWithUploadFuncInstance = {
  selectPhoto: () => boolean;
  uploadPhoto: () => string;
};

const ImageWithUploadFunc = forwardRef(function ImageWithUploadFunc(props: UploadImageType, ref) {
  const { title, imageUrl, avatarSize = pTd(48), onChangeImage } = props;
  const [localPhotoFile, setLocalPhotoFile] = useState<ImagePicker.ImageInfo>();

  const sizeStyle = useMemo(
    () => ({
      width: Number(avatarSize),
      height: Number(avatarSize),
      borderRadius: Number(avatarSize) / 2,
    }),
    [avatarSize],
  );
  const selectPhoto = useCallback(async () => {
    try {
      Loading.show();
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: false,
        quality: 0.1,
      });
      if (result.cancelled || !result.uri) return;

      if (!isValidAvatarFile(result.uri)) return CommonToast.fail('Unsupported format. Please use jpeg, jpg, or png.');

      if (!result?.fileSize) {
        const info = await getInfo(result.uri);
        result.fileSize = info.size;
      }
      if (!result?.fileSize || result.fileSize > MAX_FILE_SIZE_BYTE) return;

      setLocalPhotoFile(result);
      return true;
    } catch (error) {
      console.log('==', error);
      return false;
    } finally {
      Loading.hide();
    }
  }, []);

  const uploadPhoto = useCallback(async () => {
    console.log('localPhotoFile', localPhotoFile);

    if (!localPhotoFile) return;
    try {
      const s3Url = await uploadPortkeyImage(localPhotoFile);

      if (s3Url) {
        onChangeImage?.(s3Url);
        console.log('s3Url', s3Url);
        return s3Url;
      }
    } catch (error) {
      throw new Error('upload fail');
    }
  }, [localPhotoFile, onChangeImage]);

  useImperativeHandle(
    ref,
    () => {
      return {
        selectPhoto,
        uploadPhoto,
      };
    },
    [selectPhoto, uploadPhoto],
  );

  if (localPhotoFile)
    return (
      <Touchable onPress={selectPhoto}>
        <FastImage style={[sizeStyle]} resizeMode="cover" source={{ uri: localPhotoFile.uri }} />
      </Touchable>
    );

  return (
    <Touchable onPress={selectPhoto}>
      <CommonAvatar
        svgName={imageUrl ? undefined : 'upload-avatar-button'}
        title={title}
        avatarSize={avatarSize}
        imageUrl={imageUrl}
        resizeMode="cover"
        shapeType="circular"
      />
    </Touchable>
  );
});

export default ImageWithUploadFunc;
