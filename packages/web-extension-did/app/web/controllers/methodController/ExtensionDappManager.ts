import { DappManager } from '@portkey-wallet/utils/dapp/dappManager';
import { DappManagerOptions } from '@portkey-wallet/types/types-ca/dapp';

export class ExtensionDappManager<T = any> extends DappManager {
  protected getPin: () => boolean;
  constructor(
    options: DappManagerOptions<T> & {
      getPin: () => boolean;
    },
  ) {
    super(options as any);
    this.getPin = options.getPin;
  }

  isLocked = async (): Promise<boolean> => {
    return this.getPin();
  };

  async isActive(origin: string): Promise<boolean> {
    return (await super.isActive(origin)) && !(await this.isLocked());
  }
}
