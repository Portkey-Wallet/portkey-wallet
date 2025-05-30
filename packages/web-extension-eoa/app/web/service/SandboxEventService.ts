import { ChainType } from '@portkey-wallet/types';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import IdGenerator from 'utils/IdGenerator';
import { getWalletState } from 'utils/lib/SWGetReduxStore';

export enum SandboxErrorCode {
  error,
  success,
} // 0 error 1 success

export type SandboxDispatchData = { code: SandboxErrorCode; message?: any };
// interface DispatchData {
//   rpcUrl: string;
//   address: string;
//   methodName: string;
//   paramsOption?: any;
// }

export interface DispatchParam {
  chainType: ChainType;
  rpcUrl: string;
  [x: string]: any;
}

export default class SandboxEventService {
  static async dispatch(event: SandboxEventTypes, data?: any, ele = 'sandbox') {
    let caAddress = '';
    let currentNetwork = 'MAINNET';
    try {
      const res = await getWalletState();
      currentNetwork = res.currentNetwork;
      caAddress = res.walletInfo?.caInfo?.[res.currentNetwork]?.AELF?.caAddress ?? '';
    } catch (error) {
      console.log('===getWalletState error', error);
    }
    const iframe = document.getElementById(ele);
    const sid = IdGenerator.numeric(24);
    (iframe as any)?.contentWindow.postMessage(
      {
        event,
        data: { ...data, sendOptions: { ...(data.sendOptions ?? {}), caAddress, currentNetwork }, sid },
      },
      '*',
    );
    return { event, sid };
  }

  static dispatchToOrigin(event: MessageEvent<any>, data?: SandboxDispatchData) {
    event?.source?.postMessage({ ...data, eventName: event.data.event }, event.origin as any);
  }

  static listen({ event: eventName, sid }: { event: SandboxEventTypes; sid: string }): Promise<any> {
    return new Promise((resolve) => {
      window.addEventListener('message', (event) => {
        if (event.data.eventName === eventName && event.data.sid === sid) resolve(event.data);
      });
    });
  }
  /**
   *
   * @param event SandboxEventTypes
   * @param data when callView data is DispatchData, other any
   * @param ele
   * @returns
   */
  static async dispatchAndReceive(event: SandboxEventTypes, data?: DispatchParam, ele = 'sandbox') {
    const dispatchKey = await SandboxEventService.dispatch(event, data, ele);
    return await SandboxEventService.listen(dispatchKey);
  }
}
