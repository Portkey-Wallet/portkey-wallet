import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CloudStorage,
  CloudStorageError,
  // CloudStorageErrorCode,
  // type CloudStorageFileStat,
  CloudStorageProvider,
  // CloudStorageScope,
  useIsCloudAvailable,
} from 'react-native-cloud-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import CommonToast from '../../../components/CommonToast';
import Config from 'react-native-config';
GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  scopes: ['https://www.googleapis.com/auth/drive.appdata'],
});

function getFullPath(parentDirectory: string, fileName: string): string {
  return parentDirectory.endsWith('/') ? `${parentDirectory}${fileName}` : `${parentDirectory}/${fileName}`;
}

function commonCloudStorageError(e: any, from = '') {
  console.warn('commonCloudStorageError', e, from);
  if (e instanceof CloudStorageError) {
    // if (e.code === CloudStorageErrorCode.READ_ERROR) {
    //   CommonToast.fail('No backup found');
    // } else {
    //   CommonToast.fail(e.code);
    // }
  } else {
    CommonToast.fail('Something went wrong. Please try backing up later.');
  }
}

const PARENT_DIRECTORY = isIOS ? '/eoa/wallets' : '/';

export const useCloudStorage = () => {
  const [provider, setProvider] = useState(CloudStorage.getDefaultProvider());

  const [parentDirectory] = useState(PARENT_DIRECTORY);
  const [isParentDirectoryExist, setIsParentDirectoryExist] = useState<boolean>();

  const [loading, setLoading] = useState(false);

  const cloudStorage = useMemo(() => {
    return new CloudStorage(
      provider,
      provider === CloudStorageProvider.GoogleDrive ? { strictFilenames: true } : undefined,
    );
  }, [provider]);
  const cloudAvailable = useIsCloudAvailable(cloudStorage);

  // always alert google account select modal.
  const googleSignAndConfig = useCallback(
    async (needLogout = true) => {
      setLoading(true);
      if (cloudStorage.getProvider() !== CloudStorageProvider.GoogleDrive) {
        setProvider(CloudStorageProvider.GoogleDrive);
      }
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        console.log('CloudStorage, google services are available');
        if (needLogout) {
          await GoogleSignin.signOut();
        }

        const userInfo = await GoogleSignin.signIn();
        console.log(userInfo, '====userInfo CloudStorage');
        console.log('accessToken get start: ');
        const { accessToken } = await GoogleSignin.getTokens();
        console.log('accessToken: ', accessToken);
        cloudStorage.setProviderOptions({
          accessToken: accessToken.length ? accessToken : null,
        });
        return {
          success: true,
        };
      } catch (e) {
        console.log('googleSignAndConfig failed: ', e);
        return {
          success: false,
          message: 'Google Sign failed',
          error: e,
        };
      } finally {
        setLoading(false);
      }
    },
    [cloudStorage],
  );

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
      commonCloudStorageError(e, 'isDirectoryExists');
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
        const newStats = await cloudStorage.stat(getFullPath(parentDirectory, filename));
        // setStats(newStats);
        console.log('File stats', newStats, newStats.isDirectory(), getFullPath(parentDirectory, filename));
        if (newStats.isDirectory()) {
          return;
        }
        const fileContent = await cloudStorage.readFile(getFullPath(parentDirectory, filename));
        console.log('File content: ', fileContent, ' ---- filename: ', filename);
        return fileContent;
      } catch (e) {
        commonCloudStorageError(e, 'readFile');
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
        await cloudStorage.writeFile(getFullPath(parentDirectory, filename), input);
        readFile(filename);
        console.log('handleCreateFile done');
      } catch (e) {
        commonCloudStorageError(e, 'handleCreateFile');
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
      commonCloudStorageError(e, 'handleCreateDirectory');
    } finally {
      setLoading(false);
    }
  }, [cloudStorage, isDirectoryExists, isParentDirectoryExist, parentDirectory]);

  // List parent wallet/ privateKey Wallet addresses.
  const handleListContents = useCallback(async () => {
    setLoading(true);
    try {
      console.log('useCloudStorage - Directory contents v3 read file');
      const contents = await cloudStorage.readdir(parentDirectory);
      console.log(
        'useCloudStorage - Directory contents v3',
        contents,
        contents.length,
        contents.map(c => `• ${c}`).join('\n'),
      );
      return contents;
    } catch (e) {
      commonCloudStorageError(e, 'handleListContents');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cloudStorage, parentDirectory]);

  const handleDeleteFile = useCallback(
    async (filename: string) => {
      setLoading(true);
      try {
        await cloudStorage.unlink(getFullPath(parentDirectory, filename));
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
        commonCloudStorageError(e, 'handleDeleteDirectory');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteDirectoryAndroid = async () => {
    setLoading(true);
    try {
      const contents = await cloudStorage.readdir(parentDirectory);
      for (const file of contents) {
        console.log(`🗑️ unlink file: ${file}`);
        // await cloudStorage.unlink(`${parentDirectory}/${file}`);
        await cloudStorage.unlink(getFullPath(parentDirectory, file));
      }
      await isDirectoryExists();
      // setStats(null);
      // setInput('');
    } catch (e) {
      commonCloudStorageError(e, 'handleDeleteDirectoryAndroid');
    } finally {
      setLoading(false);
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
    handleDeleteDirectoryAndroid,
    handleListContents,
    handleCreateFile,
    readFile,
    googleSignAndConfig,
  };
};
