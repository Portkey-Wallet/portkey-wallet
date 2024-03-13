import { RcFile } from 'antd/lib/upload/interface';
import imageCompression from 'browser-image-compression';
import s3Instance from '@portkey-wallet/utils/s3';

const uploadImageToS3 = async (paramFile: RcFile | File, isCompress = false) => {
  let compressionFile: RcFile | File = paramFile;
  if (isCompress) {
    const compressOptions = {
      maxSizeMB: 10,
      maxWidthOrHeight: 200,
      useWebWorker: true,
      libURL: `/js/browser-image-compression.js`,
    };

    // get compression image sources
    compressionFile = await imageCompression(paramFile, compressOptions);
  }

  const s3Result = await s3Instance.uploadFile({
    body: compressionFile,
  });
  return s3Result.url;
};

export default uploadImageToS3;
