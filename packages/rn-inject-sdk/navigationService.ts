import router from '@portkey-wallet/rn-core/router';
import { COMMON_RESULT_DATA, COMMON_ROUTER_FROM } from '@portkey-wallet/rn-core/router/context';

function setTopLevelNavigator(navigatorRef) {}

function getCurrentRouteAndRoutes() {}

function getMultiLevelParams() {}

function navigate(name: any, params?: any) {}

function navigateByMultiLevelParams(name: any, multiLevelOptions: any) {}

function goBack() {
  router.back(COMMON_RESULT_DATA, { from: COMMON_ROUTER_FROM });
}

function reset(name: any | { name: any; params?: any }[], params?: object) {}

function push(routeName: string, params?: object) {}

function pop(count: number) {}

function getState() {}

export default {
  navigateByMultiLevelParams,
  setTopLevelNavigator,
  navigate,
  getState,
  goBack,
  reset,
  push,
  pop,
};
