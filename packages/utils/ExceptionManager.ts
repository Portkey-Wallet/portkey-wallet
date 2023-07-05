export const enum Severity {
  Fatal = 'fatal',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug',
}

type Extra = unknown;
type Extras = Record<string, Extra>;

interface CaptureContext {
  level?: Severity;
  extra?: Extras;
}

export interface SentryInstance {
  captureException: (error: any, options: CaptureContext) => void;
  captureMessage: (error: any, options: CaptureContext) => void;
}

export interface IExceptionManager {
  reportErrorMessage(error: any, level: Severity, extra?: Extras): void;
  reportError(error: any, level: Severity, extra?: Extras): void;
}
export abstract class ExceptionManager implements IExceptionManager {
  private sentryInstance: SentryInstance;
  constructor(sentryInstance: SentryInstance) {
    this.sentryInstance = sentryInstance;
    this.init(sentryInstance);
  }

  private init(sentryInstance: SentryInstance) {
    this.sentryInstance = sentryInstance;
  }
  public setSentryInstance(sentryInstance: SentryInstance) {
    this.sentryInstance = sentryInstance;
  }
  public reportError(error: any, level: Severity, extra?: Extras) {
    this.sentryInstance.captureException(error, {
      level,
      extra,
    });
  }
  public reportErrorMessage(errMsg: string, level: Severity, extra?: Extras) {
    this.sentryInstance.captureMessage(errMsg, {
      level,
      extra,
    });
  }
}
