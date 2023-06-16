import { apis } from 'utils/BrowserApis';
import { getLocalStorage, setLocalStorage } from 'utils/storage/chromeStorage';

export default class OpenNewTabController {
  static onOpenNewTab() {
    const createdListener = async (tab: chrome.tabs.Tab) => {
      if (tab.id) {
        OpenNewTabController.saveOpenTabs(tab.id + '');
      }
    };

    apis.tabs.onCreated.addListener(createdListener);
    const rmListener = (tabId: number) => {
      OpenNewTabController.removeOpenTabs(tabId);
    };
    apis.tabs.onRemoved.addListener(rmListener);
  }

  static async removeOpenTabs(tabId: string | number) {
    if (!tabId) return;
    tabId = String(tabId);
    const openTabsId = await getLocalStorage('openTabsId');
    const newTabsId = openTabsId?.filter((id: string) => id !== tabId);
    setLocalStorage({ openTabsId: newTabsId });
  }

  static async saveOpenTabs(tabId: string | number) {
    if (!tabId) return;
    const openedTabsId = await getLocalStorage('openTabsId');

    let newTabsId = [];
    if (openedTabsId) {
      newTabsId = [...openedTabsId, tabId + ''];
    } else {
      newTabsId = [tabId];
    }

    setLocalStorage({ openTabsId: newTabsId });
  }

  static async closeOpenTabs(keepCurTabAlive = false) {
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
        const opTab = await apis.tabs.get(+tab);
        if ((opTab.url || opTab?.pendingUrl)?.includes(extId)) {
          chrome.tabs.remove(Number(tab));
        }
      });
      const openTabsId = keepCurTabAlive ? [curTabId] : [];
      setLocalStorage({ openTabsId });
    }
  }
}
