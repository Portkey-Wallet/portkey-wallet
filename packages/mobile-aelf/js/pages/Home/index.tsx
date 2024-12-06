import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@rneui/base';
import { ScrollView } from 'react-native-gesture-handler';
import SafeAreaBox from 'components/SafeAreaBox';
import navigationService from 'utils/navigationService';
import {
  CloudStorage,
  CloudStorageError,
  CloudStorageErrorCode,
  type CloudStorageFileStat,
  CloudStorageProvider,
  CloudStorageScope,
  useIsCloudAvailable,
} from 'react-native-cloud-storage';
import CommonButton from 'components/CommonButton';

export default function HomeScreen() {
  const [provider, setProvider] = useState(CloudStorage.getDefaultProvider());
  const [scope, setScope] = useState(CloudStorageScope.AppData);
  const [parentDirectory, setParentDirectory] = useState('/');
  const [filename, setFilename] = useState('test2.txt');
  const [stats, setStats] = useState<CloudStorageFileStat | null>(null);
  const [input, setInput] = useState('');
  const [appendInput, setAppendInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);

  const cloudStorage = useMemo(() => {
    return new CloudStorage(
      provider,
      provider === CloudStorageProvider.GoogleDrive ? { strictFilenames: true } : undefined,
    );
  }, [provider]);
  const cloudAvailable = useIsCloudAvailable(cloudStorage);
  useEffect(() => {
    console.log(cloudAvailable ? 'Cloud storage available' : 'Cloud storage not available');
  }, [cloudAvailable]);

  useEffect(() => {
    cloudStorage.setProviderOptions({ scope });
  }, [scope, cloudStorage]);

  useEffect(() => {
    setStats(null);
    setInput('');
  }, [parentDirectory, filename, scope]);

  const readFile = useCallback(async () => {
    try {
      const newStats = await cloudStorage.stat(parentDirectory + '/' + filename);
      setStats(newStats);
      console.log('File stats', newStats);
      if (newStats.isDirectory()) return;
      const content = await cloudStorage.readFile(parentDirectory + '/' + filename);
      console.log('content', filename, content);
    } catch (e) {
      if (e instanceof CloudStorageError) {
        console.log('read error', e);
        if (e.code === CloudStorageErrorCode.FILE_NOT_FOUND) {
          // setStats(null);
          // setInput('');
        } else {
          // console.warn('Native storage error', e.code, e.message);
        }
        // } else console.warn('Unknown error', e);
      }
    }
  }, [cloudStorage, filename, parentDirectory]);

  const test = useCallback(async () => {
    try {
      const exists = await cloudStorage.exists(parentDirectory);
      console.log('parentDirectory', exists);
      const contents = await cloudStorage.readdir(parentDirectory);
      console.log('contents', contents);
      // await cloudStorage.writeFile(parentDirectory + '/' + filename, 'testValue1');
      // await readFile();
    } catch (error) {
      console.log('test', test);
    }
  }, [cloudStorage, filename, parentDirectory, readFile]);

  return (
    <SafeAreaBox>
      <ScrollView>
        <Button
          title="Back"
          onPress={async () => {
            navigationService.goBack();
          }}
        />

        <CommonButton type="primary" onPress={test}>
          Test
        </CommonButton>
      </ScrollView>
    </SafeAreaBox>
  );
}
