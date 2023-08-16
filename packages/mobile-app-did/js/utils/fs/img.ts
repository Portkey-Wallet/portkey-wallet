import { ImageProps, ImageURISource } from 'react-native';
import { checkAndMakeDirectory, downloadFile, getFilePath, getInfo, urlToLocalName } from '.';
import { FileEnum } from './types';

export const getLocalImagePath = (uri: string, id?: string) => {
  return getFilePath({ type: FileEnum.image, name: urlToLocalName(uri), id });
};

export const getCacheImage = async (source: ImageURISource) => {
  if (!source.uri) return source;
  try {
    const { directory, path } = getLocalImagePath(source.uri);
    const fileInfo = await getInfo(path);
    if (fileInfo.exists) return { uri: path };
    const existsDirectory = await checkAndMakeDirectory(directory);
    if (!existsDirectory) return source;
    await downloadFile(source.uri, path);
    return { uri: path };
  } catch (error) {
    return source;
  }
};

export const isURISource = (source: ImageProps['source']): source is ImageURISource => {
  return !!(typeof source !== 'number' && 'uri' in source && source.uri);
};
