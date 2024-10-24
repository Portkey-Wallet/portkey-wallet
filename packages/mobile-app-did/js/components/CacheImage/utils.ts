import { ImageProps, ImageURISource } from 'react-native';
import { CacheImageProps } from './index';
import { checkExistsImage, getCacheImage, getCacheImageInfo, isLocalSource, isURISource } from 'utils/fs/img';
import { isLocalPath } from 'utils/fs';
import { CreateDownloadResumableParams } from 'utils/fs/types';

const CacheTempMap: { [key: string]: CacheImageProps['source'] } = {};

export async function getLocalSource(source: ImageProps['source']) {
  if (!isURISource(source)) {
    return source;
  }

  if (isLocalSource(source)) {
    return source;
  }

  if (!CacheTempMap[source.uri || '']) {
    const localSource = await getCacheImage(source);
    if (localSource) {
      CacheTempMap[source.uri || ''] = localSource;
    }
  }
  return CacheTempMap[source.uri || ''];
}

export const getCacheImageByOnDownload = async ({
  source,
  onDownload,
}: {
  onDownload: (params: CreateDownloadResumableParams) => Promise<void>;
  source: ImageURISource;
}) => {
  if (!source.uri) {
    return source;
  }
  try {
    const { source: imageSource, path } = await getCacheImageInfo(source);
    if (imageSource) {
      return imageSource;
    }
    if (!path) {
      return source;
    }
    if (!CacheTempMap[source.uri || '']) {
      await onDownload({ uri: source.uri, fileUri: path });
      CacheTempMap[source.uri || ''] = { uri: path };
    }
    return CacheTempMap[source.uri || ''];
  } catch (error) {
    return source;
  }
};

export async function getLocalSourceByResumable({
  source,
  onDownload,
}: {
  onDownload: (params: CreateDownloadResumableParams) => Promise<void>;
  source: ImageProps['source'];
}) {
  if (!isURISource(source)) {
    return source;
  }

  if (isLocalSource(source)) {
    return source;
  }

  return getCacheImageByOnDownload({ source, onDownload });
}

export async function getLocalUri(uri: string) {
  if (isLocalPath(uri)) {
    return { uri };
  }
  if (!CacheTempMap[uri]) {
    const localPath = await checkExistsImage(uri);
    if (localPath) {
      CacheTempMap[uri] = { uri: localPath };
    }
  }
  return CacheTempMap[uri || ''];
}

export function initStateSource(source?: ImageProps['source'], originUri?: string) {
  if (!source) {
    return;
  }
  if (!isURISource(source)) {
    return source;
  }
  if (isLocalSource(source)) {
    return source;
  }
  if (originUri && CacheTempMap[originUri]) {
    return CacheTempMap[originUri];
  }
  if (source.uri && CacheTempMap[source.uri]) {
    return CacheTempMap[source.uri];
  }
  return undefined;
}
