import React, { ReactElement, useCallback, useEffect, useMemo, useRef } from 'react';
import LockManager, { canLock } from 'utils/LockManager';
import useEffectOnce from 'hooks/useEffectOnce';
import usePrevious from 'hooks/usePrevious';
import { useSettings } from 'hooks/store';
import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { AppState, AppStateStatus } from 'react-native';
import { useCheckUpdate } from 'hooks/device';
let appState = 'active',
  changeTime = Date.now();
interface AppListenerProps {
  children: ReactElement;
}
const AutoLockUpTime = 5 * 60;

const AppListener: React.FC<AppListenerProps> = props => {
  const lockManager = useRef<LockManager>();
  const { walletInfo } = useCurrentWallet();
  const { autoLockingTime } = useSettings();
  const originChainId = useOriginChainId();
  const lockingTime = useMemo(() => {
    if (!walletInfo?.address || (walletInfo.address && !walletInfo[originChainId])) return AutoLockUpTime;
    if (autoLockingTime === 0 && !isIOS) return 0.5;
    return autoLockingTime;
  }, [autoLockingTime, originChainId, walletInfo]);
  const prevLockingTime = usePrevious(lockingTime);
  const checkUpdate = useCheckUpdate();

  useEffect(() => {
    if (prevLockingTime !== lockingTime) lockManager.current?.updateLockTime(lockingTime * 1000);
  }, [lockingTime, prevLockingTime]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      const currentTime = Date.now();
      if (nextAppState === 'active' && appState === 'background' && currentTime > changeTime + 1000) checkUpdate();
      if (nextAppState === 'background') {
        if (canLock) appState = nextAppState;
        changeTime = currentTime;
      } else {
        appState = nextAppState;
      }
    },
    [checkUpdate],
  );
  useEffectOnce(() => {
    const timer = setTimeout(checkUpdate, 1000);
    const listener = AppState.addEventListener('change', handleAppStateChange);
    lockManager.current = new LockManager(lockingTime * 1000);
    return () => {
      timer && clearTimeout(timer);
      lockManager.current?.stopListening();
      listener.remove();
    };
  });

  return props.children;
};

export default AppListener;
