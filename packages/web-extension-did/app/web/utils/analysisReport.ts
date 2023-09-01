// import { getAnalytics, setUserProperties, logEvent } from 'firebase/analytics';
// import {
//   checkEnvironmentIsProduction,
//   eventParamsType,
//   CUSTOM_EVENT_ENUM,
// } from '@portkey-wallet/utils/analyticsReport';

// const firebaseAnalytics = getAnalytics();
// const reportEventCurrying = (eventName: CUSTOM_EVENT_ENUM) => {
//   return (params?: eventParamsType) => logEvent(firebaseAnalytics, eventName, params);
// };

// export const reportUserCurrentNetwork = (networkType?: string) => {
//   if (!networkType || !checkEnvironmentIsProduction()) return;
//   const network_type = String(networkType).toLowerCase();
//   setUserProperties(firebaseAnalytics, {
//     network_type,
//   });
// };

export const reportUserCurrentNetwork = (networkType?: string) => {
  console.log(networkType);
};

// export const reportLogin = reportEventCurrying(CUSTOM_EVENT_ENUM.LOGIN);
