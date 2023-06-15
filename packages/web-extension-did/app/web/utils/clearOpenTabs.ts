import { apis } from './BrowserApis';
import { getLocalStorage, setLocalStorage } from './storage/chromeStorage';

export default async function closeOpenTabs(keepCurTabAlive = false) {
  const openTabs = await getLocalStorage('openTabsId');
  let curTabId = 0;
  if (keepCurTabAlive) {
    const window = await chrome.windows.getCurrent();
    const tabs = await chrome.tabs.query({ windowId: window.id, active: true });
    if (tabs.length !== 0 && !!tabs[0].id) {
      curTabId = tabs[0].id;
    }
  }

  if (openTabs) {
    openTabs.forEach(async (tab: string) => {
      if (keepCurTabAlive) {
        if (Number(tab) === curTabId) return;
      }
      const extId = apis.runtime.id;
      const t = await apis.tabs.get(+tab);
      if (t.pendingUrl?.includes(extId)) {
        chrome.tabs.remove(Number(tab));
      }
    });
    const openTabsId = keepCurTabAlive ? [curTabId] : [];
    setLocalStorage({ openTabsId });
  }
}

export async function saveOpenTabs(tabId: string | number) {
  if (!tabId) return;
  const openedTabsId = await getLocalStorage('openTabsId');

  let newTabsId = [];
  if (openedTabsId) {
    newTabsId = [...openedTabsId, tabId];
  } else {
    newTabsId = [tabId];
  }

  setLocalStorage({ openTabsId: newTabsId });
}

export async function removeOpenTabs(tabId: string | number) {
  if (!tabId) return;
  tabId = String(tabId);
  const openTabsId = await getLocalStorage('openTabsId');
  const newTabsId = openTabsId?.filter((id: string) => id !== tabId);
  setLocalStorage({ openTabsId: newTabsId });
}
