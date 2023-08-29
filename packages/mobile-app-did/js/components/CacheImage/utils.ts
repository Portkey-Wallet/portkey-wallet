import { ImageProps } from 'react-native';
import { CacheImageProps } from '.';
import { checkExistsImage, getCacheImage, isLocalSource, isURISource } from 'utils/fs/img';
import { isLocalPath } from 'utils/fs';

const CacheTempMap: { [key: string]: CacheImageProps['source'] } = {};

export async function getLocalSource(source: ImageProps['source']) {
  if (!isURISource(source)) return source;

  if (isLocalSource(source)) return source;

  if (!CacheTempMap[source.uri || '']) {
    const localSource = await getCacheImage(source);
    if (localSource) CacheTempMap[source.uri || ''] = localSource;
  }
  return CacheTempMap[source.uri || ''];
}

export async function getLocalUri(uri: string) {
  if (isLocalPath(uri)) return { uri };
  if (!CacheTempMap[uri]) {
    const localPath = await checkExistsImage(uri);
    if (localPath) CacheTempMap[uri] = { uri: localPath };
  }
  return CacheTempMap[uri || ''];
}

export function initStateSource(source?: ImageProps['source']) {
  if (!source) return;
  if (!isURISource(source)) return source;
  if (isLocalSource(source)) return source;
  if (CacheTempMap[source.uri || '']) return CacheTempMap[source.uri || ''];
  return undefined;
}
