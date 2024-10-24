import { ImageProps, ImageURISource } from 'react-native';
import {
  checkAndMakeDirectory,
  copyFileToPath,
  downloadFile,
  formatFilePath,
  getFilePath,
  isLocalPath,
  urlToLocalName,
} from './index';
import RNFS from 'react-native-fs';

import { FileEnum } from './types';

export const getLocalImagePath = (uri: string, id?: string) => {
  return getFilePath({ type: FileEnum.image, name: urlToLocalName(uri), id });
};

export const isLocalSource = (source: ImageURISource) => {
  return isLocalPath(source.uri || '');
};

export const checkExistsImage = async (uri?: string) => {
  try {
    if (!uri) {
      return false;
    }
    const { path } = getLocalImagePath(uri);
    const exists = await RNFS.exists(path);
    return exists ? path : false;
  } catch (error) {
    return false;
  }
};

export type GetCacheImageInfoResult = {
  source?: ImageURISource;
  path?: string;
};

export const getCacheImageInfo = async (source: ImageURISource): Promise<GetCacheImageInfoResult> => {
  if (!source.uri) {
    return { source };
  }
  let localPath;
  try {
    if (isLocalSource(source)) {
      return { source };
    }
    const { directory, path } = getLocalImagePath(source.uri);
    localPath = path;
    const exists = await checkExistsImage(source.uri);
    if (exists) {
      return { source: { uri: path } };
    }
    const existsDirectory = await checkAndMakeDirectory(directory);
    if (!existsDirectory) {
      return { source };
    }
  } catch (error) {
    //
  }
  return { path: localPath || '' };
};

export const downloadCacheImageSource = async (uri: string, path: string) => {
  await downloadFile(uri, path);
  return { uri: path };
};

export const getCacheImage = async (source: ImageURISource) => {
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
    return downloadCacheImageSource(source.uri, path);
  } catch (error) {
    return source;
  }
};

export const isURISource = (source: ImageProps['source']): source is ImageURISource => {
  return !!(typeof source !== 'number' && 'uri' in source && source.uri);
};

export const bindUriToLocalImage = async (originPath: string, uri: string) => {
  try {
    originPath = formatFilePath(originPath);
    const { directory, path } = await getLocalImagePath(uri);
    const existsDirectory = await checkAndMakeDirectory(directory);
    if (!existsDirectory) {
      return;
    }
    await copyFileToPath(originPath, path);
    return true;
  } catch (error) {
    return false;
  }
};
