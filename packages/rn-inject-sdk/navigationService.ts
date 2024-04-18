import router from '@portkey-wallet/rn-core/router';
import { COMMON_RESULT_DATA, COMMON_ROUTER_FROM } from '@portkey-wallet/rn-core/router/context';
let route: string | undefined;
function setTopLevelNavigator(navigatorRef) {}
function setRouteName(routeName?: string) {
  route = routeName;
  console.log('wfs current route', route);
}
function getCurrentRouteAndRoutes() {}

function getMultiLevelParams() {}

function navigate(name: any, params?: any) {
  console.log('wfs route', route);
  router.navigate(name, { ...params, from: route ?? COMMON_ROUTER_FROM });
}

function navigateByMultiLevelParams(name: any, multiLevelOptions: any) {
  router.navigate(name, { ...multiLevelOptions, from: route ?? COMMON_ROUTER_FROM });
}

function goBack() {
  console.log('wfs invoke goBack');
  router.back(COMMON_RESULT_DATA, { from: route ?? COMMON_ROUTER_FROM });
}

function reset(name: any | { name: any; params?: any }[], params?: object) {
  router.reset(name, params, route ?? COMMON_ROUTER_FROM);
}

function push(routeName: string, params?: object) {
  router.navigate(routeName, { ...params, from: route ?? COMMON_ROUTER_FROM });
}

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
  setRouteName,
};
