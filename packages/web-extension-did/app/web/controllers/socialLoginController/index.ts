import { apis } from 'utils/BrowserApis';

const GOOGLE_OAUTH2_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const alarmsName = 'SocialLoginTimer';

export default class SocialLoginController {
  public isSocialLogin: boolean;
  public authTabId?: number;
  constructor() {
    this.isSocialLogin = false;
  }
  startSocialLogin(onCancel?: () => void) {
    this.isSocialLogin = true;

    const createdListener = async (tab: chrome.tabs.Tab) => {
      const isOAuth = await this.isOAuthTabs(tab.id as number);
      if (isOAuth) this.authTabId = tab.id;
    };

    apis.tabs.onCreated.addListener(createdListener);
    const rmListener = (tabId: number) => {
      if (tabId === this.authTabId) {
        apis.tabs.onCreated.removeListener(createdListener);
        apis.tabs.onRemoved.removeListener(rmListener);
        apis.alarms.create(alarmsName, {
          delayInMinutes: 0.05,
        });
        apis.alarms.onAlarm.addListener((alarm) => {
          if (alarm.name !== alarmsName) return;
          apis.alarms.clear(alarm.name);
          if (this.isSocialLogin) onCancel?.();
        });
      }
    };
    apis.tabs.onRemoved.addListener(rmListener);
  }

  finishSocialLogin() {
    this.isSocialLogin = false;
    this.authTabId = undefined;
    apis.alarms.clear(alarmsName);
  }

  isOAuthTabs(tabId: number): Promise<boolean | undefined> {
    return new Promise((resolve) => {
      apis.tabs.get(tabId, (tab: chrome.tabs.Tab) => {
        const isOAuth = (tab.url || tab.pendingUrl)?.includes(GOOGLE_OAUTH2_URL);
        resolve(isOAuth);
      });
    });
  }
}
