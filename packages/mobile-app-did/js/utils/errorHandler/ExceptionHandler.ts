import * as Sentry from '@sentry/react-native';
import { ExceptionManager } from '@portkey-wallet/utils/ExceptionManager';
import { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics';

class SentryRNExceptionManager extends ExceptionManager {
  private analyticsInstance?: FirebaseAnalyticsTypes.Module;
  public setAnalyticsInstance(analyticsInstance: FirebaseAnalyticsTypes.Module) {
    this.analyticsInstance = analyticsInstance;
  }
  public reportAnalyticsEvent({
    eventName = 'DEFAULT_EVENT',
    params,
  }: {
    eventName?: string;
    params?: { [key: string]: any };
  }) {
    this.analyticsInstance?.logEvent(eventName, params);
  }
}

const exceptionManager = new SentryRNExceptionManager(Sentry);

export { exceptionManager };
