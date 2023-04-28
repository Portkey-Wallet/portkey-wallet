import { DispatchParam, SandboxDispatchData, SandboxEventTypes } from './types';
import { randomId } from '../index';

export class SandboxEventService {
  static dispatch(event: SandboxEventTypes, data?: any, ele = 'sandbox') {
    const iframe = document.getElementById(ele);
    const sid = randomId();
    (iframe as any)?.contentWindow.postMessage(
      {
        event,
        data: { ...data, sid },
      },
      '*',
    );
    return { event, sid };
  }

  static dispatchToOrigin(event: MessageEvent<any>, data?: SandboxDispatchData) {
    event?.source?.postMessage({ ...data, eventName: event.data.event }, event.origin as any);
  }

  static listen({ event: eventName, sid }: { event: SandboxEventTypes; sid: string }): Promise<any> {
    return new Promise(resolve => {
      window.addEventListener('message', event => {
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
    const dispatchKey = SandboxEventService.dispatch(event, data, ele);
    return await SandboxEventService.listen(dispatchKey);
  }
}
