import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import './index.less';
import ImageDisplay from '../ImageDisplay';
import { Upload, message } from 'antd';
import imageCompression from 'browser-image-compression';
import { useMemo, useState } from 'react';
import { RcFile } from 'antd/lib/upload/interface';
import s3Instance from '@portkey-wallet/utils/s3';

interface IUploadOrViewAvatarProps {
  wrapperClass?: string;
  wrapperWidth?: number;
  wrapperHeight?: number;
  cameraIconClass?: string;
  cameraIconWidth?: number;
  cameraIconHeight?: number;
  avatarUrl?: string;
  avatarDefaultHeight?: number;
  isEdit?: boolean;
  nameIndex?: string;
}

export default function UploadOrViewAvatar({
  wrapperClass,
  cameraIconClass,
  wrapperWidth = 60,
  wrapperHeight = 60,
  cameraIconWidth = 24,
  cameraIconHeight = 24,
  avatarUrl,
  avatarDefaultHeight = 60,
  isEdit = false,
  nameIndex = '',
}: IUploadOrViewAvatarProps) {
  const wrapperStyle = { width: wrapperWidth, height: wrapperHeight, minWidth: wrapperWidth, minHeight: wrapperHeight };
  const [newAvatarUrl, setNewAvatarUrl] = useState(avatarUrl);

  const uploadImageToS3 = async (paramFile: RcFile) => {
    try {
      const compressOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 200,
        useWebWorker: true,
      };

      // get compression image sources
      const compressionFile = await imageCompression(paramFile, compressOptions);

      const s3Result = await s3Instance.uploadFile({
        body: compressionFile,
      });

      setNewAvatarUrl(s3Result.url);
    } catch (e) {
      message.error('Failed to load picture');
    }
  };

  const uploadProps = useMemo(
    () => ({
      className: 'avatar-upload',
      showUploadList: false,
      accept: 'image/*',
      maxCount: 1,
      beforeUpload: async (paramFile: RcFile) => {
        await uploadImageToS3(paramFile);

        return false;
      },
    }),
    [],
  );

  return isEdit ? (
    <Upload {...uploadProps}>
      <div
        className={clsx(['flex-center', 'upload-or-view-avatar', 'upload-avatar', wrapperClass])}
        style={wrapperStyle}>
        {newAvatarUrl ? (
          <div className="upload-avatar-main">
            <ImageDisplay src={newAvatarUrl} defaultHeight={avatarDefaultHeight} />
            <div className="camera-icon-mask">
              <CustomSvg
                type="camera"
                className={clsx(['camera-icon-edit', cameraIconClass])}
                style={{ width: cameraIconWidth, height: cameraIconHeight }}
              />
            </div>
          </div>
        ) : (
          <CustomSvg
            type="camera"
            className={cameraIconClass}
            style={{ width: cameraIconWidth, height: cameraIconHeight }}
          />
        )}
      </div>
    </Upload>
  ) : (
    <div className={clsx(['flex-center', 'upload-or-view-avatar', 'view-avatar', wrapperClass])} style={wrapperStyle}>
      {newAvatarUrl ? (
        <ImageDisplay src={newAvatarUrl} defaultHeight={avatarDefaultHeight} />
      ) : (
        <div className="flex-center view-avatar-index" style={wrapperStyle}>
          {nameIndex}
        </div>
      )}
    </div>
  );
}
