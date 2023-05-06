import { LocalStream } from 'extension-streams';
import { getAllStorageLocalData, getLocalStorage } from 'utils/storage/chromeStorage';
import storage from 'utils/storage/storage';
import { AutoLockDataKey, AutoLockDataType, DefaultLock } from 'constants/lock';
import SWEventController from 'controllers/SWEventController';
import PermissionController from 'controllers/PermissionController';
import NotificationService, { CloseParams } from 'service/NotificationService';
import ApprovalController from 'controllers/approval/ApprovalController';
import { getStoreState } from 'store/utils/getStore';
import { InternalMessageData, IPageState } from 'types/SW';
import AELFMethodController from 'controllers/methodController/AELFMethodController';
import InternalMessageTypes, {
  AelfMessageTypes,
  MethodMessageTypes,
  PortkeyMessageTypes,
  PromptRouteTypes,
  WalletMessageTypes,
} from 'messages/InternalMessageTypes';
import InternalMessage from 'messages/InternalMessage';
import { CreatePromptType, SendResponseFun } from 'types';
import errorHandler from 'utils/errorHandler';
import { apis } from 'utils/BrowserApis';
import SocialLoginController from 'controllers/socialLoginController';
import OpenNewTabController from 'controllers/openNewTabController';

const notificationService = new NotificationService();
const socialLoginService = new SocialLoginController();
new OpenNewTabController();

// Get default data in redux
const store = getStoreState();

let seed: string | null = null;

let pageState: IPageState = {
  lockTime: AutoLockDataType[DefaultLock], // minutes
  registerStatus: undefined,
  wallet: store.wallet,
};

const aelfValidMethodList: string[] = Object.values(AelfMessageTypes);

const allowedMethod = [
  PortkeyMessageTypes.GET_SEED,
  PortkeyMessageTypes.SET_SEED,
  PortkeyMessageTypes.LOCK_WALLET,
  PortkeyMessageTypes.CLOSE_PROMPT,
  PortkeyMessageTypes.REGISTER_WALLET,
  PortkeyMessageTypes.REGISTER_START_WALLET,
  PortkeyMessageTypes.LOGIN_WALLET,
  PortkeyMessageTypes.CHECK_WALLET_STATUS,
  PortkeyMessageTypes.EXPAND_FULL_SCREEN,
  PortkeyMessageTypes.OPEN_RECAPTCHA_PAGE,
  PortkeyMessageTypes.SOCIAL_LOGIN,
  WalletMessageTypes.REQUEST_ACCOUNTS,
  MethodMessageTypes.GET_WALLET_STATE,
  WalletMessageTypes.SET_RECAPTCHA_CODE_V2,
  WalletMessageTypes.SOCIAL_LOGIN,
  PortkeyMessageTypes.ACTIVE_LOCK_STATUS,
  PortkeyMessageTypes.SETTING,
  PortkeyMessageTypes.ADD_GUARDIANS,
  PortkeyMessageTypes.GUARDIANS_VIEW,
  PortkeyMessageTypes.GUARDIANS_APPROVAL,
];

const PortkeyMethod = [...allowedMethod, WalletMessageTypes.CONNECT, WalletMessageTypes.SWITCH_CHAIN];

const initPageState = async () => {
  const allStorage = await getAllStorageLocalData();
  const reduxStore = JSON.parse(allStorage[storage.reduxStorageName] ?? null);
  pageState = {
    registerStatus: allStorage[storage.registerStatus],
    lockTime: AutoLockDataType[allStorage[storage.lockTime] as AutoLockDataKey] ?? AutoLockDataType[DefaultLock],
    wallet: JSON.parse(reduxStore?.['wallet'] ?? null),
  };
  console.log(pageState, 'pageState===');
};

// This is the script that runs in the extension's serviceWorker ( singleton )
export default class ServiceWorkerInstantiate {
  protected permissionController: PermissionController;
  protected approvalController: ApprovalController;
  protected aelfMethodController: AELFMethodController;
  constructor() {
    this.setupInternalMessaging();
    // Controller that handles portkey checks
    this.permissionController = new PermissionController({
      notificationService,
      allowedMethod,
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
      methodList: aelfValidMethodList,
      getPageState: this.getPageState,
      getPassword: () => seed,
    });
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
        const registerRes = await this.permissionController.checkIsRegisterOtherwiseRegister(message.type);
        if (registerRes.error !== 0) return sendResponse(registerRes);
        await ServiceWorkerInstantiate.checkTimingLock();
        if (message.type === InternalMessageTypes.ACTIVE_LOCK_STATUS) return sendResponse(errorHandler(0));
        const isLocked = await this.permissionController.checkIsLockOtherwiseUnlock(message.type);
        if (isLocked.error !== 0) return sendResponse(isLocked);
        await this.dispenseMessage(sendResponse, message);
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
    // // When message.type is aelf transaction type
    // if (aelfValidMethodList.includes(message.type)) {
    //   this.aelfMethodController.dispenseMessage(message, sendResponse);
    //   return;
    // }
    if (PortkeyMethod.includes(message.type)) {
      // When message.type is portkey internal type
      switch (message.type) {
        case PortkeyMessageTypes.GET_SEED:
          ServiceWorkerInstantiate.getSeed(sendResponse);
          break;
        case PortkeyMessageTypes.SET_SEED:
          ServiceWorkerInstantiate.setSeed(sendResponse, message.payload);
          break;
        case PortkeyMessageTypes.LOCK_WALLET:
          ServiceWorkerInstantiate.lockWallet(sendResponse);
          break;
        case PortkeyMessageTypes.CHECK_WALLET_STATUS:
          this.checkWalletStatus(sendResponse);
          break;
        case PortkeyMessageTypes.CLOSE_PROMPT:
          this.notificationServiceClose(sendResponse, message.payload);
          break;
        case PortkeyMessageTypes.REGISTER_WALLET:
          ServiceWorkerInstantiate.checkRegisterStatus();
          break;
        case PortkeyMessageTypes.REGISTER_START_WALLET:
          ServiceWorkerInstantiate.registerStartWallet();
          break;
        case PortkeyMessageTypes.LOGIN_WALLET:
          ServiceWorkerInstantiate.loginWallet();
          break;
        case PortkeyMessageTypes.EXPAND_FULL_SCREEN:
          ServiceWorkerInstantiate.expandFullScreen();
          break;
        case PortkeyMessageTypes.SETTING:
          ServiceWorkerInstantiate.expandSetting();
          break;
        case PortkeyMessageTypes.ADD_GUARDIANS:
          ServiceWorkerInstantiate.expandAddGuardians();
          break;
        case PortkeyMessageTypes.GUARDIANS_VIEW:
          ServiceWorkerInstantiate.expandGuardiansView();
          break;
        case PortkeyMessageTypes.GUARDIANS_APPROVAL:
          ServiceWorkerInstantiate.expandGuardiansApproval(message.payload);
          break;
        case PortkeyMessageTypes.OPEN_RECAPTCHA_PAGE:
          this.openRecaptchaPage(sendResponse, message.payload);
          break;
        case PortkeyMessageTypes.SOCIAL_LOGIN:
          this.socialLogin(sendResponse, message.payload);
          break;
        case WalletMessageTypes.CONNECT:
          this.connectWallet(sendResponse, message.payload);
          break;
        case WalletMessageTypes.REQUEST_ACCOUNTS:
          this.getAddress(sendResponse, message.payload);
          break;
        case MethodMessageTypes.GET_WALLET_STATE:
          ServiceWorkerInstantiate.getWalletState(sendResponse);
          break;
        case WalletMessageTypes.SET_RECAPTCHA_CODE_V2:
          this.getRecaptcha(sendResponse, message.payload);
          break;
        case WalletMessageTypes.SOCIAL_LOGIN:
          this.getSocialLogin(sendResponse, message.payload);
          break;

        default:
          sendResponse(errorHandler(700001, `Portkey does not contain this method (${message.type})`));
          break;
      }
      // } else if (pageState.chain.currentChain.chainType === 'aelf') {
      //   this.aelfMethodController.dispenseMessage(message, sendResponse);
      //   return;
    } else {
      sendResponse(
        errorHandler(
          700001,
          'Not Support',
          // `The current network is ${pageState.chain.currentChain.chainType}, which cannot match this method (${message.type})`,
        ),
      );
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
    this.notificationServiceClose(sendResponse, { closeParams: message.params, promptType: 'windows' });
  }

  async getSocialLogin(sendResponse: SendResponseFun, message: any) {
    socialLoginService.finishSocialLogin();
    this.notificationServiceClose(sendResponse, { closeParams: message.params, promptType: 'windows' });
  }

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

  static registerStartWallet = () => {
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

  static expandFullScreen() {
    notificationService.openPrompt(
      {
        method: PromptRouteTypes.EXPAND_FULL_SCREEN,
      },
      'tabs',
    );
  }

  static expandSetting() {
    notificationService.openPrompt(
      {
        method: PromptRouteTypes.SETTING,
      },
      'tabs',
    );
  }

  static expandAddGuardians() {
    notificationService.openPrompt(
      {
        method: PromptRouteTypes.ADD_GUARDIANS,
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

  /**
   * Determine whether the portkey is locked, and if not, get the list of authorized users
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAddress(sendResponse: SendResponseFun, _message: any) {
    try {
      sendResponse(errorHandler(700001));
    } catch (error) {
      sendResponse(errorHandler(500001, error));
    }
  }

  /**
   * Dapp connection portkey
   */
  async connectWallet(sendResponse: SendResponseFun, message: any) {
    try {
      sendResponse(errorHandler(700001, message));
    } catch (error) {
      console.log(error, 'connectWallet==');
      return sendResponse(errorHandler(500001, error));
    }
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
    const registerStatus = await this.permissionController.checkRegisterStatus();
    console.log(registerStatus, 'registerStatus===');
    return sendResponse({
      ...errorHandler(0),
      data: {
        registerStatus,
        privateKey: seed,
      },
    });
  }

  static async getWalletState(sendResponse: SendResponseFun) {
    try {
      sendResponse(errorHandler(0));
    } catch (error) {
      sendResponse(errorHandler(200004, error));
    }
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

  static async checkTimingLock(sendResponse?: SendResponseFun) {
    apis.alarms.clear('timingLock');

    if (pageState.lockTime === AutoLockDataType.Immediately) {
      pageState.lockTime = 5;
      return;
    }
    if (seed && pageState.lockTime === AutoLockDataType.Never) {
      return;
    }
    if (seed) {
      // const lastTime = await getLocalStorage('lastMessageTime');
      // const timeLock = moment().isSameOrAfter(lastTime);
      // setLocalStorage({
      //   [storage.lastMessageTime]: moment().add(pageState.lockTime, 'm').format(),
      // });
      // console.log(
      //   timeLock,
      //   lastTime,
      //   pageState.lockTime,
      //   moment().format(),
      //   moment().add(pageState.lockTime, 'm').format(),
      //   'timeLock==',
      // );
      // lastTime && timeLock && ServiceWorkerInstantiate.lockWallet(sendResponse, 'timingLock');
      // MV2 -> MV3 setTimeout -> alarms.create
      apis.alarms.create('timingLock', {
        delayInMinutes: pageState.lockTime ?? AutoLockDataType.OneHour,
      });
      apis.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name !== 'timingLock') return;
        apis.alarms.clear(alarm.name);
        if (pageState.lockTime === AutoLockDataType.Never) return;
        ServiceWorkerInstantiate.lockWallet(sendResponse, 'timingLock');
      });
    } else {
      ServiceWorkerInstantiate.lockWallet(sendResponse);
    }
  }

  static lockWallet(sendResponse?: SendResponseFun, message?: any) {
    try {
      console.log('lockWallet', message);
      seed = null;
      SWEventController.lockStateChanged(true, sendResponse);
    } catch (e) {
      sendResponse?.(errorHandler(500001, e));
    }
  }

  static unlockWallet(sendResponse: SendResponseFun, _seed: string | null) {
    if (!_seed) return sendResponse(errorHandler(500001, 'unlockWallet error'));
    SWEventController.lockStateChanged(false, sendResponse);
  }

  static async checkRegisterStatus() {
    const registerStatus = await getLocalStorage('registerStatus');
    console.log('checkRegisterStatus==');
    if (registerStatus !== 'Registered') {
      return await notificationService.open({
        sendResponse: (response) => {
          console.log(response);
        },
        message: {
          method: PromptRouteTypes[registerStatus === 'registeredNotGetCaAddress' ? 'BLANK_PAGE' : 'REGISTER_WALLET'],
        },
        promptType: 'tabs',
      });
    }
    return true;
  }
}
