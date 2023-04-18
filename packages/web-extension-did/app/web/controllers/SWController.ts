/**
 * @file
 * connectWebAppByTab, disconnectWebAppByTab
 */
import errorHandler from 'utils/errorHandler';
import { setLocalStorage } from 'utils/storage/chromeStorage';
import { getConnections } from 'utils/storage/storage.utils';

export default class SWController {
  /**
   * Establish a connection and cache data when the page is initialized
   * Distinguish multi-window corresponding to unified URL by tabId
   */
  static async connectWebAppByTab(sender: chrome.runtime.MessageSender) {
    if (!sender.url || !sender?.tab?.id) throw errorHandler(600001);
    const _origin = new URL(sender.url).origin;
    const key = _origin;
    const connections = await getConnections();
    if (!connections[key]) {
      connections[key] = {
        tabs: [],
        permission: {},
      } as any;
    }
    const tabs = connections[key].tabs;
    const isHasTab = tabs.includes(sender.tab.id);
    if (isHasTab) return;
    tabs.push(sender.tab.id);

    connections[key] = {
      ...connections[key],
      id: sender.id,
      origin: sender.origin,
      permission: connections[key].permission,
      tabs,
    };
    return setLocalStorage({
      connections,
    });
  }

  /**
   * When the tab is closed and there is no authorization information, remove the corresponding data in the cache
   */
  static async disconnectWebAppByTab(tabId?: number) {
    if (!tabId) return;
    const connections = await getConnections();
    if (!connections) {
      return;
    }
    Object.entries(connections).forEach(([key, v]) => {
      connections[key].tabs = v.tabs.filter((id) => tabId !== id);
      if (connections[key].tabs.length === 0 && Object.keys(connections[key].permission).length === 0)
        delete connections[key];
    });
    return setLocalStorage({
      connections,
    });
  }
}
