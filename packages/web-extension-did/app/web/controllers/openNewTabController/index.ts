import { apis } from 'utils/BrowserApis';
import { removeOpenTabs, saveOpenTabs } from 'utils/clearOpenTabs';

export default class OpenNewTabController {
  constructor() {
    this.openNewTab();
  }
  openNewTab() {
    const createdListener = async (tab: chrome.tabs.Tab) => {
      saveOpenTabs(tab.id || '');
    };

    apis.tabs.onCreated.addListener(createdListener);
    const rmListener = (tabId: number) => {
      removeOpenTabs(tabId);
    };
    apis.tabs.onRemoved.addListener(rmListener);
  }
}
