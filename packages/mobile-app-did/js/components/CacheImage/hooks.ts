import { DownloadResumable } from 'expo-file-system';
import { useCallback, useEffect, useRef } from 'react';
import { createDownloadResumable } from 'utils/fs';
import { CreateDownloadResumableParams } from 'utils/fs/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UseDownloadResumable = CreateDownloadResumableParams & {
  resumable: DownloadResumable;
  finished?: boolean;
};

export function useOnDownload() {
  const ref = useRef<UseDownloadResumable>();
  useEffect(() => {
    return () => {
      if (!ref.current || ref.current.finished) return;
      const key = ref.current.uri;
      const downloadSnapshot = ref.current.resumable.savable();
      AsyncStorage.setItem(key, JSON.stringify(downloadSnapshot));
      ref.current = undefined;
    };
  }, []);

  const initDownloadResumable = useCallback(async (params: CreateDownloadResumableParams) => {
    const key = params.uri;
    try {
      const snapshotJson = await AsyncStorage.getItem(key);
      if (snapshotJson) {
        const snapshot = JSON.parse(snapshotJson);
        ref.current = {
          ...params,
          resumable: createDownloadResumable({ ...snapshot }),
        };
      }
    } catch (error) {
      ref.current = undefined;
    }
    if (!ref.current) {
      ref.current = {
        ...params,
        resumable: createDownloadResumable(params),
      };
    }
  }, []);

  return useCallback(
    async (params: CreateDownloadResumableParams) => {
      const key = params.uri;
      await initDownloadResumable(params);
      await ref.current?.resumable.downloadAsync();
      await AsyncStorage.removeItem(key);
      if (ref.current) ref.current.finished = true;
    },
    [initDownloadResumable],
  );
}
