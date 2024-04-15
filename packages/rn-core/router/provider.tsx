import React, { useEffect } from 'react';
import { RouterContext, RouterParams, defaultRouterParams } from './context';
import router from '.';
import { PortkeyEntries } from './types';

const RouterProvider = ({ children, value }: { children: any; value?: RouterParams }) => {
  useEffect(() => {
    const currentPage = value?.from as PortkeyEntries;
    router.push({ name: currentPage, params: value?.params });
    router.listenersFunc()[currentPage]?.['focus'].forEach(item => item());
  }, []);
  return <RouterContext.Provider value={value ?? defaultRouterParams}>{children}</RouterContext.Provider>;
};
export default RouterProvider;
