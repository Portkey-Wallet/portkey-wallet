import getPromptRoute, { PromptMessage } from './getPromptRoute';
import { CreatePromptType, SendResponseFun, SendResponseParams } from 'types';
import { apis } from 'utils/BrowserApis';
import errorHandler from 'utils/errorHandler';
import getPromptConfig from 'service/NotificationService/getPromptConfig';
import ExtensionPlatform from 'utils/platforms/extension';
import { sleep } from '@portkey-wallet/utils';
// import OpenNewTabController from 'controllers/openNewTabController';

export interface NotificationType {
  sendResponse?: SendResponseFun;
  message: PromptMessage & { externalLink?: string };
  promptType?: CreatePromptType;
  promptConfig?: chrome.windows.CreateData;
}

export interface CloseParams extends SendResponseParams {
  windowId?: number;
}

/**
 * Open window or tab controller
 */
export default class NotificationService {
  protected openWindow: null | chrome.windows.Window;
  protected getPopupTimeout: NodeJS.Timeout | number | null;
  protected openTag: null | chrome.tabs.Tab;
  protected closeSender: Record<string, NotificationType | null> | null;
  protected platform: ExtensionPlatform;
  constructor() {
    this.openWindow = null;
    this.getPopupTimeout = null;
    this.openTag = null;
    this.closeSender = null;
    this.platform = new ExtensionPlatform();
    this.init();
  }
  init() {
    this.platform.windowOnRemovedListener((number) => {
      if (this.openWindow && this.openWindow.id === number) {
        this.openWindow = null;
      }
      if (this.closeSender?.[number]) {
        this.closeSender?.[number]?.sendResponse?.(errorHandler(200003));
        delete this.closeSender?.[number];
      }
    });

    this.platform.tabOnRemovedListener((number) => {
      if (this.openTag && this.openTag.id === number) {
        this.openTag = null;
      }
      if (this.closeSender?.[number]) {
        this.closeSender?.[number]?.sendResponse?.(errorHandler(200003));
        delete this.closeSender?.[number];
      }
    });
  }

  showWindow = async (notification: Omit<NotificationType, 'promptType'>): Promise<void | chrome.windows.Window> => {
    try {
      const promptConfig = notification?.promptConfig;

      const { height, width, top, left, isFullscreen } = await getPromptConfig({
        message: notification.message,
      });

      let url;
      if (notification.message.externalLink) {
        url = notification.message.externalLink;
      } else {
        const route = getPromptRoute(notification.message);
        url = apis.runtime.getURL('/prompt.html' + route);
      }

      const popup = await this._getPopup();
      if (popup && popup?.id) {
        this.platform.closeWindow(this.openWindow?.id);
        this.openWindow = null;
      }

      // create new notification popup
      let config: chrome.windows.CreateData = { url };
      if (promptConfig?.state === 'minimized') {
        config = { ...config, ...promptConfig };
      } else {
        config = {
          ...config,
          height,
          width,
          type: 'popup',
          focused: true,
          state: isFullscreen ? 'fullscreen' : 'normal',
          top,
          left,
          ...promptConfig,
        };
      }

      // create new notification popup
      const popupWindow = await this.platform.openWindow(config);
      console.log('popupWindow', popupWindow, promptConfig);

      // Firefox currently ignores left/top for create, but it works for update
      if (popupWindow.left !== left && popupWindow.state !== 'fullscreen' && config.state !== 'minimized') {
        if (!popupWindow.id) return;
        await this.platform.updateWindowPosition(popupWindow.id, left, top);
      }
      this.openWindow = popupWindow;
      this.closeSender = { ...this.closeSender, [popupWindow.id?.toString() ?? '']: notification };
      return popupWindow;
    } catch (error) {
      notification.sendResponse?.(errorHandler(500002, error));
    }
  };

  showTabsPrompt = async (notification: Omit<NotificationType, 'promptType'>) => {
    const route = getPromptRoute(notification.message);
    const tag = await this.platform.openTab({
      url: apis.runtime.getURL('/prompt.html' + route),
    });
    this.openTag = tag;
    this.closeSender = { ...this.closeSender, [tag.id?.toString() ?? '']: notification };
    // OpenNewTabController.saveOpenTabs(tag.id || '');
    return tag;
  };

  /***
   * Opens a prompt window outside of the extension
   * @param notification
   */
  open = async (notification: NotificationType) => {
    const promptType = notification.promptType ?? 'windows';
    if (promptType === 'windows' && this.openWindow) {
      // For now we're just going to close the window to get rid of the error
      // that is caused by already open windows swallowing all further requests
      this.platform.closeWindow(this.openWindow.id);
      this.openWindow = null;

      // Alternatively we could focus the old window, but this would cause
      // urgent 1-time messages to be lost, such as after dying in a game and
      // uploading a high-score. That message will be lost.
      // openWindow.focus();
      // return false;

      // A third option would be to add a queue, but this could cause
      // virus-like behavior as apps overflow the queue causing the user
      // to have to quit the apis to regain control.
    } else if (promptType === 'tabs' && this.openTag) {
      // OpenNewTabController.removeOpenTabs(this.openTag.id || '');
      this.platform.closeTab(this.openTag.id);
      this.openTag = null;
    }

    // Could not establish connection. Receiving end does not exist.
    // InternalMessage.payload(InternalMessageTypes.SET_PROMPT, JSON.stringify(notification)).send();
    // If we need setPrompt, use callback to complement it.

    this.getPopupTimeout && clearTimeout(this.getPopupTimeout);
    return new Promise((resolve) => {
      this.getPopupTimeout = setTimeout(async () => {
        try {
          let res;
          if (promptType === 'tabs') {
            res = await this.showTabsPrompt(notification);
          } else {
            res = await this.showWindow(notification);
          }
          resolve(res);
        } catch (error) {
          notification.sendResponse?.(errorHandler(500002, error));
        }
      }, 100);
    });
  };

  openPrompt = (
    message: NotificationType['message'],
    promptType: CreatePromptType = 'windows',
    promptConfig?: NotificationType['promptConfig'],
  ): Promise<SendResponseParams> => {
    return new Promise((resolve) => {
      console.log(message, 'openPrompt==message');
      const promptParam = {
        sendResponse: async (response?: SendResponseParams) => {
          await sleep(500);
          resolve(response ?? { error: 0, message: 'Nothing' });
        },
        message,
        promptType,
        promptConfig,
      };
      this.open(promptParam);
    });
  };

  /**
   * Checks all open Portkey windows, and returns the first one it finds that is a notification window (i.e. has the
   * type 'popup')
   *
   * @private
   */
  _getPopup = async () => {
    const windows = await this.platform.getAllWindows();
    return this._getPopupIn(windows);
  };

  /**
   * Given an array of windows, returns the 'popup' that has been opened by Portkey, or null if no such window exists.
   *
   * @private
   * @param {Array} windows - An array of objects containing data about the open Portkey extension windows.
   */
  _getPopupIn = (windows: chrome.windows.Window[]) => {
    return windows
      ? windows.find((win) => {
          // Returns notification popup
          return win && win.type === 'popup' && win.id === this?.openWindow?.id;
        })
      : null;
  };

  /***
   * Always use this method for closing notification popups.
   * Otherwise you will double send responses and one will always be null.
   */
  close = async (closeParams?: CloseParams, promptType: CreatePromptType = 'windows') => {
    const _id = await this.completedWithoutClose(closeParams, promptType);
    _id && apis[promptType].remove(_id);
    return _id;
  };
  /**
   * The user completes the action without closing the window
   */
  completedWithoutClose = async (closeParams?: CloseParams, promptType: CreatePromptType = 'windows') => {
    let _id = promptType === 'windows' ? this.openWindow?.id : closeParams?.windowId;
    if (!_id) {
      if (promptType === 'windows') throw 'The current window information is not obtained';
      const ele = await apis[promptType].getCurrent();
      _id = ele?.id;
    }
    const sender = this.closeSender?.[_id?.toString() ?? ''];
    sender?.sendResponse?.(closeParams);
    if (sender) {
      delete this.closeSender?.[_id?.toString() ?? ''];
    }
    return _id;
  };
}
