import BadgeController from './BadgeController';

export default class GCMController {
  private onFCMMessage?: (message: chrome.gcm.IncomingMessage) => void;
  protected badgeController: BadgeController;

  constructor(badgeController: BadgeController) {
    this.badgeController = badgeController;
  }

  initFCMMessage() {
    if (this.onFCMMessage) return;

    this.onFCMMessage = (message: chrome.gcm.IncomingMessage) => {
      const { from, data = {} } = message;
      let _count = '';
      if (from === process.env.FCM_PROJECT_ID) {
        _count = (data as any)['gcm.notification.notification_count'];
      }
      console.log(message, '===onFCMMessaging');
      this.badgeController.setBadge({
        value: _count,
      });
    };
    chrome.gcm.onMessage.addListener(this.onFCMMessage);
  }

  unRegisterFCM() {
    this.badgeController.setBadge({ value: '' });
    chrome.gcm.unregister(() => {
      if (chrome.runtime.lastError) {
        console.log('chrome.runtime.lastError===chrome.gcm.unregister', chrome.runtime.lastError);
      } else {
        if (this.onFCMMessage) {
          console.log('cancel onFMCMessage');
          chrome.gcm.onMessage.removeListener(this.onFCMMessage);
          this.onFCMMessage = undefined;
        }
        console.log('===unregister=GCMToken');
      }
    });
  }
}
