import React, { forwardRef, useCallback, useImperativeHandle } from 'react';
import CommonAvatar from 'components/CommonAvatar';
import * as ImagePicker from 'expo-image-picker';
import { getInfo } from 'utils/fs';
import { MAX_FILE_SIZE_BYTE } from '@portkey-wallet/constants/constants-ca/im';

import { uploadPortkeyImage } from 'utils/uploadImage';
import Loading from 'components/Loading';
import Touchable from 'components/Touchable';
import { sleep } from '@portkey-wallet/utils';
import { pTd } from 'utils/unit';

type UploadImageType = {
  title: string;
  imageUrl?: string;
  avatarSize?: number;
  onChangeImage?: (url: string) => void;
};

export type ImageWithUploadFuncInstance = {
  selectPhotoAndUpload: () => void;
};

const ImageWithUploadFunc = forwardRef(function ImageWithUploadFunc(props: UploadImageType, ref) {
  const { title, imageUrl, avatarSize = pTd(48), onChangeImage } = props;

  const selectPhotoAndUpload = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: false,
        quality: 0.1,
      });
      if (result.cancelled || !result.uri) return;

      if (!result?.fileSize) {
        const info = await getInfo(result.uri);
        result.fileSize = info.size;
      }

      console.log('fileSize', result.fileSize);
      if (!result?.fileSize || result.fileSize > MAX_FILE_SIZE_BYTE) return;
      Loading.show();
      const s3Url = await uploadPortkeyImage(result);
      if (s3Url) {
        onChangeImage?.(s3Url);
        await sleep(500);
      }
    } catch (error) {
      console.log('==', error);
    } finally {
      Loading.hide();
    }
  }, [onChangeImage]);

  useImperativeHandle(
    ref,
    () => {
      return {
        selectPhotoAndUpload,
      };
    },
    [selectPhotoAndUpload],
  );

  return (
    <Touchable onPress={selectPhotoAndUpload}>
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
