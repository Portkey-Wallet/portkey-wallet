import { ConfigProvider } from 'antd';
import React from 'react';
import { useEffectOnce } from 'react-use';

export default function StyleProvider({ children, prefixCls }: { children: React.ReactNode; prefixCls: string }) {
  useEffectOnce(() => {
    ConfigProvider.config({
      prefixCls: prefixCls,
    });
  });
  return <ConfigProvider prefixCls={prefixCls}>{children}</ConfigProvider>;
}
