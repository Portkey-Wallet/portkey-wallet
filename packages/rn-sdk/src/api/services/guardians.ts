import { IGuardianService } from 'api/types/guardians';
import { injectable } from 'inversify';
import { BaseService } from '.';
import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import { CheckWalletUnlocked } from 'api/decorate';

@injectable()
export class GuardiansService extends BaseService implements IGuardianService {
  @CheckWalletUnlocked()
  async guardiansManager() {
    this.openFromExternal(PortkeyEntries.GUARDIAN_HOME_ENTRY);
  }
}
