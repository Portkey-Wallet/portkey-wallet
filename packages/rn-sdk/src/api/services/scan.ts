import { IScanService } from 'api/types/scan';
import { injectable } from 'inversify';
import { BaseService } from '.';
import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import { CheckWalletUnlocked } from 'api/decorate';

@injectable()
export class ScanService extends BaseService implements IScanService {
  @CheckWalletUnlocked()
  async scanQRCodeManager() {
    this.openFromExternal(PortkeyEntries.SCAN_QR_CODE);
  }
}
