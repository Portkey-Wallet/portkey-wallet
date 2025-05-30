import { Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import imageCompression from 'browser-image-compression';
import { ReactNode, useMemo } from 'react';

export interface IUploadImageProps {
  accept?: string;
  children?: ReactNode;
  isCompress?: boolean;
  getTemporaryDataURL?: (url: string) => void;
  getFile?: (file: File) => void;
}

export default function UploadImage({
  accept = 'image/*',
  children,
  isCompress = true,
  getTemporaryDataURL,
  getFile,
}: IUploadImageProps) {
  const uploadProps = useMemo(
    () => ({
      className: 'upload-image',
      showUploadList: false,
      accept: accept,
      maxCount: 1,
      beforeUpload: async (paramFile: RcFile) => {
        try {
          let targetFile: File | RcFile = paramFile;
          if (isCompress) {
            const compressOptions = {
              maxSizeMB: 10,
              maxWidthOrHeight: 200,
              useWebWorker: true,
              libURL: `/js/browser-image-compression.js`,
            };

            // get compression image sources
            targetFile = await imageCompression(paramFile, compressOptions);

            // get compression image error
            if (targetFile.type === 'error') return false;
          }

          // get compression image success
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

          getTemporaryDataURL?.(src as string);
          getFile?.(targetFile);
        } catch (error) {
          console.log('Failed to load picture', error);
        }
        return false;
      },
    }),
    [accept, getFile, getTemporaryDataURL, isCompress],
  );

  return <Upload {...uploadProps}>{children}</Upload>;
}
