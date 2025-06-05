import { DappManager } from '@portkey-wallet/utils/dapp/dappManager';
import { DappManagerOptions } from '@portkey-wallet/types/types-ca/dapp';
import { ChainId } from '@portkey-wallet/types';
import { ApproveMethod } from '@portkey-wallet/constants/constants-ca/dapp';

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

  isApprove = async (payload: { contractAddress: string; method: string; chainId: ChainId }) => {
    const { contractAddress, method: contractMethod, chainId } = payload || {};
    const chainInfo = await this.getChainInfo(chainId);
    return (
      (contractAddress === chainInfo?.defaultToken.address && contractMethod === ApproveMethod.token) ||
      (contractAddress === chainInfo?.caContractAddress && contractMethod === ApproveMethod.ca)
    );
  };
}
