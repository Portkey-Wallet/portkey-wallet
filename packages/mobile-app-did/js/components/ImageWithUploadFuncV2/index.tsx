import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
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
import { View, StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
export enum ImageShowType {
  CIRCLE,
  NORMAL,
}

type UploadImageType = {
  title: string;
  imageUrl?: string;
  avatarSize?: number;
  onChangeImage?: (url: string) => void;
  defaultComponent?: React.ReactNode;
  type?: ImageShowType;
  onChooseSuccess?: (obj: ImagePicker.ImageInfo) => void;
};

export type ImageWithUploadFuncInstance = {
  selectPhoto: () => boolean;
  uploadPhoto: () => string;
  clear: () => string;
};

const ImageWithUploadFuncV2 = forwardRef(function ImageWithUploadFuncV2(props: UploadImageType, ref) {
  const { title, imageUrl, avatarSize = pTd(48), onChangeImage, defaultComponent, type, onChooseSuccess } = props;
  const [localPhotoFile, setLocalPhotoFile] = useState<ImagePicker.ImageInfo>();
  useEffect(() => {
    setLocalPhotoFile({
      uri: imageUrl || '',
      width: avatarSize,
      height: avatarSize,
      cancelled: true,
    });
  }, [avatarSize, imageUrl]);
  const sizeStyle = useMemo(() => {
    if (!!type && type === ImageShowType.NORMAL) {
      return {
        width: Number(avatarSize),
        height: Number(avatarSize),
        borderRadius: pTd(12),
      };
    }
    return {
      width: Number(avatarSize),
      height: Number(avatarSize),
      borderRadius: Number(avatarSize) / 2,
    };
  }, [avatarSize, type]);
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

      if (!isValidAvatarFile(result.uri)) return CommonToast.fail('Unsupported format. Please use jpeg, jpg or png.');

      if (!result?.fileSize) {
        const info = await getInfo(result.uri);
        result.fileSize = info.size;
      }
      if (!result?.fileSize || result.fileSize > MAX_FILE_SIZE_BYTE) return CommonToast.fail('The file is too large.');

      setLocalPhotoFile(result);
      onChooseSuccess?.(result);
      return true;
    } catch (error) {
      console.log('==', error);
      return false;
    } finally {
      Loading.hide();
    }
  }, [onChooseSuccess]);

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

  const clear = useCallback(async () => {
    setLocalPhotoFile(undefined);
    onChooseSuccess?.({
      uri: '',
      width: 0,
      height: 0,
      cancelled: false,
    });
  }, [onChooseSuccess]);

  useImperativeHandle(
    ref,
    () => {
      return {
        selectPhoto,
        uploadPhoto,
        clear,
      };
    },
    [selectPhoto, uploadPhoto, clear],
  );

  if (localPhotoFile && localPhotoFile.uri) {
    return (
      <Touchable onPress={selectPhoto}>
        <View style={styles.avatarWrap}>
          <CommonAvatar avatarSize={avatarSize} shapeType="square" imageUrl={imageUrl} />
        </View>
        {/* <FastImage style={[sizeStyle]} resizeMode="contain" source={{ uri: localPhotoFile.uri }} /> */}
      </Touchable>
    );
  }
  if (defaultComponent) {
    return <Touchable onPress={selectPhoto}>{defaultComponent}</Touchable>;
  }
  return (
    <Touchable onPress={selectPhoto}>
      <CommonAvatar
        svgName={imageUrl ? undefined : 'upload-avatar-button'}
        title={title}
        avatarSize={avatarSize}
        imageUrl={imageUrl}
        resizeMode="cover"
        shapeType="square"
        style={{ borderRadius: pTd(12) }}
      />
    </Touchable>
  );
});

export default ImageWithUploadFuncV2;

const styles = StyleSheet.create({
  avatarWrap: {
    overflow: 'hidden',
    borderWidth: pTd(1),
    borderRadius: pTd(12),
    borderColor: defaultColors.neutralBorder,
  },
});
