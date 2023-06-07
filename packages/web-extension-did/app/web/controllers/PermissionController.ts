import { isNotificationEvents } from '@portkey/providers';
import { PromptRouteTypes } from 'messages/InternalMessageTypes';
import NotificationService from 'service/NotificationService';
import { CreatePromptType } from 'types';
import type { PortKeyResultType } from 'utils/errorHandler';
import { getLocalStorage } from 'utils/storage/chromeStorage';
// import pendingTaskService from 'controllers/pendingController';

export default class PermissionController {
  notificationService: NotificationService;
  whitelist?: string[];
  getPassword?: () => string | null;
  constructor({
    notificationService,
    whitelist,
    getPassword,
  }: {
    notificationService: NotificationService;
    whitelist?: string[];
    getPassword?: () => string | null;
  }) {
    this.notificationService = notificationService;
    this.whitelist = whitelist;
    this.getPassword = getPassword;
  }

  async checkIsLock(
    seed?: string | null,
    promptType: CreatePromptType = 'windows',
    search?: object,
  ): Promise<PortKeyResultType> {
    if (!seed) {
      if (!search) search = { from: 'sw', type: 'unlock' };
      return await this.notificationService.openPrompt(
        {
          method: PromptRouteTypes.PERMISSION_CONTROLLER,
          search: JSON.stringify(search),
        },
        promptType,
      );
    }
    return {
      error: 0,
      message: 'Unlock',
    };
  }

  async checkIsLockOtherwiseUnlock(method: string): Promise<PortKeyResultType> {
    if (this.whitelist?.includes(method))
      return {
        error: 0,
        data: { method },
        message: 'no check',
      };
    const seed = this?.getPassword?.() ?? null;
    try {
      return await this.checkIsLock(seed);
    } catch (error) {
      return {
        error: 500001,
        message: 'Something error',
        Error: error,
      };
    }
  }

  getRegisterStatus() {
    return getLocalStorage('registerStatus');
  }

  async checkIsRegister() {
    const registerStatus = await getLocalStorage('registerStatus');
    if (registerStatus === 'Registered') {
      return true;
    } else {
      return false;
    }
  }

  async checkIsRegisterOtherwiseRegister(method: string): Promise<PortKeyResultType> {
    if (this.whitelist?.includes(method) || isNotificationEvents(method))
      return {
        error: 0,
        message: 'no check',
      };
    const registerStatus = await this.getRegisterStatus();
    if (registerStatus !== 'Registered') {
      // if (!search) search = { from: 'sw' };
      return await this.notificationService.openPrompt(
        {
          method: PromptRouteTypes[registerStatus === 'registeredNotGetCaAddress' ? 'BLANK_PAGE' : 'REGISTER_WALLET'],
          // search: JSON.stringify(search),
        },
        'tabs',
      );
    } else {
      return {
        error: 0,
        message: 'Registered',
      };
    }
  }
}
