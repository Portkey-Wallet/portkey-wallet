import { isNotificationEvents } from '@portkey/providers';
import { PromptRouteTypes } from 'messages/InternalMessageTypes';
import NotificationService from 'service/NotificationService';
import { CreatePromptType } from 'types';
import type { PortKeyResultType } from 'utils/errorHandler';
import { getCurrentNetworkWallet } from 'utils/lib/SWGetReduxStore';

export default class PermissionController {
  notificationService: NotificationService;
  whitelist: string[];
  getPassword?: () => string | null;
  constructor({
    notificationService,
    whitelist = [],
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

  checkAllowMethod(methodName: string) {
    return this.whitelist.includes(methodName) || isNotificationEvents(methodName);
  }

  async checkCurrentNetworkIsRegister() {
    const currentNetworkWallet = await getCurrentNetworkWallet();
    const originChainId = currentNetworkWallet?.originChainId;
    return Boolean(originChainId && currentNetworkWallet?.[originChainId]?.caHash);
  }

  async registerCurrentNetworkWallet(): Promise<PortKeyResultType> {
    if (await this.checkCurrentNetworkIsRegister())
      return {
        error: 0,
        message: 'The current network has completed login',
      };
    // Not yet registered or logged in
    let routerType: keyof typeof PromptRouteTypes = 'REGISTER_WALLET';
    const currentNetworkWallet = await getCurrentNetworkWallet();
    if (currentNetworkWallet?.managerInfo) routerType = 'BLANK_PAGE';
    return await this.notificationService.openPrompt(
      {
        method: PromptRouteTypes[routerType],
      },
      'tabs',
    );
  }
  async checkCurrentNetworkOtherwiseRegister(methodName: string): Promise<PortKeyResultType> {
    if (this.checkAllowMethod(methodName))
      return {
        error: 0,
        message: 'no check',
      };
    return await this.registerCurrentNetworkWallet();
  }
}
