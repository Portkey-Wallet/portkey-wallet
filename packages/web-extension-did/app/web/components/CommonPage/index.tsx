import PortKeyHeader from 'pages/components/PortKeyHeader';
import { ReactNode, useMemo, useEffect } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';

export type TCommonPageProps = {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  isHeaderShow?: boolean;
};

enum CommonPageClassName {
  LARGE_LOGO_PAGE = 'large-logo-page',
  DARK_FULL_PAGE = 'dark-full-page',
}

enum CommonBodyClassName {
  THEME_DARK_FULL = 'theme-dark-full',
}

const COMMON_PAGE_CLASS_NAME_MAP: Record<string, string> = {
  '/unlock': `${CommonPageClassName.LARGE_LOGO_PAGE} ${CommonPageClassName.DARK_FULL_PAGE}`,
  '/register': `${CommonPageClassName.LARGE_LOGO_PAGE} ${CommonPageClassName.DARK_FULL_PAGE} register-page`,
  '/login': `${CommonPageClassName.LARGE_LOGO_PAGE} ${CommonPageClassName.DARK_FULL_PAGE}`,
  '/prepare-wallet': `${CommonPageClassName.LARGE_LOGO_PAGE} ${CommonPageClassName.DARK_FULL_PAGE}`,
  '/success-page': `${CommonPageClassName.LARGE_LOGO_PAGE} ${CommonPageClassName.DARK_FULL_PAGE}`,
};

export const BaseCommonPage = ({ children, className, contentClassName, isHeaderShow }: TCommonPageProps) => {
  return (
    <div className={clsx('common-page-wrap', className)}>
      {isHeaderShow ? <PortKeyHeader className="common-page-header" /> : <></>}
      <div className={clsx('common-page-content', contentClassName)}>
        <div className="common-page-inner">{children}</div>
      </div>
    </div>
  );
};

export const CommonPage = ({ className, isHeaderShow, ...props }: TCommonPageProps) => {
  const { pathname } = useLocation();

  const extraClassName = useMemo(() => {
    for (const key in COMMON_PAGE_CLASS_NAME_MAP) {
      if (pathname.startsWith(key)) {
        return COMMON_PAGE_CLASS_NAME_MAP[key];
      }
    }
    return '';
  }, [pathname]);

  const { isPrompt } = useCommonState();
  const isBaseHeaderShow = useMemo(() => isHeaderShow ?? isPrompt, [isHeaderShow, isPrompt]);

  useEffect(() => {
    if (extraClassName.includes(CommonPageClassName.DARK_FULL_PAGE)) {
      document.body.classList.add(CommonBodyClassName.THEME_DARK_FULL);
    } else {
      document.body.classList.remove(CommonBodyClassName.THEME_DARK_FULL);
    }
  }, [extraClassName]);

  return <BaseCommonPage isHeaderShow={isBaseHeaderShow} className={clsx(extraClassName, className)} {...props} />;
};
