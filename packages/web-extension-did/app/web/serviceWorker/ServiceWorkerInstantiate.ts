import { getLocalStorage, setLocalStorage } from 'utils/storage/chromeStorage';
import { AutoLockDataKey, AutoLockDataType, DefaultLock } from 'constants/lock';
import SWEventController, { DappEventPack } from 'controllers/SWEventController';
import PermissionController from 'controllers/PermissionController';
import NotificationService, { CloseParams } from 'service/NotificationService';
import ApprovalController from 'controllers/approval/ApprovalController';
import { InternalMessageData, IPageState } from 'types/SW';
import AELFMethodController from 'controllers/methodController/AELFMethodController';
import InternalMessageTypes, {
  PortkeyMessageTypes,
  PromptRouteTypes,
  WalletMessageTypes,
} from 'messages/InternalMessageTypes';
import InternalMessage from 'messages/InternalMessage';
import { CreatePromptType, SendResponseFun } from 'types';
import errorHandler from 'utils/errorHandler';
import { apis } from 'utils/BrowserApis';
import SocialLoginController from 'controllers/socialLoginController';
import { LocalStream } from 'utils/extensionStreams';
import { MethodsWallet, MethodsBase } from '@portkey/provider-types';
import OpenNewTabController from 'controllers/openNewTabController';
import BadgeController from 'controllers/BadgeController';
import GCMController from 'controllers/GCMController';

const notificationService = new NotificationService();
const socialLoginService = new SocialLoginController();
OpenNewTabController.onOpenNewTab();

let seed: string | null = null;

let pageState: IPageState = {
  lockTime: AutoLockDataType[DefaultLock], // minutes
};

const permissionWhitelist = [
  // portkey method
  PortkeyMessageTypes.GET_SEED,
  PortkeyMessageTypes.SET_SEED,
  PortkeyMessageTypes.CLEAR_SEED,
  PortkeyMessageTypes.LOCK_WALLET,
  PortkeyMessageTypes.CLOSE_PROMPT,
  PortkeyMessageTypes.REGISTER_WALLET,
  PortkeyMessageTypes.REGISTER_START_WALLET,
  PortkeyMessageTypes.LOGIN_WALLET,
  PortkeyMessageTypes.CHECK_WALLET_STATUS,
  PortkeyMessageTypes.EXPAND_FULL_SCREEN,
  PortkeyMessageTypes.ACTIVE_LOCK_STATUS,
  PortkeyMessageTypes.PERMISSION_FINISH,
  PortkeyMessageTypes.SOCIAL_LOGIN,
  PortkeyMessageTypes.OPEN_RECAPTCHA_PAGE,
  PortkeyMessageTypes.SET_BADGE,
  PortkeyMessageTypes.UN_REGISTER_FCM,
  PortkeyMessageTypes.INIT_FCM_MESSAGE,
  WalletMessageTypes.SET_RECAPTCHA_CODE_V2,
  WalletMessageTypes.SOCIAL_LOGIN,
  MethodsWallet.GET_WALLET_STATE,
  // The method that requires the dapp not to trigger the lock call
  MethodsBase.ACCOUNTS,
  MethodsBase.CHAIN_ID,
  MethodsBase.CHAIN_IDS,
  MethodsBase.CHAINS_INFO,
];

const initPageState = async () => {
  const lockTime = await getLocalStorage('lockTime');
  pageState = {
    lockTime: AutoLockDataType[lockTime as AutoLockDataKey] ?? AutoLockDataType[DefaultLock],
  };
};

// This is the script that runs in the extension's serviceWorker ( singleton )
export default class ServiceWorkerInstantiate {
  protected permissionController: PermissionController;
  protected approvalController: ApprovalController;
  protected aelfMethodController: AELFMethodController;
  protected badgeController: BadgeController;
  protected gcmController: GCMController;
  constructor() {
    // Controller that handles portkey checks
    this.permissionController = new PermissionController({
      notificationService,
      whitelist: permissionWhitelist,
      getPassword: () => seed,
    });
    // Controller that handles user authorization
    this.approvalController = new ApprovalController({
      notificationService,
      getPageState: this.getPageState,
    });
    // Controller that handles aelf transactions
    this.aelfMethodController = new AELFMethodController({
      notificationService,
      approvalController: this.approvalController,
      getPageState: this.getPageState,
      getPassword: () => seed,
    });
    this.badgeController = new BadgeController();
    this.gcmController = new GCMController(this.badgeController);
    this.setupInternalMessaging();
  }

  // Watches the internal messaging system ( LocalStream )
  async setupInternalMessaging() {
    try {
      await initPageState();
      LocalStream.watch(async (request: any, sendResponse: SendResponseFun) => {
        const message = InternalMessage.fromJson(request);
        // May not communicate via LocalStream.send
        if (!message.type) return;
        // reset lockout timer
        console.log(message, 'LocalStream.watch message');
        if (message.type === InternalMessageTypes.ACTIVE_LOCK_STATUS) return sendResponse(errorHandler(0));
        // process events
        if (SWEventController.check(message.type, message.payload?.data)) {
          const payload = message.payload;
          const data: DappEventPack['data'] = payload.data;
          const origin = payload.origin;
          SWEventController.dispatchEvent({ eventName: message.type as any, data, origin });
          sendResponse(errorHandler(0));
          return;
        }
        const registerRes = await this.permissionController.checkCurrentNetworkOtherwiseRegister(message.type);
        if (registerRes.error !== 0) return sendResponse(registerRes);

        await ServiceWorkerInstantiate.checkTimingLock();
        const isLocked = await this.permissionController.checkIsLockOtherwiseUnlock(message.type);
        if (isLocked.error !== 0) return sendResponse(isLocked);
        this.dispenseMessage(sendResponse, message);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Delegates message processing to methods by message type
   * @param sendResponse - Delegating response handler
   * @param message - The message to be dispensed
   */
  dispenseMessage(sendResponse: SendResponseFun, message: InternalMessageData) {
    console.log('dispenseMessage: ', message);
    switch (message.type) {
      case PortkeyMessageTypes.GET_SEED:
        ServiceWorkerInstantiate.getSeed(sendResponse);
        break;
      case PortkeyMessageTypes.SET_SEED:
        ServiceWorkerInstantiate.setSeed(sendResponse, message.payload);
        break;
      case PortkeyMessageTypes.CLEAR_SEED:
        ServiceWorkerInstantiate.clearSeed(sendResponse);
        break;
      case PortkeyMessageTypes.LOCK_WALLET:
        ServiceWorkerInstantiate.lockWallet(sendResponse, true);
        break;
      case PortkeyMessageTypes.CHECK_WALLET_STATUS:
        this.checkWalletStatus(sendResponse);
        break;
      case PortkeyMessageTypes.CLOSE_PROMPT:
        this.notificationServiceClose(sendResponse, message.payload);
        break;
      case PortkeyMessageTypes.REGISTER_WALLET:
        this.checkRegisterStatus(sendResponse);
        break;
      case PortkeyMessageTypes.REGISTER_START_WALLET:
        ServiceWorkerInstantiate.registerStartWallet();
        break;
      case PortkeyMessageTypes.LOGIN_WALLET:
        ServiceWorkerInstantiate.loginWallet();
        break;
      case PortkeyMessageTypes.EXPAND_FULL_SCREEN:
        ServiceWorkerInstantiate.expandFullScreen(sendResponse);
        break;
      case PortkeyMessageTypes.SETTING:
        ServiceWorkerInstantiate.expandSetting();
        break;
      case PortkeyMessageTypes.ADD_GUARDIANS:
        ServiceWorkerInstantiate.expandAddGuardians(message.payload);
        break;
      case PortkeyMessageTypes.GUARDIANS_VIEW:
        ServiceWorkerInstantiate.expandGuardiansView();
        break;
      case PortkeyMessageTypes.GUARDIANS_APPROVAL:
        ServiceWorkerInstantiate.expandGuardiansApproval(message.payload);
        break;
      case PortkeyMessageTypes.GUARDIANS_APPROVAL_PAYMENT_SECURITY:
        ServiceWorkerInstantiate.expandPaymentSecurityGuardiansApproval(message.payload);
        break;
      case PortkeyMessageTypes.SEND:
        ServiceWorkerInstantiate.expandSend(message.payload);
        break;
      case PortkeyMessageTypes.RAMP:
        ServiceWorkerInstantiate.expandRamp(message.payload);
        break;
      case PortkeyMessageTypes.OPEN_RECAPTCHA_PAGE:
        this.openRecaptchaPage(sendResponse, message.payload);
        break;
      case PortkeyMessageTypes.SOCIAL_LOGIN:
        this.socialLogin(sendResponse, message.payload);
        break;
      case PortkeyMessageTypes.SET_BADGE:
        this.badgeController.setBadge(message.payload);
        break;
      case PortkeyMessageTypes.INIT_FCM_MESSAGE:
        this.gcmController.initFCMMessage();
        break;
      case PortkeyMessageTypes.UN_REGISTER_FCM:
        this.gcmController.unRegisterFCM();
        break;
      case WalletMessageTypes.SET_RECAPTCHA_CODE_V2:
        this.getRecaptcha(sendResponse, message.payload);
        break;
      case WalletMessageTypes.SOCIAL_LOGIN:
        this.getSocialLogin(sendResponse, message.payload);
        break;
      case WalletMessageTypes.ACH_SELL_REDIRECT:
        this.expandHomeAndCloseOrigin(sendResponse, message.payload);
        break;

      default:
        if (this.aelfMethodController.aelfMethodList.includes(message.type)) {
          this.aelfMethodController.dispenseMessage(message, sendResponse);
          break;
        }
        sendResponse(errorHandler(700001, `Portkey does not contain this method (${message.type})`));
        break;
    }
  }

  async socialLogin(sendResponse: SendResponseFun, { externalLink }: { externalLink: string }) {
    try {
      if (!externalLink) return sendResponse(errorHandler(400001, 'Missing param externalLink'));
      socialLoginService.startSocialLogin(() => {
        notificationService.close(errorHandler(200001, 'User Cancel'), 'windows');
        socialLoginService.finishSocialLogin();
      });

      const result = await notificationService.openPrompt(
        {
          method: PromptRouteTypes.EXPAND_FULL_SCREEN,
          externalLink,
        },
        'windows',
      );
      if (result.error)
        return sendResponse({
          ...errorHandler(700001, result),
        });

      sendResponse({ ...errorHandler(0), data: (result as any)?.response || result });
    } catch (error) {
      sendResponse(errorHandler(100001, error));
    }
  }

  async getRecaptcha(sendResponse: SendResponseFun, message: any) {
    this.notificationServiceClose(sendResponse, { closeParams: message.payload, promptType: 'windows' });
  }

  async getSocialLogin(sendResponse: SendResponseFun, message: any) {
    socialLoginService.finishSocialLogin();
    this.notificationServiceClose(sendResponse, { closeParams: message.payload, promptType: 'windows' });
  }

  // async dealNextTask(sendResponse: SendResponseFun, message: any) {
  //   //
  //   // const { taskEvent } = message;
  // }

  async openRecaptchaPage(sendResponse: SendResponseFun, message: any) {
    if (!message.externalLink) return sendResponse(errorHandler(400001, 'Missing param externalLink'));
    const result = await notificationService.openPrompt({
      method: PromptRouteTypes.EXPAND_FULL_SCREEN,
      externalLink: message.externalLink,
    });
    sendResponse(result);
  }

  /**
   *  Set SW memory data
   * @returns pageState: IPageState
   */
  static setPageState = (v: any) => {
    pageState = {
      ...pageState,
      ...v,
    };
  };

  static registerStartWallet = async () => {
    // close this(chrome.runtime.id) other tabs when register wallet
    await OpenNewTabController.closeOpenTabs();
    notificationService.openPrompt(
      {
        method: PromptRouteTypes.REGISTER_START_WALLET,
      },
      'tabs',
    );
  };

  static loginWallet = () => {
    notificationService.openPrompt(
      {
        method: PromptRouteTypes.REGISTER_WALLET,
      },
      'tabs',
    );
  };

  /**
   *  Get SW memory data
   * @returns pageState: IPageState
   */
  getPageState = () => pageState;

  static async expandFullScreen(sendResponse: SendResponseFun) {
    await notificationService.openPrompt(
      {
        method: PromptRouteTypes.EXPAND_FULL_SCREEN,
      },
      'tabs',
    );
    sendResponse(errorHandler(0));
    /**  */
    await OpenNewTabController.closeOpenTabs(true);
  }

  static expandSetting() {
    notificationService.openPrompt(
      {
        method: PromptRouteTypes.SETTING,
      },
      'tabs',
    );
  }

  static expandAddGuardians(payload: any) {
    notificationService.openPrompt(
      {
        method: PromptRouteTypes.ADD_GUARDIANS,
        search: payload,
      },
      'tabs',
    );
  }

  static expandGuardiansView() {
    notificationService.openPrompt(
      {
        method: PromptRouteTypes.GUARDIANS_VIEW,
      },
      'tabs',
    );
  }

  static expandGuardiansApproval(payload: any) {
    notificationService.openPrompt(
      {
        method: PromptRouteTypes.GUARDIANS_APPROVAL,
        search: payload,
      },
      'tabs',
    );
  }

  static expandPaymentSecurityGuardiansApproval(payload: any) {
    notificationService.openPrompt(
      {
        method: PromptRouteTypes.GUARDIANS_APPROVAL_PAYMENT_SECURITY,
        search: payload,
      },
      'tabs',
    );
  }

  static expandSend(payload: string) {
    const payloadObj = JSON.parse(payload);
    if (!payloadObj?.type) throw Error('missing type');
    if (!payloadObj?.symbol) throw Error('missing symbol');

    notificationService.openPrompt(
      {
        method: PromptRouteTypes.SEND,
        query: `${payloadObj?.type}/${payloadObj?.symbol}`,
        search: payload,
      },
      'tabs',
    );
  }

  static expandRamp(payload: any) {
    notificationService.openPrompt(
      {
        method: PromptRouteTypes.RAMP,
        search: payload,
      },
      'tabs',
    );
  }

  async expandHomeAndCloseOrigin(sendResponse: SendResponseFun, payload: any) {
    notificationService.openPrompt(
      {
        method: PromptRouteTypes.EXPAND_FULL_SCREEN,
        search: `${payload.payload?.orderNo || ''}&method=${payload.method}`,
      },
      'tabs',
    );
    sendResponse(errorHandler(0));
  }

  async notificationServiceClose(
    sendResponse: SendResponseFun,
    payload: {
      closeParams?: CloseParams;
      promptType?: CreatePromptType;
      isClose?: boolean;
    },
  ) {
    try {
      const isClose = payload?.isClose ?? true;
      const closeId = await notificationService[isClose ? 'close' : 'completedWithoutClose'](
        payload.closeParams,
        payload.promptType,
      );
      sendResponse({
        ...errorHandler(0),
        data: {
          closeId,
        },
      });
    } catch (error) {
      console.log(error, 'notificationServiceClose');
      sendResponse(errorHandler(500001, error));
    }
  }

  async checkWalletStatus(sendResponse: SendResponseFun) {
    const isRegisterOnCurrentNetwork = await this.permissionController.checkCurrentNetworkIsRegister();
    return sendResponse({
      ...errorHandler(0),
      data: {
        registerStatus: isRegisterOnCurrentNetwork,
        privateKey: seed,
      },
    });
  }

  /***
   * Sets the seed on scope to use from decryption
   * @param sendResponse - Delegating response handler
   * @param _seed - The seed to set
   */
  static setSeed(sendResponse: SendResponseFun, _seed: string) {
    seed = _seed;
    ServiceWorkerInstantiate.unlockWallet(sendResponse, _seed);
  }

  static getSeed(sendResponse: SendResponseFun) {
    sendResponse({
      ...errorHandler(0),
      data: { privateKey: seed },
    });
  }

  static clearSeed(sendResponse: SendResponseFun) {
    seed = null;
    sendResponse(errorHandler(0));
  }

  static async checkTimingLock(sendResponse?: SendResponseFun) {
    apis.alarms.clear('timingLock');

    if (pageState.lockTime === AutoLockDataType.Immediately) {
      pageState.lockTime = 5 as any;
      return;
    }
    if (seed && pageState.lockTime === AutoLockDataType.Never) {
      return;
    }
    if (seed) {
      // MV2 -> MV3 setTimeout -> alarms.create
      apis.alarms.create('timingLock', {
        delayInMinutes: pageState.lockTime ?? AutoLockDataType.OneHour,
      });
      apis.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name !== 'timingLock') return;
        apis.alarms.clear(alarm.name);
        if (pageState.lockTime === AutoLockDataType.Never) return;
        ServiceWorkerInstantiate.lockWallet(sendResponse);
      });
    } else {
      ServiceWorkerInstantiate.lockWallet(sendResponse);
    }
  }

  static lockWallet(sendResponse?: SendResponseFun, isManualLockWallet?: boolean) {
    try {
      seed = null;
      setLocalStorage({
        locked: true,
      });
      isManualLockWallet && SWEventController.dispatchEvent({ eventName: 'accountsChanged', data: {} });
      sendResponse?.(errorHandler(0));
    } catch (e) {
      sendResponse?.(errorHandler(500001, e));
    }
  }

  static unlockWallet(sendResponse: SendResponseFun, _seed: string | null) {
    if (!_seed) return sendResponse(errorHandler(500001, 'unlockWallet error'));
    sendResponse(errorHandler(0));
    setLocalStorage({
      locked: false,
    });
  }

  checkRegisterStatus = async (sendResponse?: SendResponseFun) => {
    const registerStatus = await this.permissionController.registerCurrentNetworkWallet();
    sendResponse?.(registerStatus);
  };
}
