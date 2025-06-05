export const verifyErrorHandler = (error: any) => {
  if (typeof error === 'string') return error;
  let _error: string;
  if (error?.type) {
    _error = error.type;
  } else if (typeof error === 'string') {
    _error = error;
  } else {
    _error = error?.message || error?.error?.message || 'Something error';
  }
  return _error;
};
