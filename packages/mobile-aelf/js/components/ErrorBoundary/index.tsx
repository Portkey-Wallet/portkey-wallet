import React, { ReactNode, useCallback } from 'react';
import { Fallback } from 'components/Fallback';
import { exceptionManager } from 'utils/errorHandler/ExceptionHandler';
import { Severity } from '@portkey-wallet/utils/ExceptionManager';
import ReactErrorBoundary, { ErrorBoundaryTrue, handleReportError } from '@portkey-wallet/utils/errorBoundary';
import * as errorUtils from 'utils/errorUtils';
import crashlytics from '@react-native-firebase/crashlytics';
import * as Clipboard from 'expo-clipboard';

export type ErrorBoundaryProps = {
  children: ReactNode;
  view: string;
};
const originHandler = errorUtils.getGlobalHandler();
class ReactNativeErrorBoundary extends ReactErrorBoundary {
  componentDidMount() {
    errorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
      if (isFatal && !__DEV__) {
        const componentStack = error.stack;
        this.setState({ hasError: true, error, componentStack });
        this.props.onError?.(error, componentStack);
        return;
      }
      originHandler?.(error, isFatal);
    });
  }
}

export default function ErrorBoundary({ children, view }: ErrorBoundaryProps) {
  const onCaptureException = useCallback(
    async ({ error, componentStack }: Omit<ErrorBoundaryTrue, 'hasError'>) => {
      const handleError = handleReportError({ error, componentStack, view });
      crashlytics().recordError(handleError, view);

      console.log('Severity.Error', JSON.stringify(handleError), Severity.Error);

      // TODO: delete it
      await Clipboard.setStringAsync(JSON.stringify(handleError));

      exceptionManager.reportError(handleError, Severity.Error);
    },
    [view],
  );
  return (
    <ReactNativeErrorBoundary
      onError={(error, componentStack) => onCaptureException({ error, componentStack })}
      fallback={errorData => <Fallback {...errorData} />}>
      {children}
    </ReactNativeErrorBoundary>
  );
}
