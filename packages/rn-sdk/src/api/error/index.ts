export const errorMap = new Map<number, string>();
errorMap.set(1001, 'Wallet state is error');
errorMap.set(1002, 'Contract invoke result is null');
errorMap.set(1003, 'Failed to unlock wallet');
errorMap.set(1004, 'Login failed');
errorMap.set(9999, 'Unknown error');

export class AccountError extends Error {
  errorCode: number;
  constructor(errorCode?: number, message?: string) {
    super(message ?? errorMap.get(errorCode || 9999));
    this.name = 'AccountError';
    this.errorCode = errorCode || -1;
  }
}
