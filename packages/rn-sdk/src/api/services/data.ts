import { WalletState } from 'api/types';
import { IDataService } from 'api/types/data';
import { injectable } from 'inversify';
import { isWalletExists, isWalletUnlocked } from 'model/verify/core';
import { getUnlockedWallet } from 'model/wallet';
import { NetworkController } from 'network/controller';
import { GetAccountAssetsByKeywordsResult } from 'network/dto/query';
import { AccountError } from 'api/error';
import { CheckWalletUnlocked } from 'api/decorate';

@injectable()
export class DataService implements IDataService {
  @CheckWalletUnlocked()
  async getWalletInfo(containMultiCaAddresses?: boolean | undefined) {
    const wallet = await getUnlockedWallet({ getMultiCaAddresses: containMultiCaAddresses });
    return wallet;
  }
  @CheckWalletUnlocked()
  async getActivityInfoList({ offset, pageSize }: { offset?: number; pageSize?: number }) {
    const instantWallet = await getUnlockedWallet({ getMultiCaAddresses: true });
    const { originChainId, multiCaAddresses, address } = instantWallet;
    const { data, totalRecordCount } = await NetworkController.getRecentActivities({
      caAddressInfos: Object.entries(multiCaAddresses).map(it => {
        return { chainId: it[0], caAddress: it[1] };
      }),
      managerAddresses: [address],
      chainId: originChainId,
      skipCount: offset ?? 0,
      maxResultCount: pageSize ?? 30,
    });
    return {
      data,
      totalRecordCount,
    };
  }

  async getWalletState() {
    const exist = await isWalletExists();
    const unlocked = await isWalletUnlocked();
    return exist ? (unlocked ? WalletState.UNLOCKED : WalletState.LOCKED) : WalletState.NONE;
  }
  @CheckWalletUnlocked()
  async getAssetsInfo({
    offset,
    pageSize,
    keyword,
  }: {
    offset?: number;
    pageSize?: number;
    keyword?: string;
  }): Promise<GetAccountAssetsByKeywordsResult> {
    try {
      const { multiCaAddresses } = await getUnlockedWallet({ getMultiCaAddresses: true });
      return await NetworkController.searchUserAssets({
        maxResultCount: pageSize ?? 30,
        skipCount: offset ?? 0,
        keyword: keyword ?? '',
        caAddressInfos: Object.entries(multiCaAddresses).map(([chainId, caAddress]) => ({
          chainId,
          caAddress,
          chainName: chainId,
        })),
      });
    } catch (e: any) {
      throw new AccountError(9999, e?.message || e);
    }
  }
}
