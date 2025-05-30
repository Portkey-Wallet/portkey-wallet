import { Button } from 'antd';
import React from 'react';
import clsx from 'clsx';
import './styles.less';
import { isUrl } from '@portkey-wallet/utils';
export default function CommonLink({
  href,
  children,
  className,
  showIcon = true,
  isTagA,
  target = '_blank',
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  isTagA?: boolean;
  target?: string;
}) {
  if (isTagA)
    return (
      <a target={target} href={href}>
        {children}
      </a>
    );
  return (
    <Button
      className={clsx('common-link', className)}
      disabled={!href || !isUrl(href)}
      onClick={(e) => e.stopPropagation()}
      target={target}
      type="link"
      href={href}>
      {showIcon}
      {children}
    </Button>
  );
}
