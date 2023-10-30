import { addBreadcrumb, captureException, withScope } from '@sentry/react-native';

const DEBUG = '@PortkeyDID:';
const AGREED = 'agreed';
/**
 * Wrapper class that allows us to override
 * console.log and console.error and in the future
 * we will have flags to do different actions based on
 * the environment, for ex. log to a remote server if prod
 */
export default class Logger {
  /**
   * console.log wrapper
   *
   * @param {object} args - data to be logged
   * @returns - void
   */
  static async log(...args: any[]) {
    // Check if user passed accepted opt-in to metrics
    const metricsOptIn = AGREED;
    if (__DEV__) {
      args.unshift(DEBUG);
      console.log.apply(null, args);
    } else if (metricsOptIn === AGREED) {
      addBreadcrumb({
        message: JSON.stringify(args),
      });
    }
  }
  /**
   * console.error wrapper
   *
   * @param {Error|string|object} error - error to be logged
   * @param {string|object} extra - Extra error info
   * @returns - void
   */
  static async error(error: any, extra: any) {
    // Check if user passed accepted opt-in to metrics
    const metricsOptIn = AGREED;
    if (__DEV__) {
      console.warn(DEBUG, error);
    } else if (metricsOptIn === AGREED) {
      let exception = error;

      if (!error) {
        if (!extra) return console.warn('No error nor extra info provided');

        const typeExtra = typeof extra;
        switch (typeExtra) {
          case 'string':
            exception = new Error(extra);
            break;
          case 'object':
            if (extra.message) {
              exception = new Error(extra.message);
            } else {
              exception = new Error(JSON.stringify(extra));
            }
            break;
          default:
            exception = new Error('error to capture is not an error instance');
        }
      } else if (!(error instanceof Error)) {
        const type = typeof error;
        switch (type) {
          case 'string':
            exception = new Error(error);
            break;
          case 'object':
            exception = new Error(JSON.stringify(error));
            break;
          default:
            exception = new Error('error to capture is not an error instance');
        }
        exception.originalError = error;
      }
      if (extra) {
        if (typeof extra === 'string') {
          extra = { message: extra };
        }
        withScope(scope => {
          scope.setExtras(extra);
          captureException(exception);
        });
      } else {
        captureException(exception);
      }
    }
  }
}
