import { IAssetsService } from 'api/types/assets';
import { BaseService } from '.';
import { injectable } from 'inversify';
import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import { IToSendHomeParamsType } from 'api/types';
import { CheckWalletUnlocked } from 'api/decorate';

@injectable()
export class AssetsService extends BaseService implements IAssetsService {
  @CheckWalletUnlocked()
  async openAssetsDashboard() {
    this.openFromExternal(PortkeyEntries.ASSETS_HOME_ENTRY);
  }

  @CheckWalletUnlocked()
  async openSendToken(props: IToSendHomeParamsType) {
    this.openFromExternal(PortkeyEntries.SEND_TOKEN_HOME_ENTRY, props);
  }
}
