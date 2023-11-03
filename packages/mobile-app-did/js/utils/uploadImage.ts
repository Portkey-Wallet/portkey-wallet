import { formatRNImage } from '@portkey-wallet/utils/s3';
import { readFile } from 'react-native-fs';
import s3Instance from '@portkey-wallet/utils/s3';
import { bindUriToLocalImage } from './fs/img';
import * as ImagePicker from 'expo-image-picker';

export const uploadPortkeyImage = async (file: ImagePicker.ImageInfo): Promise<string> => {
  const fileBase64 = await readFile(file.uri, { encoding: 'base64' });
  const data = formatRNImage(file, fileBase64);
  const s3Result = await s3Instance.uploadFile({
    body: data.body,
    suffix: data.suffix,
  });
  bindUriToLocalImage(file.uri, s3Result.url);
  return s3Result.url;
};
