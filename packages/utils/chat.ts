export const formatMessageNumToStr = (num: number): string | undefined => {
  if (!num || num < 0) return undefined;
  return num > 99 ? '99+' : String(num);
};
