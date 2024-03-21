import { useCallback, useEffect, useRef } from 'react';
import { CreateDownloadResumableParams } from 'utils/fs/types';
import CacheImageUtils from './cacheUtils';

export function useOnDownload() {
  const ref = useRef<CacheImageUtils>();
  useEffect(() => {
    return () => {
      ref.current?.cancelRequest();
    };
  }, []);

  const initDownloadResumable = useCallback(async (params: CreateDownloadResumableParams) => {
    ref.current = new CacheImageUtils({ imageUri: params.uri, imagePath: params.fileUri });
  }, []);

  return useCallback(
    async (params: CreateDownloadResumableParams) => {
      await initDownloadResumable(params);
      await ref.current?.fetchImage();
    },
    [initDownloadResumable],
  );
}
