import { DownloadOptions, DownloadProgressData, FileSystemNetworkTaskProgressCallback } from 'expo-file-system';

export enum FileEnum {
  image = 'image',
  video = 'video',
  pdf = 'pdf',
  doc = 'doc',
  docx = 'docx',
  xls = 'xls',
  xlsx = 'xlsx',
}

export type CreateDownloadResumableParams = {
  uri: string;
  fileUri: string;
  options?: DownloadOptions;
  progressCallback?: FileSystemNetworkTaskProgressCallback<DownloadProgressData>;
  resumeData?: string;
};
export type ProgressData = DownloadProgressData & {
  progress: number;
};
