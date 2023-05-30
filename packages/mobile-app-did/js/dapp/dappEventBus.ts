import { IOperator, DappEvents, ResponseCode, IResponseType } from '@portkey/provider-types';
export default class DappEventBus {
  private static operators: Array<IOperator> = [];
  public static registerOperator(operator: IOperator) {
    if (this.operators.includes(operator)) return;
    this.operators.push(operator);
  }
  public static unregisterOperator(operator: IOperator) {
    this.operators = this.operators.filter(item => item !== operator);
  }
  public static dispatchEvent({ eventName, data, callback, origin, msg }: DappEventPack) {
    const event: IResponseType = {
      eventName,
      info: {
        code: ResponseCode.SUCCESS,
        data,
        msg,
      },
      origin,
    };
    this.operators.forEach(operator => {
      operator?.publishEvent?.(event as any);
    });
    callback && callback();
  }
}
export interface DappEventPack {
  eventName: DappEvents;
  data?: any;
  callback?: () => void;
  origin?: string;
  msg?: string;
}
