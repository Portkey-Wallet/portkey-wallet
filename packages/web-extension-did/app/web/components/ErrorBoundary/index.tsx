import { ReactNode, useCallback, useMemo } from 'react';
import ReactErrorBoundary, { ErrorBoundaryTrue, handleReportError } from '@portkey-wallet/utils/errorBoundary';
import CustomSvg from 'components/CustomSvg';
import { Button } from 'antd';
import clsx from 'clsx';
import * as Sentry from '@sentry/react';
import './index.less';

export type ErrorBoundaryProps = {
  children: ReactNode;
  view: string;
  pageType: string;
};

export default function ErrorBoundary({ children, view, pageType }: ErrorBoundaryProps) {
  const isPrompt = useMemo(() => pageType === 'Prompt', [pageType]);
  const onError = useCallback(
    ({ error, componentStack }: Omit<ErrorBoundaryTrue, 'hasError'>) => {
      Sentry.captureException(handleReportError({ error, componentStack, view }), { level: 'error' });
    },
    [view],
  );
  return (
    <ReactErrorBoundary
      onError={(error, componentStack) => onError({ error, componentStack })}
      fallback={({ resetError }) => {
        return (
          <div className={clsx(!isPrompt && 'error-body-popup', 'error-body', 'flex')}>
            <div className="flex-column-center">
              <CustomSvg type="ErrorIcon" />
              <div className="tip">
                {"Oops! Looks like something went wrong. But don't worry, your wallet and funds are safe and sound."}
              </div>
            </div>
            <div className="btn-wrap">
              <Button onClick={resetError}>Reload</Button>
            </div>
          </div>
        );
      }}>
      {children}
    </ReactErrorBoundary>
  );
}
