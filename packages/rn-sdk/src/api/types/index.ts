import { IAccountService } from './account';
import { IGuardianService } from './guardians';
import { ISettingsService } from './settings';
import { IScanService } from './scan';
import { IDataService } from './data';
import { IContractService } from './contract';
import { IAssetsService } from './assets';
import { IRampService } from './ramp';
import { IActivityService } from './activity';
export type { CallCaMethodProps, BaseMethodResult } from './contract';
export type UnlockedWallet = {
  caInfo: {
    caHash: string;
    caAddress: string;
  };
  multiCaAddresses: {
    [key: string]: string;
  };
  name: string;
  originChainId: string;
} & {
  privateKey: string;
  publicKey: string;
  address: string;
};
const TYPES = {
  AccountService: Symbol.for('AccountService'),
  ActivityService: Symbol.for('ActivityService'),
  AssetsService: Symbol.for('AssetsService'),
  ContractService: Symbol.for('ContractService'),
  DataService: Symbol.for('DataService'),
  GuardiansService: Symbol.for('GuardiansService'),
  RampService: Symbol.for('RampService'),
  ScanService: Symbol.for('ScanService'),
  SettingsService: Symbol.for('SettingsService'),

  BaseService: Symbol.for('BaseService'),
  Services: Symbol.for('Services'),
};
export { TYPES };

export enum WalletState {
  NONE,
  LOCKED,
  UNLOCKED,
}
export type { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
export interface IServices {
  readonly accountService: IAccountService;
  readonly guardianService: IGuardianService;
  readonly assetsService: IAssetsService;
  readonly rampService: IRampService;
  readonly settingsService: ISettingsService;
  readonly activityService: IActivityService;
  readonly scanService: IScanService;
  readonly dataService: IDataService;
  readonly contractService: IContractService;
}

export interface IBaseService {}
export * from './account';
export * from './activity';
export * from './assets';
export * from './contract';
export * from './data';
export * from './guardians';
export * from './ramp';
export * from './scan';
export * from './settings';
export * from 'api/error';
