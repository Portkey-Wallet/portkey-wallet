import { useCallback, useEffect, useRef, useState } from 'react';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { AppState, AppStateStatus } from 'react-native';
import { useUnreadCount } from '@portkey-wallet/hooks/hooks-ca/im';
import { AppStatusUnit } from '@portkey-wallet/socket/socket-fcm/types';
import useEffectOnce from './useEffectOnce';

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

  useEffect(() => {
    timerRef.current = setInterval(() => {
      // console.log('report AppStatus', signalrFCM.fcmToken, signalrFCM.portkeyToken, signalrFCM.signalr);
      if (!signalrFCM.fcmToken) return;
      if (!signalrFCM.portkeyToken) return;
      if (!signalrFCM.signalr) return;

      signalrFCM.reportAppStatus(appStatus, unreadCount);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [appStatus, unreadCount]);

  useEffectOnce(() => {
    const listener = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      listener.remove();
    };
  });
}
