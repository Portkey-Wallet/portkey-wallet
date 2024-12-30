import PortKeyHeader from 'pages/components/PortKeyHeader';
import { ReactNode } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';
import clsx from 'clsx';

export type TCommonPageProps = {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
};

export const CommonPage = ({ children, className, contentClassName }: TCommonPageProps) => {
  const { isPrompt, isNotLessThan768 } = useCommonState();
  return (
    <div className={clsx('common-page-wrap', className)}>
      {isPrompt && isNotLessThan768 ? <PortKeyHeader /> : <></>}
      <div className={clsx('common-page-content', contentClassName)}>
        <div className="common-page-inner">{children}</div>
      </div>
    </div>
  );
};
