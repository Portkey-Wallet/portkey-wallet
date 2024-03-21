import * as Sentry from '@sentry/react-native';
import analytics from '@react-native-firebase/analytics';
import { exceptionManager } from './errorHandler/ExceptionHandler';

if (!__DEV__) {
  exceptionManager.setSentryInstance(Sentry);
  exceptionManager.setAnalyticsInstance(analytics());
}
