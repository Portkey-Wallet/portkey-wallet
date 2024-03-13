import { NFT_SMALL_SIZE } from 'packages/constants/constants-ca/assets';

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
  minWidth,
  minHeight,
}: {
  width?: string | number;
  height?: string | number;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
}) => {
  if (typeof height === 'string') height = Number(height);
  if (typeof width === 'string') width = Number(width);
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  const tempWidth = Math.floor(width * ratio);
  const tempHeight = Math.floor(Math.max(height * ratio));

  const imageSize: any = { width: tempWidth || maxWidth, height: tempHeight || maxHeight };
  if (minWidth && imageSize.width < minWidth) {
    imageSize.minWidth = minWidth;
    delete imageSize.width;
  }

  if (minHeight && imageSize.height < minHeight) {
    imageSize.minHeight = minHeight;
    delete imageSize.height;
  }
  return imageSize;
};
