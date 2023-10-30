import * as Sentry from '@sentry/react-native';
import { ExceptionManager } from '@portkey-wallet/utils/ExceptionManager';

class SentryRNExceptionManager extends ExceptionManager {}

const exceptionManager = new SentryRNExceptionManager(Sentry);

export { exceptionManager };
