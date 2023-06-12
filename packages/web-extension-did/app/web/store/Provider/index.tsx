import { ConfigProvider } from 'antd';
import ErrorBoundary from 'components/ErrorBoundary';
import ScreenLoading from 'components/ScreenLoading';
import { useLanguage } from 'i18n';
import { ANTD_LOCAL } from 'i18n/config';
import Modals from 'models';
import PermissionCheck from 'pages/components/PermissionCheck';
import { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { prefixCls } from '../../constants';
import ReduxProvider from './ReduxProvider';
import Updater from './Updater';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

let childrenNode: any = undefined;

const bodyRootWrapper = document.body;
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  // release: 'v1.0.0',
  // environment: process.env.NODE_ENV,
});
ConfigProvider.config({
  prefixCls,
});

export default function ContextProviders({
  children,
  pageType = 'Popup',
}: {
  children?: React.ReactNode;
  pageType?: 'Popup' | 'Prompt';
}) {
  const { language } = useLanguage();

  console.log(children === childrenNode, pageType, 'PermissionCheck=ContextProviders');
  if (childrenNode === undefined) childrenNode = children;
  useEffect(() => {
    let preLanguageWrapper: string | null = null;
    bodyRootWrapper.classList.forEach((item) => {
      if (item.includes('-language-wrapper')) {
        preLanguageWrapper = item;
      }
    });
    preLanguageWrapper && bodyRootWrapper.classList.remove(preLanguageWrapper);
    bodyRootWrapper.classList.add(`${language}-language-wrapper`);
  }, [language]);

  return (
    <ConfigProvider locale={ANTD_LOCAL[language]} autoInsertSpaceInButton={false} prefixCls={prefixCls}>
      <ErrorBoundary>
        <ReduxProvider>
          <ScreenLoading />
          <HashRouter>
            <Modals />
            <Updater />
            <PermissionCheck pageType={pageType}>{children}</PermissionCheck>
          </HashRouter>
        </ReduxProvider>
      </ErrorBoundary>
    </ConfigProvider>
  );
}
