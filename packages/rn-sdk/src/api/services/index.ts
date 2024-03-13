import { IBaseService, IServices, TYPES, WalletState } from 'api/types';
import type { IAccountService } from 'api/types/account';
import type { IActivityService } from 'api/types/activity';
import type { IAssetsService } from 'api/types/assets';
import type { IContractService } from 'api/types/contract';
import type { IDataService } from 'api/types/data';
import type { IGuardianService } from 'api/types/guardians';
import type { IRampService } from 'api/types/ramp';
import type { IScanService } from 'api/types/scan';
import type { ISettingsService } from 'api/types/settings';
import { PortkeyEntries } from 'config/entries';
import { LaunchMode, LaunchModeSet } from 'global/init/entries';
import { inject, injectable } from 'inversify';
import { EntryResult, PortkeyModulesEntity } from 'service/native-modules';
import { wrapEntry } from 'utils/commonUtil';

@injectable()
export class Services implements IServices {
  @inject(TYPES.AccountService) readonly accountService: IAccountService;
  @inject(TYPES.GuardiansService) readonly guardianService: IGuardianService;
  @inject(TYPES.AssetsService) readonly assetsService: IAssetsService;
  @inject(TYPES.RampService) readonly rampService: IRampService;
  @inject(TYPES.SettingsService) readonly settingsService: ISettingsService;
  @inject(TYPES.ActivityService) readonly activityService: IActivityService;
  @inject(TYPES.ScanService) readonly scanService: IScanService;
  @inject(TYPES.DataService) readonly dataService: IDataService;
  @inject(TYPES.ContractService) readonly contractService: IContractService;
}
@injectable()
export class BaseService implements IBaseService {
  @inject(TYPES.DataService) private _dataService: IDataService;
  protected openFromExternal(target: PortkeyEntries, param?: any) {
    PortkeyModulesEntity.RouterModule.navigateTo(
      wrapEntry(target),
      LaunchModeSet.get(target) || LaunchMode.STANDARD,
      'external',
      'none',
      false,
      param === null || param === undefined ? ({} as any) : param,
    );
  }
  protected openResultFromExternal<R>(target: PortkeyEntries, callback: (res: EntryResult<R>) => void, param?: any) {
    PortkeyModulesEntity.RouterModule.navigateToWithOptions(
      wrapEntry(target),
      LaunchModeSet.get(target) || LaunchMode.STANDARD,
      'external',
      param === null || param === undefined ? ({} as any) : param,
      callback,
    );
  }
  protected async checkIsUnlocked() {
    const walletState = await this._dataService.getWalletState();
    return walletState === WalletState.UNLOCKED;
  }
  protected async checkIsLocked() {
    const walletState = await this._dataService.getWalletState();
    return walletState === WalletState.LOCKED;
  }
}
