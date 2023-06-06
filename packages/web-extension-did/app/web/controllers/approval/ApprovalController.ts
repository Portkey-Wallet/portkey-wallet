/**
 * @file
 * A controller that handles authorization, including switch chain and authorization connections
 */
import { PromptRouteTypes } from 'messages/InternalMessageTypes';
import NotificationService from 'service/NotificationService';
import { SendResponseParams } from 'types';
import { IPageState } from 'types/SW';

interface ApprovalControllerProps {
  getPageState: () => IPageState;
  notificationService: NotificationService;
}

export default class ApprovalController {
  notificationService: NotificationService;
  protected _getPageState: () => IPageState;
  constructor({ notificationService, getPageState }: ApprovalControllerProps) {
    this.notificationService = notificationService;
    this._getPageState = getPageState;
  }

  /**
   * Obtain authorization to switch chains
   * Determine whether rpcUrl is the current chain, if yes, return the result directly, if not, obtain authorization
   */
  // async authorizedToSwitchChain({
  //   rpcUrl,
  //   appName,
  //   appLogo = '',
  //   appHref,
  // }: {
  //   rpcUrl: string;
  //   appName: string;
  //   appLogo?: string;
  //   appHref: string;
  // }): Promise<SendResponseParams> {
  //   try {
  //     if (!rpcUrl)
  //       return {
  //         ...errorHandler(400001, 'Parameter rpcUrl is missing'),
  //       };
  //     const pageState = this._getPageState();
  //     const chainList = pageState.chain.chainList;
  //     const chain = chainList.find((item) => item.rpcUrl === rpcUrl);
  //     if (!chain)
  //       return {
  //         ...errorHandler(
  //           700001,
  //           'Unable to switch to this network, please add it to the custom network in the plugin first',
  //         ),
  //       };
  //     if (rpcUrl === pageState.chain.currentChain.rpcUrl)
  //       return {
  //         ...errorHandler(0),
  //         data: {
  //           chainId: chain.chainId,
  //           chainType: chain.chainType,
  //           rpcUrl: chain.rpcUrl,
  //           blockExplorerURL: chain.blockExplorerURL,
  //           nativeCurrency: chain.nativeCurrency,
  //         },
  //       };

  //     const switchRes = await this.notificationService.openPrompt({
  //       method: PromptRouteTypes.SWITCH_CHAIN,
  //       search: JSON.stringify({ rpcUrl, appName, appLogo, appHref }),
  //     });
  //     return switchRes;
  //   } catch (e) {
  //     return {
  //       ...errorHandler(500001),
  //       data: e,
  //     };
  //   }
  // }

  /**
   * Obtain authorization to connect to portkey
   *
   * Query whether the connection is authorized, if not authorized, prompt to authorize the connection
   */
  async authorizedToConnect({
    appName,
    appLogo,
    origin,
  }: {
    appName?: string;
    appLogo?: string;
    origin: string;
  }): Promise<SendResponseParams> {
    const permissionData = await this.notificationService.openPrompt({
      method: PromptRouteTypes.CONNECT_WALLET,
      search: JSON.stringify({
        appName: appName ?? origin,
        appLogo,
        appHref: origin,
      }),
    });
    return permissionData;
  }

  /**
   * Obtain authorization to send transactions
   *
   */
  // TODO format params
  async authorizedToSendTransactions(params: any): Promise<SendResponseParams> {
    return this.notificationService.openPrompt({
      method: PromptRouteTypes.SEND_TRANSACTION,
      search: JSON.stringify(params),
    });
  }
}
