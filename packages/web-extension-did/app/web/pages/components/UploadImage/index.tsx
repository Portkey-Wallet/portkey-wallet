import { Upload, message } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { ReactNode, useMemo } from 'react';

export interface IUploadImageProps {
  accept?: string;
  children?: ReactNode;
  getTemporaryDataURL?: (url: string) => void;
  getFile?: (file: RcFile) => void;
}

export default function UploadImage({ accept = 'image/*', children, getTemporaryDataURL, getFile }: IUploadImageProps) {
  const uploadProps = useMemo(
    () => ({
      className: 'upload-image',
      showUploadList: false,
      accept: accept,
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
          getTemporaryDataURL?.(src as string);
          getFile?.(paramFile);
        } catch (e) {
          message.error('Failed to load picture');
        }
        return false;
      },
    }),
    [accept, getFile, getTemporaryDataURL],
  );

  return <Upload {...uploadProps}>{children}</Upload>;
}
