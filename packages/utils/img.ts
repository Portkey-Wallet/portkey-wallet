import { NFT_SMALL_SIZE } from '@portkey-wallet/constants/constants-ca/assets';

export const getAWSUrlWithSize = (
  url?: string,
  width: number | string = NFT_SMALL_SIZE,
  height: number | string = 'AUTO',
): string => {
  if (!url) return '';

  const sizeStr = `${width}x${height}`;
  const urlArr = url.split('/');
  const len = urlArr.length;
  return urlArr
    .slice(0, len - 1)
    .concat([sizeStr])
    .concat(urlArr[len - 1])
    .join('/');
};

export const formatImageSize = ({
  height = 0,
  width = 0,
  maxWidth = 100,
  maxHeight = 100,
}: {
  width?: string | number;
  height?: string | number;
  maxWidth?: number;
  maxHeight?: number;
}) => {
  if (typeof height === 'string') height = Number(height);
  if (typeof width === 'string') width = Number(width);
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  const tempWidth = Math.floor(width * ratio);
  const tempHeight = Math.floor(Math.max(height * ratio));
  return { width: tempWidth || maxWidth, height: tempHeight || maxHeight };
};
