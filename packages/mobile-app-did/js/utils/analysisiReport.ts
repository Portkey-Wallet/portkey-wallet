import analytics from '@react-native-firebase/analytics';
import {
  checkEnvironmentIsProduction,
  eventParamsType,
  CUSTOM_EVENT_ENUM,
} from '@portkey-wallet/utils/analyticsReport';

const firebaseAnalytics = analytics();

export const reportEventCurrying = (eventName: CUSTOM_EVENT_ENUM) => {
  return (params?: eventParamsType) => firebaseAnalytics.logEvent(eventName, params);
};

export const reportUserCurrentNetwork = (networkType?: string) => {
  if (!networkType || !checkEnvironmentIsProduction()) return;
  networkType = String(networkType).toLowerCase();
  firebaseAnalytics.setUserProperty('network_type', networkType);
};

export const reportLogin = reportEventCurrying(CUSTOM_EVENT_ENUM.LOGIN);
export const reportPageShow = reportEventCurrying(CUSTOM_EVENT_ENUM.PAGESHOW);
