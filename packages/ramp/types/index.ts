import { RampProvider } from '..';
import { IRampProviderType } from '../constants';
import { IRampProviderInfo } from './provider';

export * from './services';
export * from './config';

export interface IRampProvider {
  providerInfo: IRampProviderInfo;
}

export type IRampProviderMap = Record<keyof typeof IRampProviderType, RampProvider>;
