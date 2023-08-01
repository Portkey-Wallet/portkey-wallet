import * as FileSystem from 'expo-file-system';
import AElf from 'aelf-sdk';
import { CreateDownloadResumableParams, FileEnum, ProgressData } from './types';

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
