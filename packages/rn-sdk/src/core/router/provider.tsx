import React from 'react';
import { RouterContext, RouterParams, defaultRouterParams } from './context';

const RouterProvider = ({ children, value }: { children: any; value?: RouterParams }) => {
  return <RouterContext.Provider value={value ?? defaultRouterParams}>{children}</RouterContext.Provider>;
};
export default RouterProvider;
