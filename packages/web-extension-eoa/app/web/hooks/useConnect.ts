import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCurrentTab } from 'utils/platforms';
import { useDapp, useWalletInfo } from 'store/Provider/hooks';

export default function useConnect() {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | undefined>();
  const { currentNetwork } = useWalletInfo();
  const { dappMap } = useDapp();
  const currentDapps = useMemo(() => dappMap[currentNetwork] ?? [], [dappMap, currentNetwork]);

  const getCurrentTabPermission = useCallback(async () => {
    const tab = await getCurrentTab();
    setCurrentTab(tab);
  }, []);

  const connectedSite = useMemo(() => {
    const url = currentTab?.url;
    if (!url) return;
    const origin = new URL(url).origin;
    return currentDapps.find((dapp) => dapp.origin === origin);
  }, [currentDapps, currentTab?.url]);

  useEffect(() => {
    getCurrentTabPermission();
  }, [getCurrentTabPermission]);

  return {
    dapp: connectedSite,
    origin: currentTab?.url,
  };
}
