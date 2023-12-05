import { request } from '@portkey-wallet/api/api-did';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useUnreadCount } from '@portkey-wallet/hooks/hooks-ca/im';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { AppStatusUnit } from '@portkey-wallet/socket/socket-fcm/types';
import { useEffect, useRef } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import { initFCMSignalR } from 'utils/FCM';

export default function useFCM() {
  const unreadCount = useUnreadCount();
  const isShowChat = useIsChatShow();
  const { isPrompt } = useCommonState();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      // only im
      if (!isShowChat) return;
      // only popup
      if (isPrompt) return;

      await initFCMSignalR();
      if (!request.defaultConfig.baseURL) return;
      signalrFCM.doOpen({
        url: `${request.defaultConfig.baseURL}`,
      });
    })();
  }, [isPrompt, isShowChat]);

  useEffect(() => {
    // only im
    if (!isShowChat) return;
    // only popup
    if (isPrompt) return;

    timerRef.current = setInterval(() => {
      console.log('report AppStatus update', signalrFCM.fcmToken, signalrFCM.portkeyToken, signalrFCM.signalr);
      if (!signalrFCM.fcmToken) return;
      if (!signalrFCM.portkeyToken) return;
      if (!signalrFCM.signalr) return;

      signalrFCM.reportAppStatus(AppStatusUnit.FOREGROUND, unreadCount);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPrompt, isShowChat, unreadCount]);
}
