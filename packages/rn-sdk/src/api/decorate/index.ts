import 'reflect-metadata';
import { isWalletUnlocked } from 'model/verify/core';
import { AccountError, errorMap } from 'api/error';

export enum HANDLE_WAY {
  THROW_ERROR,
  RETURN_FALSE,
}
interface CheckWalletUnlockedOptions {
  errorCode?: number;
  way?: HANDLE_WAY;
}

export function CheckWalletUnlocked({ errorCode, way }: CheckWalletUnlockedOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      if (!(await isWalletUnlocked())) {
        if (way === HANDLE_WAY.RETURN_FALSE) {
          console.warn(errorMap.get(errorCode ?? 1001));
          return false;
        } else {
          throw new AccountError(errorCode ?? 1001);
        }
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

export function CheckWalletLocked({ errorCode, way }: CheckWalletUnlockedOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      if (await isWalletUnlocked()) {
        if (way === HANDLE_WAY.RETURN_FALSE) {
          console.warn(errorMap.get(errorCode ?? 1001));
          return false;
        } else {
          throw new AccountError(errorCode ?? 1001);
        }
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
