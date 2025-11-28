import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { randomId } from './index';

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
  private s3Client: S3Client;

  private uploadBaseConfig: Required<IAWSConfig> = {
    Bucket: '',
    Key: '',
    Body: null,
    ACL: 'public-read',
  };

  constructor(options?: IAWSConfig) {
    this.uploadBaseConfig = Object.assign(this.uploadBaseConfig, options);

    // Initialize S3Client with default configuration
    this.s3Client = new S3Client({
      region: 'ap-northeast-1',
    });
  }
  static get() {
    if (!AWSManager.instance) {
      AWSManager.instance = new AWSManager();
    }
    return AWSManager.instance;
  }

  async uploadFile(file: { body: File | string; suffix?: string }): Promise<UploadFileType> {
    const uuid = randomId();
    const key = `${uuid}-${Date.now()}${file.suffix ? '.' + file.suffix : ''}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: this.uploadBaseConfig.Bucket,
      Key: key,
      Body: typeof file.body === 'string' ? Buffer.from(file.body, 'base64') : file.body,
      ACL: this.uploadBaseConfig.ACL as any,
    });

    const timer = setTimeout(() => {
      console.log('=====uploadFile timeout - aborting');
      // Note: In v3, we can't abort individual commands easily, but the timeout will still trigger
    }, 12000);

    try {
      const res = await this.s3Client.send(uploadCommand);
      clearTimeout(timer);

      return {
        url: `https://${this.uploadBaseConfig.Bucket}.s3.ap-northeast-1.amazonaws.com/${key}`,
        key: key,
        hash: res?.ETag ? res.ETag.replace(/"/g, '') : '',
      };
    } catch (error) {
      clearTimeout(timer);
      console.error('=====uploadFile error:', error);
      throw error;
    }
  }

  setConfig({ bucket, key }: { bucket: string; key: string }) {
    this.uploadBaseConfig.Bucket = bucket;

    // Update S3Client with new credentials
    this.s3Client = new S3Client({
      region: 'ap-northeast-1',
      credentials: fromCognitoIdentityPool({
        identityPoolId: key,
        clientConfig: { region: 'ap-northeast-1' },
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
    // type?: 'image' | 'video';
    // fileName?: string | null;
    // fileSize?: number;
    // exif?: Record<string, any>;
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
