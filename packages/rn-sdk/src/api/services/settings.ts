import { injectable } from 'inversify';
import { BaseService } from '.';
import { PortkeyEntries } from 'config/entries';
import { ISettingsService } from 'api/types/settings';
import { CheckWalletUnlocked } from 'api/decorate';

@injectable()
export class SettingsService extends BaseService implements ISettingsService {
  @CheckWalletUnlocked()
  async settingsManager() {
    this.openFromExternal(PortkeyEntries.ACCOUNT_SETTING_ENTRY);
  }

  @CheckWalletUnlocked()
  async paymentSecurityManager() {
    this.openFromExternal(PortkeyEntries.PAYMENT_SECURITY_HOME_ENTRY);
  }
}
