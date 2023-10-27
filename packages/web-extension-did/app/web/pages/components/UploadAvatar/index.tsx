import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import './index.less';
import ImageDisplay from '../ImageDisplay';
import { CSSProperties, useState } from 'react';
import { RcFile } from 'antd/lib/upload/interface';
import UploadImage from '../UploadImage';
import { useEffectOnce } from 'react-use';

interface IUploadAvatarProps {
  wrapperClass?: string;
  wrapperStyle?: CSSProperties;
  cameraIconClass?: string;
  cameraIconStyle?: CSSProperties;
  avatarUrl?: string;
  nameIndex?: string;
  uploadText?: string;
  size?: 'large' | 'default';
  getTemporaryDataURL?: (url: string) => void;
  getFile?: (file: RcFile) => void;
  setFile?: (file: RcFile) => void;
}

export default function UploadAvatar({
  wrapperClass,
  wrapperStyle,
  cameraIconClass,
  cameraIconStyle,
  avatarUrl,
  uploadText = '',
  size = 'default',
  getTemporaryDataURL,
  getFile,
}: IUploadAvatarProps) {
  const [uploadAvatarClass, setUploadAvatarClass] = useState<'upload-avatar-large' | 'upload-avatar-default'>(
    'upload-avatar-default',
  );

  const [avatarDefaultHeight, setAvatarDefaultHeight] = useState<60 | 40>(40);

  const sizeRule = () => {
    switch (size) {
      case 'large':
        setUploadAvatarClass('upload-avatar-large');
        setAvatarDefaultHeight(60);
        break;

      case 'default':
        setUploadAvatarClass('upload-avatar-default');
        setAvatarDefaultHeight(40);
        break;

      default:
        break;
    }
    return size;
  };

  useEffectOnce(() => {
    sizeRule();
  });

  return (
    <UploadImage accept="image/png,image/jpeg,image/jpg" getTemporaryDataURL={getTemporaryDataURL} getFile={getFile}>
      <div className={clsx(['flex-column-center', 'upload-avatar-container'])}>
        <div className={clsx(['flex-center', 'upload-avatar', uploadAvatarClass, wrapperClass])} style={wrapperStyle}>
          {avatarUrl ? (
            <div className="upload-avatar-main">
              <ImageDisplay src={avatarUrl} defaultHeight={avatarDefaultHeight} className="avatar-img" />
              <div className="camera-icon-mask">
                <CustomSvg
                  type="Camera"
                  className={clsx(['camera-icon-edit', 'flex-center', cameraIconClass])}
                  style={cameraIconStyle}
                />
              </div>
            </div>
          ) : (
            <CustomSvg type="Camera" className={clsx(cameraIconClass, 'flex-center')} style={cameraIconStyle} />
          )}
        </div>
        {uploadText && <div className="upload-avatar-text">{uploadText}</div>}
      </div>
    </UploadImage>
  );
}
