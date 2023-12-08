import { request } from '@portkey-wallet/api/api-did';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useUnreadCount } from '@portkey-wallet/hooks/hooks-ca/im';
import im from '@portkey-wallet/im';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { AppStatusUnit } from '@portkey-wallet/socket/socket-fcm/types';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { initFCMMessage, initFCMSignalR, setBadge } from 'utils/FCM';
import { getPageType } from 'utils/setBody';

export function useFCMEnable() {
  const isShowChat = useIsChatShow();
  const isPrompt = useMemo(() => getPageType() === 'Prompt', []);

  return useCallback(() => {
    // only im and popup
    return isShowChat && !isPrompt;
  }, [isPrompt, isShowChat]);
}

export default function useFCM() {
  const unreadCount = useUnreadCount();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isFCMEnabled = useFCMEnable();

  const initFCM = useCallback(async () => {
    if (!isFCMEnabled()) return;

    await initFCMSignalR();
    if (!request.defaultConfig.baseURL) return;
    if (signalrFCM.signalr) return;
    initFCMMessage();
    signalrFCM.doOpen({
      url: `${request.defaultConfig.baseURL}`,
    });
  }, [isFCMEnabled]);

  useEffect(() => {
    initFCM();
  }, [initFCM]);

  useEffect(() => {
    if (!isFCMEnabled()) return;
    timerRef.current = setInterval(() => {
      console.log('report AppStatus update', signalrFCM.fcmToken, signalrFCM.portkeyToken, signalrFCM.signalr);
      if (!signalrFCM.fcmToken) return;
      if (!signalrFCM.portkeyToken) return;
      if (!signalrFCM.signalr) return;
      if (!im.getInstance()) return;
      signalrFCM.reportAppStatus(AppStatusUnit.FOREGROUND, unreadCount);
      setBadge({ value: unreadCount });
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFCMEnabled, unreadCount]);
}
