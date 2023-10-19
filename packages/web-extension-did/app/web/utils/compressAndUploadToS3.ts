import { RcFile } from 'antd/lib/upload/interface';
import imageCompression from 'browser-image-compression';
import s3Instance from '@portkey-wallet/utils/s3';

const uploadImageToS3 = async (paramFile: RcFile) => {
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
  return s3Result.url;
};

export default uploadImageToS3;
