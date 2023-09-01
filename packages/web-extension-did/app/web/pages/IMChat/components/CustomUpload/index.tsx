import { Upload, message } from 'antd';
import { useMemo } from 'react';
import { RcFile } from 'antd/lib/upload/interface';
import CustomSvg from 'components/CustomSvg';
import { ZERO } from '@portkey-wallet/constants/misc';
import { MAX_FILE_SIZE } from '@portkey-wallet/constants/constants-ca/im';
import { getPixel } from 'pages/IMChat/utils';
import { formatImageSize } from '@portkey-wallet/utils/img';
import { IPreviewImage } from '../ImageSendModal';
import { ImageMessageFileType } from '@portkey-wallet/hooks/hooks-ca/im';

export interface ICustomUploadProps {
  setPreviewImage: (p: IPreviewImage) => void;
  setFile: (p: ImageMessageFileType) => void;
}

export default function CustomUpload({ setPreviewImage, setFile }: ICustomUploadProps) {
  const uploadProps = useMemo(
    () => ({
      className: 'chat-input-upload',
      showUploadList: false,
      accept: 'image/*',
      beforeUpload: async (paramFile: RcFile) => {
        const sizeOk = ZERO.plus(paramFile.size / 1024 / 1024).isLessThanOrEqualTo(MAX_FILE_SIZE);
        if (!sizeOk) {
          message.info('File too large');
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
          message.error('Failed to send message');
        }
        return false;
      },
    }),
    [setFile, setPreviewImage],
  );
  return (
    <Upload {...uploadProps}>
      <CustomSvg type="Album" />
      <span className="upload-text">Picture</span>
    </Upload>
  );
}
