import { Upload } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { RcFile } from 'antd/lib/upload/interface';
import { ZERO } from '@portkey-wallet/constants/misc';
import { MAX_FILE_SIZE } from '@portkey-wallet/constants/constants-ca/im';
import singleMessage from 'utils/singleMessage';
import CustomSvg from 'components/CustomSvg';
import uploadImageToS3 from 'utils/compressAndUploadToS3';
import './index.less';

export interface ICustomUploadProps {
  getFile?(file: File | undefined): void;
  getPreviewFile(file: string): void;
  setNewAvatarS3File(file: string): void;
  previewFile?: string;
  className?: string;
}

export default function FreeMintUpload({
  getFile,
  getPreviewFile,
  setNewAvatarS3File,
  className,
  previewFile,
}: ICustomUploadProps) {
  const [previewImage, setPreviewImage] = useState<string>(previewFile ?? '');
  const uploadProps = useMemo(
    () => ({
      className: 'free-mint-upload',
      showUploadList: false,
      accept: 'image/png,image/jpeg,image/jpg',
      beforeUpload: async (paramFile: RcFile) => {
        const sizeOk = ZERO.plus(paramFile.size / 1024 / 1024).isLessThanOrEqualTo(MAX_FILE_SIZE);
        if (!sizeOk) {
          singleMessage.warning('The file is too large.');
          return false;
        }
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
          getFile?.(paramFile);
          setPreviewImage(src as string);
          getPreviewFile(src as string);
          const s3Url = await uploadImageToS3(paramFile);
          setNewAvatarS3File(s3Url);
        } catch (e) {
          console.log('===image beforeUpload error', e);
        }
        return false;
      },
    }),
    [getFile, getPreviewFile, setNewAvatarS3File],
  );
  const handleDeleteImage = useCallback(() => {
    setPreviewImage('');
    getPreviewFile('');
    getFile?.(undefined);
    setNewAvatarS3File('');
  }, [getFile, getPreviewFile, setNewAvatarS3File]);
  return (
    <div className={className}>
      {previewImage ? (
        <div className="free-mint-preview-image">
          <img src={previewImage} alt="preview-image" />
          <CustomSvg type="FreeMintClose" onClick={handleDeleteImage} />
        </div>
      ) : (
        <Upload {...uploadProps}>
          <div className="free-mint-upload-container flex-center">
            <div className="flex-column-center">
              <CustomSvg type="FreeMintPlus" />
              <div className="flex-column-center upload-container-text">
                <div>Upload a picture</div>
                <div>Formats supported: JPG, JPEG, and PNG.</div>
                <div>Max size: 10 MB.</div>
              </div>
            </div>
          </div>
        </Upload>
      )}
    </div>
  );
}
