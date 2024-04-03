import { createContext } from 'react';
import { EntryResult } from 'service/native-modules';
export const COMMON_ROUTER_FROM = 'portkey_rn-sdk';

export const COMMON_RESULT_DATA: EntryResult<any> = {
  status: 'cancel',
  data: {},
};
export const defaultRouterParams = {
  from: COMMON_ROUTER_FROM,
  params: {} as any,
};
export type RouterParams = typeof defaultRouterParams;
export const RouterContext = createContext(defaultRouterParams);