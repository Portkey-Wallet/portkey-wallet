import { PromptRouteTypes } from 'messages/InternalMessageTypes';
import NotificationService from 'service/NotificationService';
import { CreatePromptType } from 'types';
import type { PortKeyResultType } from 'utils/errorHandler';
import { getLocalStorage } from 'utils/storage/chromeStorage';

export default class PermissionController {
  notificationService: NotificationService;
  allowedMethod?: string[];
  getPassword?: () => string | null;
  constructor({
    notificationService,
    allowedMethod,
    getPassword,
  }: {
    notificationService: NotificationService;
    allowedMethod?: string[];
    getPassword?: () => string | null;
  }) {
    this.notificationService = notificationService;
    this.allowedMethod = allowedMethod;
    this.getPassword = getPassword;
  }

  async checkIsLock(seed?: string | null, promptType: CreatePromptType = 'windows'): Promise<PortKeyResultType> {
    if (!seed) {
      return await this.notificationService.openPrompt(
        {
          method: PromptRouteTypes.PERMISSION_CONTROLLER,
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
    if (this.allowedMethod?.includes(method))
      return {
        error: 0,
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

  async checkRegisterStatus() {
    return await getLocalStorage('registerStatus');
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
    if (this.allowedMethod?.includes(method))
      return {
        error: 0,
        message: 'no check',
      };
    const registerStatus = await this.checkRegisterStatus();
    if (registerStatus !== 'Registered') {
      return await this.notificationService.openPrompt(
        {
          method: PromptRouteTypes[registerStatus === 'registeredNotGetCaAddress' ? 'BLANK_PAGE' : 'REGISTER_WALLET'],
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
