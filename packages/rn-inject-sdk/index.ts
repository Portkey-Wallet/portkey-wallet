export {
  useIsFocused,
  useNavigation,
  useFocusEffect,
  useRoute,
  useRouterParams,
  useRouterEffectParams,
} from '@portkey-wallet/rn-core/router/hook';
export type { RouteProp, ParamListBase } from '@portkey-wallet/rn-core/router';
export { request } from '@portkey-wallet/rn-core/network/index';
export { exceptionManager } from './errorHandler/ExceptionHandler';
import navigationService from '@portkey-wallet/rn-core/router/navigationService';
export default navigationService;
import { useEffect, useState } from 'react';
