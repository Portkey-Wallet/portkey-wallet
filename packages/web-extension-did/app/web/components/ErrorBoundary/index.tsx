import { ReactNode, useCallback, useMemo } from 'react';
import ReactErrorBoundary, { ErrorBoundaryTrue, handleReportError } from '@portkey-wallet/utils/errorBoundary';
import { Button, Image } from 'antd';
import * as Sentry from '@sentry/react';
import './index.less';
import { BaseCommonPage } from 'components/CommonPage';

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
          <BaseCommonPage className="error-boundary-page" isHeaderShow={isPrompt}>
            <div className="error-boundary-wrap">
              <div className="error-boundary-body">
                <Image src="assets/images/crash_image.png" className="error-boundary-image" preview={false} />

                <div className="error-boundary-content">
                  <div className="error-boundary-title">Oops!</div>
                  <div className="error-boundary-description">
                    Just a minor hiccup. Your wallet
                    <br />
                    is perfectly safe!
                  </div>
                </div>
              </div>
              <div className="error-boundary-footer">
                <Button type="primary" onClick={resetError}>
                  Reload
                </Button>
              </div>
            </div>
          </BaseCommonPage>
        );
      }}>
      {children}
    </ReactErrorBoundary>
  );
}
