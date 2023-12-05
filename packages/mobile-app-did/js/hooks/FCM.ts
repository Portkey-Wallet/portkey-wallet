import { useEffect, useRef } from 'react';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { AppState } from 'react-native';
import { useUnreadCount } from '@portkey-wallet/hooks/hooks-ca/im';
import { AppStatusUnit } from '@portkey-wallet/socket/socket-fcm/types';
import { request } from '@portkey-wallet/api/api-did';

export function useReportingSignalR() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const unreadCount = useUnreadCount();

  useEffect(() => {
    if (!request.defaultConfig.baseURL) return;
    signalrFCM.doOpen({
      url: `${request.defaultConfig.baseURL}`,
    });
  }, []);

  useEffect(() => {
    // report AppStatus  and unReadMessage
    let appState = AppStatusUnit.BACKGROUND;
    if (AppState.currentState === 'background') appState = AppStatusUnit.BACKGROUND;
    if (AppState.currentState === 'active') appState = AppStatusUnit.FOREGROUND;

    timerRef.current = setInterval(() => {
      console.log('report AppStatus', signalrFCM.fcmToken, signalrFCM.portkeyToken, signalrFCM.signalr);
      if (!signalrFCM.fcmToken) return;
      if (!signalrFCM.portkeyToken) return;
      if (!signalrFCM.signalr) return;

      signalrFCM.reportAppStatus(appState, unreadCount);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [unreadCount]);
}
