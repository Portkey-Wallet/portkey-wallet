import { IRampRequest } from './request';

export * from './services';
export * from './sellSocket';
export * from './config';
export * from './provider';
export * from './request';

export interface IBaseRampOptions {
  request: IRampRequest;
}
