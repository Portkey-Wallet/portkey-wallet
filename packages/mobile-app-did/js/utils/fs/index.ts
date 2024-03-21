import * as FileSystem from 'expo-file-system';
import AElf from 'aelf-sdk';
import { CreateDownloadResumableParams, FileEnum, ProgressData } from './types';
import { isIOS } from '@portkey-wallet/utils/mobile/device';

export const getInfo = FileSystem.getInfoAsync;

export const documentDirectory = FileSystem.documentDirectory;

export const makeDirectory = FileSystem.makeDirectoryAsync;

export const checkAndMakeDirectory = async (fileUri: string) => {
  const fileInfo = await getInfo(fileUri);
  if (fileInfo.exists) return true;
  await makeDirectory(fileUri);
  return true;
};

export const downloadFile = FileSystem.downloadAsync;

export const createDownloadResumable = (params: CreateDownloadResumableParams) => {
  return FileSystem.createDownloadResumable(
    params.uri,
    params.fileUri,
    params.options,
    params.progressCallback,
    params.resumeData,
  );
};

export const progressDownloadFile = async (params: CreateDownloadResumableParams) => {
  const resumable = createDownloadResumable(params);
  return resumable.downloadAsync();
};
export const formatProgress = (data: FileSystem.DownloadProgressData): ProgressData => {
  return { ...data, progress: data.totalBytesWritten / data.totalBytesExpectedToWrite };
};

export const formatPath = (path: string) => {
  return path.slice(-1)[0] !== '/' ? path + '/' : path;
};
export const getFilePath = ({ id, name, type }: { id?: string; name: string; type?: FileEnum }) => {
  let path = documentDirectory || '';
  if (id) path = formatPath(path) + id;
  if (type) path = formatPath(path) + type;
  const directory = formatPath(path);
  return {
    directory,
    path: directory + name,
  };
};

export const urlToLocalName = (url: string) => {
  return AElf.utils.sha256(url) + url.split('/').splice(-1);
};

export const formatFilePath = (filePath: string) => {
  if (!isIOS) {
    if (!filePath.includes('file://')) return 'file://' + filePath;
  }
  return filePath;
};

export const copyFileToPath = async (originPath: string, newPath: string) => {
  originPath = formatFilePath(originPath);
  newPath = formatFilePath(newPath);
  return FileSystem.copyAsync({ from: originPath, to: newPath });
};

export const readFile = async (fileUri: string, options?: FileSystem.ReadingOptions) => {
  return FileSystem.readAsStringAsync(fileUri, options);
};

export const isLocalPath = (uri: string) => {
  return uri.startsWith('file://');
};
