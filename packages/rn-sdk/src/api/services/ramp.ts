import { IRampService, RampTabType } from 'api/types/ramp';
import { injectable } from 'inversify';
import { BaseService } from '.';
import { CheckWalletUnlocked } from 'api/decorate';

@injectable()
export class RampService extends BaseService implements IRampService {
  @CheckWalletUnlocked()
  openRampHome(toTab?: RampTabType): Promise<void> {
    throw new Error('Method not implemented.');
    toTab === RampTabType.BUY;
  }
}
