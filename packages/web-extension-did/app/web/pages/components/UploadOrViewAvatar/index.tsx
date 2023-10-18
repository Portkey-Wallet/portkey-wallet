import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import './index.less';
import ImageDisplay from '../ImageDisplay';
import { Upload, message } from 'antd';
import { useMemo, useState } from 'react';
import { RcFile } from 'antd/lib/upload/interface';

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
  uploadText?: string;
  setFile?: (file: RcFile) => void;
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
  uploadText = '',
  setFile,
}: IUploadOrViewAvatarProps) {
  const wrapperStyle = { width: wrapperWidth, height: wrapperHeight, minWidth: wrapperWidth, minHeight: wrapperHeight };
  const [newAvatarUrl, setNewAvatarUrl] = useState(avatarUrl);

  const uploadProps = useMemo(
    () => ({
      className: 'avatar-upload',
      showUploadList: false,
      accept: 'image/*',
      maxCount: 1,
      beforeUpload: async (paramFile: RcFile) => {
        try {
          const src = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(paramFile);
            reader.onload = () => {
              resolve(reader.result);
            };
            reader.onerror = (e) => {
              reject(e);
            };
          });
          setNewAvatarUrl(src as string);
          setFile?.(paramFile);
        } catch (e) {
          console.log('===image beforeUpload error', e);
          message.error('Failed to load file');
        }
        return false;
      },
    }),
    [setFile],
  );

  return isEdit ? (
    <Upload {...uploadProps}>
      <div className="flex-column-center upload-or-view-avatar-container">
        <div
          className={clsx(['flex-center', 'upload-or-view-avatar', 'upload-avatar', wrapperClass])}
          style={wrapperStyle}>
          {newAvatarUrl ? (
            <div className="upload-avatar-main">
              <ImageDisplay src={newAvatarUrl} defaultHeight={avatarDefaultHeight} />
              <div className="camera-icon-mask">
                <CustomSvg
                  type="Camera"
                  className={clsx(['camera-icon-edit', 'flex-center', cameraIconClass])}
                  style={{ width: cameraIconWidth, height: cameraIconHeight }}
                />
              </div>
            </div>
          ) : (
            <CustomSvg
              type="Camera"
              className={clsx(cameraIconClass, 'flex-center')}
              style={{ width: cameraIconWidth, height: cameraIconHeight }}
            />
          )}
        </div>
        {uploadText && <div className="upload-avatar-text">{uploadText}</div>}
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
