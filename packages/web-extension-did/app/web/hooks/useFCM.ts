import { request } from '@portkey-wallet/api/api-did';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useUnreadCount } from '@portkey-wallet/hooks/hooks-ca/im';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { AppStatusUnit } from '@portkey-wallet/socket/socket-fcm/types';
import { useRef } from 'react';
import { useEffectOnce } from 'react-use';
import { useCommonState } from 'store/Provider/hooks';
import { initFCMSignalR } from 'utils/FCM';

export default function useFCM() {
  const unreadCount = useUnreadCount();
  const isShowChat = useIsChatShow();
  const { isPrompt } = useCommonState();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffectOnce(() => {
    // only im
    if (!isShowChat) return;
    initFCMSignalR();
    if (!request.defaultConfig.baseURL) return;
    if (isPrompt) return;
    signalrFCM.doOpen({
      url: `${request.defaultConfig.baseURL}`,
    });
  });

  useEffectOnce(() => {
    // only im
    if (!isShowChat) return;
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
  });
}
