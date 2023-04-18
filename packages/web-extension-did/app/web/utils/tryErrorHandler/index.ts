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

export const contractErrorHandler = (error: any) => {
  return error?.Error?.Message || error?.message?.Message || error?.message || error?.Error || error;
};
