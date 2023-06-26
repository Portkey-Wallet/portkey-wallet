import { ReactNode, useCallback } from 'react';
import ReactErrorBoundary, { ErrorBoundaryTrue, handleReportError } from '@portkey-wallet/utils/errorBoundary';

export type ErrorBoundaryProps = {
  children: ReactNode;
  view: string;
};

export default function ErrorBoundary({ children, view }: ErrorBoundaryProps) {
  const onError = useCallback(
    ({ error, componentStack }: Omit<ErrorBoundaryTrue, 'hasError'>) => {
      const sendError = handleReportError({ error, componentStack, view });
      console.log(sendError, '====sendError');
      // TODO: reportError
    },
    [view],
  );
  return (
    <ReactErrorBoundary
      onError={(error, componentStack) => onError({ error, componentStack })}
      fallback={({ error, componentStack, resetError }) => {
        return (
          <>
            <h1>Something went wrong.</h1>
            {error.toString()}
            <br />
            {componentStack}
            <button onClick={resetError}>resetError</button>
          </>
        );
      }}>
      {children}
    </ReactErrorBoundary>
  );
}
