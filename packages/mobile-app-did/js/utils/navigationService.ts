import { randomId } from '@portkey-wallet/utils';
import { CommonActions, NavigationContainerRef, StackActions } from '@react-navigation/native';
import { RootStackParamList, TabParamList } from 'navigation';
import merge from 'lodash/merge';
import { NavigateMultiLevelOptions, TabRouteNameEnum } from 'types/navigate';
import myEvents from './deviceEvent';
import { reportNavBack } from './analysisiReport';

type MultiLevelParamsIds = string[];
let TempMultiLevelParams: {
  [id: string]: { multiLevelParamsIds: MultiLevelParamsIds; originMultiLevelRouterKey: string } & any;
} = {};

export type NavigateName = keyof (RootStackParamList & TabParamList);

export let _navigator: NavigationContainerRef<any>;

const ThrottleMap: { [key: string]: number } = {};

function setTopLevelNavigator(navigatorRef: NavigationContainerRef<any>) {
  _navigator = navigatorRef;
}

function getCurrentRouteAndRoutes() {
  const { routes } = _navigator.getState();
  let currentRoute;
  if (Array.isArray(routes)) {
    currentRoute = routes[routes.length - 1];
  }
  return { routes, currentRoute };
}

function getMultiLevelParams() {
  try {
    let multiLevelParams: any = {};
    const { currentRoute, routes } = getCurrentRouteAndRoutes();
    const ids: MultiLevelParamsIds = (currentRoute?.params as any)?.multiLevelParamsIds;
    ids?.forEach(id => {
      const item = TempMultiLevelParams[id];
      if (item) {
        const exist = routes?.some(
          route => route.key === item.originMultiLevelRouterKey || route.name === item.originMultiLevelRouterKey,
        );
        if (exist) {
          multiLevelParams = merge(multiLevelParams, TempMultiLevelParams[id]);
        } else {
          TempMultiLevelParams[id] && delete TempMultiLevelParams[id];
        }
      }
    });
    if (Object.keys(multiLevelParams).length > 0) return multiLevelParams;
  } catch (error) {
    console.log(error, '====error');
  }
}

function navigate(name: NavigateName, params?: any) {
  const multiLevelParams = getMultiLevelParams();
  _navigator?.dispatch(
    CommonActions.navigate({
      name,
      params: merge(multiLevelParams, params),
    }),
  );
}

function navigateByMultiLevelParams(
  name: keyof (RootStackParamList & TabParamList),
  multiLevelOptions: NavigateMultiLevelOptions,
) {
  const { multiLevelParams: mParams, params } = multiLevelOptions;
  const { currentRoute } = getCurrentRouteAndRoutes();
  const originMultiLevelRouterKey = currentRoute?.key || name;
  const id = randomId();
  let multiLevelParams = getMultiLevelParams();
  if (!multiLevelParams) multiLevelParams = {};
  if (Array.isArray(multiLevelParams.multiLevelParamsIds)) {
    multiLevelParams.multiLevelParamsIds.push(id);
  } else {
    multiLevelParams.multiLevelParamsIds = [id];
  }
  multiLevelParams.originMultiLevelRouterKey = originMultiLevelRouterKey;
  multiLevelParams = merge(multiLevelParams, mParams);
  TempMultiLevelParams[id] = multiLevelParams;
  _navigator?.dispatch(
    CommonActions.navigate({
      name,
      params: merge(TempMultiLevelParams[id], params),
    }),
  );
}

function goBack() {
  const key = _navigator.getCurrentRoute()?.name;
  reportNavBack({ page_name: key });

  _navigator?.dispatch(CommonActions.goBack());
}

function reset(name: keyof RootStackParamList | { name: keyof RootStackParamList; params?: any }[], params?: object) {
  TempMultiLevelParams = {};
  const key = JSON.stringify(name);
  // throttle
  if (ThrottleMap[key] && Date.now() - ThrottleMap[key] < 2000) return;
  ThrottleMap[key] = Date.now();

  let resetAction;
  if (Array.isArray(name)) {
    resetAction = CommonActions.reset({
      index: name.length - 1,
      routes: name as any,
    });
  } else {
    resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name, params }],
    });
  }
  _navigator?.dispatch(resetAction);
}

function push(routeName: string, params?: object) {
  const pushAction = StackActions.push(routeName, params);
  _navigator?.dispatch(pushAction);
}

function pop(count: number) {
  const pushAction = StackActions.pop(count);
  _navigator?.dispatch(pushAction);
}

function getState() {
  return _navigator?.getState();
}

function navToBottomTab(tabName: TabRouteNameEnum, params?: any) {
  myEvents.navToBottomTab.emit({ tabName, params });
}

export default {
  navigateByMultiLevelParams,
  setTopLevelNavigator,
  navigate,
  getState,
  goBack,
  reset,
  push,
  pop,
  navToBottomTab,
};
