export const validateError = (message: string, success: boolean, code: string) => {
  if (!success || code.substring(0, 1) !== '2') {
    throw new Error(message);
  }
};
