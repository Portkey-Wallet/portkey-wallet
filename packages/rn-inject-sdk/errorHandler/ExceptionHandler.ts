import { ExceptionManager } from '@portkey-wallet/utils/ExceptionManager';

class SentryRNSDKExceptionManager extends ExceptionManager {
  public setAnalyticsInstance(analyticsInstance: any) {}
  public reportAnalyticsEvent({
    eventName = 'DEFAULT_EVENT',
    params,
  }: {
    eventName?: string;
    params?: { [key: string]: any };
  }) {}
}

const exceptionManager = new SentryRNSDKExceptionManager({ captureException: () => {}, captureMessage: () => {} });

export { exceptionManager };
