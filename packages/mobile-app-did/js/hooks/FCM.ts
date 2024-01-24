import { useCallback, useEffect, useRef, useState } from 'react';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { AppState, AppStateStatus } from 'react-native';
import { useUnreadCount } from '@portkey-wallet/hooks/hooks-ca/im';
import { AppStatusUnit } from '@portkey-wallet/socket/socket-fcm/types';
import useEffectOnce from './useEffectOnce';
import { useLatestRef } from '@portkey-wallet/hooks';

export function useReportingSignalR() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const unreadCount = useUnreadCount();
  const [appStatus, setAppStatus] = useState<AppStatusUnit>(AppStatusUnit.BACKGROUND);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    // report AppStatus and unReadMessage
    let appState = AppStatusUnit.FOREGROUND;
    if (nextAppState === 'background') appState = AppStatusUnit.BACKGROUND;
    if (nextAppState === 'active') appState = AppStatusUnit.FOREGROUND;

    setAppStatus(appState);
  }, []);

  const lastAppStatus = useLatestRef(appStatus);
  const lastUnreadCount = useLatestRef(unreadCount);

  const reportStatus = useCallback(async () => {
    try {
      await signalrFCM.reportAppStatus(lastAppStatus.current, lastUnreadCount.current);
    } catch (error) {
      console.log('reportStatus error', error);
    }
  }, [lastAppStatus, lastUnreadCount]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      reportStatus();
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffectOnce(() => {
    const listener = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      listener.remove();
    };
  });
}
