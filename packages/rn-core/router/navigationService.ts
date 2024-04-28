import router from '../router';
import { COMMON_RESULT_DATA, COMMON_ROUTER_FROM } from '../router/context';
import { PortkeyEntries } from './types';
let route: string | undefined;
function setTopLevelNavigator(navigatorRef) {}
function setRouteName(routeName?: string) {
  if (routeName !== route) {
    route = routeName;
    console.log('wfs current route', route);
  }
}
function getCurrentRouteName() {
  return route;
}
function getCurrentRouteAndRoutes() {}

function getMultiLevelParams() {}

async function navigate(name: any, params?: any) {
  await router.navigate(name, { ...params, from: route ?? COMMON_ROUTER_FROM });
}

function navigateByMultiLevelParams(name: any, multiLevelOptions: any) {
  const { params } = multiLevelOptions;
  router.navigate(name, { ...params, from: route ?? COMMON_ROUTER_FROM });
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

function pop(count: number) {
  let currentRouteName = getCurrentRouteName() as PortkeyEntries;
  while (count > 0) {
    console.log('popRoute currentRouteName is:', currentRouteName);
    currentRouteName = router.back(COMMON_RESULT_DATA, {
      from: currentRouteName ?? COMMON_ROUTER_FROM,
    }) as PortkeyEntries;
    count--;
  }
}

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
  getCurrentRouteName,
};
