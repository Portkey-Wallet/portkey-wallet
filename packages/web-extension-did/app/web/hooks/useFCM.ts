import { useLatestRef } from '@portkey-wallet/hooks';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useUnreadCount } from '@portkey-wallet/hooks/hooks-ca/im';
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
  const lastUnreadCount = useLatestRef(unreadCount);

  const initFCM = useCallback(async () => {
    if (!isFCMEnabled()) return;

    await initFCMSignalR();
    initFCMMessage();
  }, [isFCMEnabled]);

  useEffect(() => {
    initFCM();
  }, [initFCM]);

  useEffect(() => {
    if (!isFCMEnabled()) return;
    timerRef.current = setInterval(() => {
      signalrFCM.reportAppStatus(AppStatusUnit.FOREGROUND, lastUnreadCount.current);
      setBadge({ value: lastUnreadCount.current });
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFCMEnabled]);
}
