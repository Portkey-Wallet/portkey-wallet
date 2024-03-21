/* eslint-disable @typescript-eslint/ban-ts-comment */
export const setGlobalHandler = (errorHandler: (error: any, isFatal?: boolean) => void) => {
  // @ts-ignore
  global.ErrorUtils.setGlobalHandler(errorHandler);
};

export const getGlobalHandler = () => {
  // @ts-ignore
  return global.ErrorUtils?.getGlobalHandler();
};
