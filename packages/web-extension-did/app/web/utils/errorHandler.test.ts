import errorHandler from './errorHandler';
describe('errorHandler', () => {
  test('should return the correct output for a success code', () => {
    const code = 0;
    const output = errorHandler(code);
    expect(output).toEqual({
      error: code,
      message: '',
    });
  });
  test('should return the correct output for an error object', () => {
    const code = 200002;
    const error = new Error('Payload is false.');
    const output = errorHandler(code, error);
    expect(output).toEqual({
      error: code,
      name: 'Error',
      message: 'Payload is false.',
      stack: error.stack,
      data: undefined,
    });
  });
  test('should return the correct output for a custom error message', () => {
    const code = 410002;
    const error = 'Invalid parameters.';
    const output = errorHandler(code, error);
    expect(output).toEqual({
      error: code,
      name: 'customError',
      message: 'Invalid parameters.',
    });
  });
  test('should return the correct output for error is not exist', () => {
    const code = 200002;
    const output = errorHandler(code, undefined);
    expect(output).toEqual({
      error: code,
      name: 'errorMap',
      message: 'No Wallet Info.',
      data: undefined,
    });
  });
  test('should return the correct output for an error object with additional properties', () => {
    const code = 200002;
    const error = {
      name: 'CustomError',
      message: 'Payload is false.',
      stack: 'Error stack',
      data: { key: 'value' },
    };
    const output = errorHandler(code, error);
    expect(output).toEqual({
      error: code,
      name: 'CustomError',
      message: 'Payload is false.',
      stack: 'Error stack',
      data: { key: 'value' },
    });
  });
  test('should return the correct output for an error object with nested Error property', () => {
    const code = 200002;
    const error = {
      name: 'CustomError',
      Error: {
        Message: 'Payload is false.',
      },
    };
    const output = errorHandler(code, error);
    expect(output).toEqual({
      error: code,
      name: 'CustomError',
      message: 'Payload is false.',
      stack: undefined,
      data: undefined,
    });
  });
  test('should return the correct output for error type is not string and Error is undefined', () => {
    const code = 500001;
    const output = errorHandler(code, { name: 'name', stack: 'stack', data: 'data', Error: undefined });
    expect(output).toEqual({
      error: code,
      name: 'name',
      message: undefined,
      data: 'data',
      stack: 'stack',
    });
  });
  test('should return the correct output for error type is not string', () => {
    const code = 500001;
    const output = errorHandler(code, { name: 'name', stack: 'stack', data: {}, Error: 'error message' });
    expect(output).toEqual({
      error: code,
      name: 'name',
      message: 'error message',
      data: {},
      stack: 'stack',
    });
  });
});
