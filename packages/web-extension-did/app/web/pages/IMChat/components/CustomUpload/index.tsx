import { Upload } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import { RcFile } from 'antd/lib/upload/interface';
import CustomSvg from 'components/CustomSvg';
import { ZERO } from '@portkey-wallet/constants/misc';
import { MAX_FILE_SIZE } from '@portkey-wallet/constants/constants-ca/im';
import { getPixel } from 'pages/IMChat/utils';
import { formatImageSize } from '@portkey-wallet/utils/img';
import { ImageMessageFileType } from '@portkey-wallet/hooks/hooks-ca/im';
import { UploadFileType } from '@portkey-wallet/utils/s3';
import PhotoSendModal, { IPreviewImage } from 'pages/IMChat/components/ImageSendModal';
import singleMessage from 'utils/singleMessage';

export interface ICustomUploadProps {
  sendImage: (file: ImageMessageFileType) => Promise<UploadFileType>;
  onSuccess: () => void;
  handleSendMsgError: (e: any) => void;
}

export default function CustomUpload({ sendImage, onSuccess, handleSendMsgError }: ICustomUploadProps) {
  const [file, setFile] = useState<ImageMessageFileType>();
  const [previewImage, setPreviewImage] = useState<IPreviewImage>();
  const sendImgModalRef = useRef<any>(null);
  const handleUpload = useCallback(async () => {
    try {
      await sendImage(file!);
      onSuccess();
      setPreviewImage(undefined);
      setFile(undefined);
    } catch (e: any) {
      handleSendMsgError(e);
    }
  }, [file, handleSendMsgError, onSuccess, sendImage]);
  const uploadProps = useMemo(
    () => ({
      className: 'chat-input-upload',
      showUploadList: false,
      accept: 'image/*',
      beforeUpload: async (paramFile: RcFile) => {
        const sizeOk = ZERO.plus(paramFile.size / 1024 / 1024).isLessThanOrEqualTo(MAX_FILE_SIZE);
        if (!sizeOk) {
          singleMessage.info('File too large');
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
          const { width, height } = await getPixel(src as string);
          const imageSize = formatImageSize({ width, height, maxWidth: 300, maxHeight: 360 });
          setPreviewImage({ src: src as string, width: imageSize.width, height: imageSize.height });
          setFile({ body: paramFile, width, height });
        } catch (e) {
          console.log('===image beforeUpload error', e);
          singleMessage.error('Failed to send message');
        }
        return false;
      },
    }),
    [setFile, setPreviewImage],
  );
  return (
    <>
      <Upload {...uploadProps}>
        <CustomSvg type="Album" />
        <span className="upload-text">Picture</span>
      </Upload>
      <PhotoSendModal
        ref={sendImgModalRef}
        open={!!previewImage?.src}
        file={previewImage}
        onConfirm={handleUpload}
        onCancel={() => {
          setPreviewImage(undefined);
          setFile(undefined);
        }}
      />
    </>
  );
}
