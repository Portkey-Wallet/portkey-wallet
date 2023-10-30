import { DappManager } from '@portkey-wallet/utils/dapp/dappManager';
import { DappManagerOptions } from '@portkey-wallet/types/types-ca/dapp';

export class ExtensionDappManager<T = any> extends DappManager {
  protected locked: () => boolean;
  constructor(
    options: DappManagerOptions<T> & {
      locked: () => boolean;
    },
  ) {
    super(options as any);
    this.locked = options.locked;
  }

  isLocked = async (): Promise<boolean> => {
    return this.locked();
  };

  async isActive(origin: string): Promise<boolean> {
    return (await super.isActive(origin)) && !(await this.isLocked());
  }
}
