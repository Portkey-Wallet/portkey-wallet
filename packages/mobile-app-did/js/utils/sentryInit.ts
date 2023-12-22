import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

// Sentry init
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

if (!__DEV__) {
  Sentry.init({
    dsn: Config.SENTRY_DSN,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    environment: Config.SENTRY_ENVIRONMENT,

    integrations: [
      new Sentry.ReactNativeTracing({
        // Pass instrumentation to be used as `routingInstrumentation`
        routingInstrumentation,
        tracingOrigins: ['localhost', 'my-site-url.com', /^\//],
        // ...
      }),
    ],
  });
}
