import * as Sentry from '@sentry/react-native';
import { ExceptionManager, Severity } from '@portkey-wallet/utils/ExceptionManager';

interface Global {
  ErrorUtils: {
    setGlobalHandler: any;
    reportFatalError: any;
    getGlobalHandler: any;
  };
}

declare let global: Global;

class SentryRNExceptionManager extends ExceptionManager {
  initGlobalJSErrorHandler() {
    const originalHandler = global.ErrorUtils?.getGlobalHandler();
    global.ErrorUtils?.setGlobalHandler?.((error: any, isFatal: boolean) => {
      if (!error || !(error instanceof Error) || !error.stack) return {};
      this.reportError(error, Severity.Fatal);
      if (__DEV__) {
        originalHandler?.(error, isFatal);
      }
    });
    console.error = (message, error) => (global as any).ErrorUtils?.reportError?.(error);
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

const exceptionManager = new SentryRNExceptionManager(Sentry);

export { exceptionManager };
