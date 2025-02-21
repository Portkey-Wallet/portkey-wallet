import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CloudStorage,
  CloudStorageError,
  CloudStorageErrorCode,
  // type CloudStorageFileStat,
  CloudStorageProvider,
  // CloudStorageScope,
  useIsCloudAvailable,
} from 'react-native-cloud-storage';
import CommonToast from '../../../components/CommonToast';

function commonCloudStorageError(e: any) {
  console.warn('commonCloudStorageError', e);
  if (e instanceof CloudStorageError) {
    if (e.code === CloudStorageErrorCode.READ_ERROR) {
      CommonToast.fail('No backup found');
    } else {
      CommonToast.fail(e.code);
    }
  } else {
    CommonToast.fail('Something went wrong. Please try backing up later.');
  }
}

export const useCloudStorage = () => {
  // const [provider, setProvider] = useState(CloudStorage.getDefaultProvider());
  const [provider] = useState(CloudStorage.getDefaultProvider());
  // const [scope, setScope] = useState(CloudStorageScope.AppData);
  // const [parentDirectory, setParentDirectory] = useState('/portkey-eoa/wallet');
  // const [parentDirectory] = useState('/portkey-eoa/wallet');
  const [parentDirectory] = useState('/eoa/wallets');
  const [isParentDirectoryExist, setIsParentDirectoryExist] = useState<boolean>();
  // const [filename, setFilename] = useState('test.txt');
  // const [stats, setStats] = useState<CloudStorageFileStat | null>(null);
  // const [input, setInput] = useState('');
  // const [appendInput, setAppendInput] = useState('');
  // const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);

  const cloudStorage = useMemo(() => {
    return new CloudStorage(
      provider,
      provider === CloudStorageProvider.GoogleDrive ? { strictFilenames: true } : undefined,
    );
  }, [provider]);
  const cloudAvailable = useIsCloudAvailable(cloudStorage);

  const isDirectoryExists = useCallback(async () => {
    setLoading(true);
    console.log('useCloudStorage -  isDirectoryExists: start 1');
    try {
      console.log('useCloudStorage -  isDirectoryExists: start 2');
      const exists = await cloudStorage.exists(parentDirectory);
      console.log('useCloudStorage -  isDirectoryExists: 3', exists);
      setIsParentDirectoryExist(exists);
    } catch (e) {
      console.warn('useCloudStorage -  isDirectoryExists: catch 4', e);
      setIsParentDirectoryExist(false);
      commonCloudStorageError(e);
    } finally {
      console.warn('useCloudStorage -  isDirectoryExists: finally 5');
      setLoading(false);
    }
  }, [cloudStorage, parentDirectory]);

  const readFile = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    async (filename: string) => {
      setLoading(true);
      try {
        const newStats = await cloudStorage.stat(parentDirectory + '/' + filename);
        // setStats(newStats);
        console.log('File stats', newStats);
        if (newStats.isDirectory()) {
          return;
        }
        const fileContent = await cloudStorage.readFile(parentDirectory + '/' + filename);
        console.log('File content', fileContent);
        return fileContent;
      } catch (e) {
        // console.log('readFile: ', e);
        commonCloudStorageError(e);
        return false;
        // if (e instanceof CloudStorageError) {
        //   // TODO: return to page use, show Toast.
        //   if (e.code === CloudStorageErrorCode.FILE_NOT_FOUND) {
        //     // setStats(null);
        //     // setInput('');
        //     CommonToast.fail(e.code);
        //   } else {
        //     console.warn('Native storage error', e.code, e.message);
        //   }
        // } else {
        //   console.warn('Unknown error', e);
        // }
      } finally {
        setLoading(false);
      }
    },
    [cloudStorage, parentDirectory],
  );

  const handleCreateFile = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    async ({ filename, input }: { filename: string; input: string }) => {
      setLoading(true);
      try {
        await cloudStorage.writeFile(parentDirectory + '/' + filename, input);
        readFile(filename);
      } catch (e) {
        // console.warn(e);
        commonCloudStorageError(e);
      } finally {
        setLoading(false);
      }
    },
    [cloudStorage, parentDirectory, readFile],
  );

  const handleCreateDirectory = useCallback(async () => {
    console.log('useCloudStorage -  handleCreateDirectory: ', 'isParentDirectoryExist: ', isParentDirectoryExist);
    if (isParentDirectoryExist) {
      console.log('useCloudStorage -  handleCreateDirectory: ', 'skip');
      return;
    }
    console.log('useCloudStorage - handleCreateDirectory: ', 'create');
    setLoading(true);
    try {
      await cloudStorage.mkdir(parentDirectory);
      await isDirectoryExists();
      // readFile(filename);
    } catch (e) {
      // console.warn(e);
      commonCloudStorageError(e);
    } finally {
      setLoading(false);
    }
  }, [cloudStorage, isDirectoryExists, isParentDirectoryExist, parentDirectory]);

  // List parent wallet/ privateKey Wallet addresses.
  const handleListContents = useCallback(async () => {
    setLoading(true);
    try {
      const contents = await cloudStorage.readdir(parentDirectory);
      console.log('useCloudStorage - Directory contents', contents.length, contents.map(c => `• ${c}`).join('\n'));
      return contents;
    } catch (e) {
      // console.warn(e);
      commonCloudStorageError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cloudStorage, parentDirectory]);

  const handleDeleteFile = useCallback(
    async (filename: string) => {
      setLoading(true);
      try {
        await cloudStorage.unlink(parentDirectory + '/' + filename);
        await readFile(filename);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    },
    [cloudStorage, parentDirectory, readFile],
  );

  const handleDeleteDirectory = async (recursive?: boolean) => {
    if (recursive === undefined) {
      handleDeleteDirectory(false);
      // Alert.alert('Delete directory', 'Do you want to delete the directory and all its contents (recursively)?', [
      //   { text: 'Cancel', style: 'cancel' },
      //   { text: 'Directory only', onPress: () => handleDeleteDirectory(false) },
      //   { text: 'Recursively', onPress: () => handleDeleteDirectory(true) },
      // ]);
    } else {
      setLoading(true);
      try {
        await cloudStorage.rmdir(parentDirectory, { recursive });
        await isDirectoryExists();
        // setStats(null);
        // setInput('');
      } catch (e) {
        // console.warn(e);
        commonCloudStorageError(e);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    console.log('cloudAvailable: ', cloudAvailable);
    if (!cloudAvailable) {
      return;
    }
    isDirectoryExists();
  }, [isDirectoryExists, cloudAvailable]);

  return {
    loading,
    cloudStorage,
    cloudAvailable,
    handleCreateDirectory,
    handleDeleteFile,
    handleDeleteDirectory,
    handleListContents,
    handleCreateFile,
    readFile,
  };
};
