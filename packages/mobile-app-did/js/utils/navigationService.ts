import { CommonActions, NavigationContainerRef, StackActions } from '@react-navigation/native';
import { RootStackParamList, TabParamList } from 'navigation';

export let _navigator: NavigationContainerRef<any>;

const ThrottleMap: { [key: string]: number } = {};

function setTopLevelNavigator(navigatorRef: NavigationContainerRef<any>) {
  _navigator = navigatorRef;
}
export type NavigateName = keyof (RootStackParamList & TabParamList);

function navigate(name: NavigateName, params?: any) {
  _navigator?.dispatch(
    CommonActions.navigate({
      name,
      params,
    }),
  );
}

function goBack() {
  _navigator?.dispatch(CommonActions.goBack());
}

function reset(name: keyof RootStackParamList | { name: keyof RootStackParamList; params?: any }[], params?: object) {
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

export default {
  setTopLevelNavigator,
  navigate,
  goBack,
  reset,
  push,
  pop,
};
