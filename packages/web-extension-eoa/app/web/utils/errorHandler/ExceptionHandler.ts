import * as Sentry from '@sentry/react';
import { ExceptionManager, Severity } from '@portkey-wallet/utils/ExceptionManager';

class SentryExceptionManager extends ExceptionManager {
  initGlobalJSErrorHandler() {
    window.onerror = (_msg, _url, _line, _column, error) => {
      this.reportError(error, Severity.Fatal);
      Sentry.captureException(error, { level: Severity.Fatal });
    };
  }
  initGlobalUnHandledPromiseErr() {
    // require('promise/setimmediate/rejection-tracking').enable({
    //   allRejections: true,
    //   onUnhandled: (id: any, error: any) => {
    //     const {message, stack} = error;
    //     const warning =
    //       `Possible Unhandled Promise Rejection (id: ${id}):\n` +
    //       (message == null ? '' : `${message}\n`) +
    //       (stack == null ? '' : stack);
    //     console.warn(warning);
    //     this.reportError(error, Severity.Warning);
    //   },
    // });
  }
}

const exceptionManager = new SentryExceptionManager(Sentry);

export { exceptionManager };
