import SWEventSubController from 'controllers/SWEventSubController';
import { rateApi } from '@portkey-wallet/store/rate/api';
import { DappMiddle } from '@portkey-wallet/utils/dapp/middle';

export function loadMiddlewareList() {
  const middlewareList: any[] = [];
  middlewareList.push(rateApi.middleware);
  // dapp middle
  DappMiddle.registerEvent(SWEventSubController);
  middlewareList.push(DappMiddle.middle);
  return middlewareList;
}
