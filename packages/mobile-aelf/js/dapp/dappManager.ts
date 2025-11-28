import { EOACommonState } from '@portkey-wallet/types/types-eoa/store';
import { DappManager } from '@portkey-wallet/utils/dappEOA/dappManager';
import { UserStoreState } from 'store/user/types';

type MobileState = EOACommonState & {
  user: UserStoreState;
};
export interface IDappMobileManager {
  isLocked(): Promise<boolean>;
}

export class DappMobileManager extends DappManager<MobileState> implements IDappMobileManager {
  async getUser() {
    return (await this.store.getState()).user;
  }
  isLocked = async (): Promise<boolean> => {
    return !(await this.getUser())?.credentials?.pin;
  };
  async isActive(origin: string): Promise<boolean> {
    return (await super.isActive(origin)) && !(await this.isLocked());
  }
}
