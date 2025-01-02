import PortKeyHeader from 'pages/components/PortKeyHeader';
import { ReactNode, useMemo } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';

export type TCommonPageProps = {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
};

const COMMON_PAGE_CLASS_NAME_MAP: Record<string, string> = {
  '/unlock': 'large-logo-page',
};

export const CommonPage = ({ children, className, contentClassName }: TCommonPageProps) => {
  const { pathname } = useLocation();

  const extraClassName = useMemo(() => COMMON_PAGE_CLASS_NAME_MAP[pathname], [pathname]);

  const { isPrompt, isNotLessThan768 } = useCommonState();
  return (
    <div className={clsx('common-page-wrap', extraClassName, className)}>
      {isPrompt && isNotLessThan768 ? <PortKeyHeader /> : <></>}
      <div className={clsx('common-page-content', contentClassName)}>
        <div className="common-page-inner">{children}</div>
      </div>
    </div>
  );
};
