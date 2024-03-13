import S3 from 'aws-sdk/clients/s3';
import AWS from 'aws-sdk';
import { randomId } from './';
import { File } from 'aws-sdk/clients/codecommit';

export interface IAWSConfig {
  Bucket: string;
  Key?: string;
  Body?: File | null;
  ACL: string;
}

export type UploadFileType = {
  url: string;
  hash: string;
  key: string;
};

class AWSManager {
  private static instance: AWSManager | null = null;

  private uploadBaseConfig: Required<IAWSConfig> = {
    Bucket: '',
    Key: '',
    Body: null,
    ACL: 'public-read',
  };

  constructor(options?: IAWSConfig) {
    this.uploadBaseConfig = Object.assign(this.uploadBaseConfig, options);
  }
  static get() {
    if (!AWSManager.instance) {
      AWSManager.instance = new AWSManager();
    }
    return AWSManager.instance;
  }

  async uploadFile(file: { body: File | string; suffix?: string }): Promise<UploadFileType> {
    const uuid = randomId();

    // const isBase64 = typeof file.body === 'string';
    const upload = new S3.ManagedUpload({
      params: {
        ...this.uploadBaseConfig,
        Key: `${uuid}-${Date.now()}${file.suffix ? '.' + file.suffix : ''}`,
        Body: typeof file.body === 'string' ? Buffer.from(file.body, 'base64') : file.body,
        // ContentEncoding: isBase64 ? 'base64' : undefined,
      },
    });

    const timer = setTimeout(() => {
      console.log('=====uploadFile abort');
      upload.abort();
    }, 12000);

    try {
      const res = await upload.promise();
      clearTimeout(timer);

      return {
        url: res?.Location || '',
        key: res?.Key || '',
        hash: res?.ETag ? res.ETag.replace(/"/g, '') : '',
      };
    } catch (error) {
      clearTimeout(timer);
      console.error('=====uploadFile error:', error);
      return Promise.reject(null);
    }
  }

  setConfig({ bucket, key }: { bucket: string; key: string }) {
    this.uploadBaseConfig.Bucket = bucket;
    AWS.config.update({
      region: 'ap-northeast-1',
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: key,
      }),
    });
  }
}

export default AWSManager.get();

export const formatRNImage = (
  file: {
    uri: string;
    width: number;
    height: number;
    type?: 'image' | 'video';
    fileName?: string | null;
    fileSize?: number;
    exif?: Record<string, any>;
  },
  fileBase64: string,
) => {
  console.log(file);
  return {
    body: fileBase64,
    suffix: file.uri.split('.').pop(),
    width: file.width,
    height: file.height,
  };
};

export const getThumbSize = (width: number, height: number, max = 100) => {
  const min = 1;
  const ratio = Math.min(max / width, max / height);
  if (ratio >= 1) return { thumbWidth: width, thumbHeight: height };
  const thumbWidth = Math.floor(Math.max(min, width * ratio));
  const thumbHeight = Math.floor(Math.max(min, height * ratio));
  return { thumbWidth, thumbHeight };
};
