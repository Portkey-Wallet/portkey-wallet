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
export const reportNavBack = reportEventCurrying(CUSTOM_EVENT_ENUM.NAV_BACK);
export const reportEnterSendCryptoGiftPage = reportEventCurrying(CUSTOM_EVENT_ENUM.ENTER_SEND_CRYPTO_GIFT_PAGE);
export const reportSendCryptoGiftSuccess = reportEventCurrying(CUSTOM_EVENT_ENUM.SEND_CRYPTO_GIFT_SUCCESS);
export const reportReferralClick = reportEventCurrying(CUSTOM_EVENT_ENUM.REFERRAL_CLICK);
