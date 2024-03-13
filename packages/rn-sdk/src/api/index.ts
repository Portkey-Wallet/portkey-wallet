import { IServices, IToSendHomeParamsType, TYPES, UnlockedWallet, WalletState } from './types';
import { Services } from './services';
import { IAccountService } from './types/account';
import { IGuardianService } from './types/guardians';
import { IAssetsService } from './types/assets';
import { IRampService, RampTabType } from './types/ramp';
import { ISettingsService } from './types/settings';
import { ActivityDetailPropsType, IActivityService } from './types/activity';
import { IScanService } from './types/scan';
import { IDataService } from './types/data';
import { BaseMethodResult, CallCaMethodProps, IContractService } from './types/contract';
import { myContainer } from './inversify.config';
import { IConfig, ITheme } from './config';
import { GetAccountAssetsByKeywordsResult, IActivitiesApiResponse } from 'network/dto/query';
import { PortkeyConfig } from '../global/config';
export * from './types';
class Portkey
  implements
    IAccountService,
    IGuardianService,
    IAssetsService,
    IRampService,
    ISettingsService,
    IActivityService,
    IScanService,
    IDataService,
    IContractService
{
  private readonly services: IServices;
  constructor() {
    this.services = myContainer.get<Services>(TYPES.Services);
  }
  getActivityInfoList({
    offset,
    pageSize,
  }: { offset?: number; pageSize?: number } = {}): Promise<IActivitiesApiResponse> {
    return this.services.dataService.getActivityInfoList({ offset, pageSize });
  }

  init({ config, theme }: { config?: IConfig; theme?: ITheme } = {}) {
    if (config) {
      PortkeyConfig.config = config;
    }
    if (theme) {
      PortkeyConfig.theme = theme;
    }
  }

  callCaContractMethod(props: CallCaMethodProps): Promise<BaseMethodResult> {
    return this.services.contractService.callCaContractMethod(props);
  }
  getWalletInfo(containMultiCaAddresses?: boolean | undefined): Promise<UnlockedWallet> {
    return this.services.dataService.getWalletInfo(containMultiCaAddresses);
  }
  getWalletState(): Promise<WalletState> {
    return this.services.dataService.getWalletState();
  }
  getAssetsInfo({
    offset,
    pageSize,
    keyword,
  }: {
    offset?: number;
    pageSize?: number;
    keyword?: string;
  } = {}): Promise<GetAccountAssetsByKeywordsResult> {
    return this.services.dataService.getAssetsInfo({ offset, pageSize, keyword });
  }
  scanQRCodeManager(): Promise<void> {
    return this.services.scanService.scanQRCodeManager();
  }
  openActivityList(): Promise<void> {
    return this.services.activityService.openActivityList();
  }
  openActivityDetail(props: ActivityDetailPropsType): Promise<void> {
    return this.services.activityService.openActivityDetail(props);
  }
  settingsManager(): Promise<void> {
    return this.services.settingsService.settingsManager();
  }
  paymentSecurityManager(): Promise<void> {
    return this.services.settingsService.paymentSecurityManager();
  }
  openRampHome(toTab?: RampTabType | undefined): Promise<void> {
    return this.services.rampService.openRampHome(toTab);
  }
  openAssetsDashboard(): Promise<void> {
    return this.services.assetsService.openAssetsDashboard();
  }
  openSendToken(props: IToSendHomeParamsType): Promise<void> {
    return this.services.assetsService.openSendToken(props);
  }
  guardiansManager(): Promise<void> {
    return this.services.guardianService.guardiansManager();
  }
  login(): Promise<UnlockedWallet | null> {
    return this.services.accountService.login();
  }
  exitWallet(): Promise<boolean> {
    return this.services.accountService.exitWallet();
  }
  lockWallet(): Promise<boolean> {
    return this.services.accountService.lockWallet();
  }
  unlockWallet(): Promise<UnlockedWallet | null> {
    return this.services.accountService.unlockWallet();
  }
}
const portkey = new Portkey();
export { portkey };
