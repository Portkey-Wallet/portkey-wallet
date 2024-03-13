import { GetAccountAssetsByKeywordsResult, IActivitiesApiResponse } from 'network/dto/query';
import { UnlockedWallet, WalletState } from './';

export interface IDataService {
  getWalletInfo(containMultiCaAddresses?: boolean): Promise<UnlockedWallet>;
  getWalletState(): Promise<WalletState>;
  getAssetsInfo({
    offset,
    pageSize,
    keyword,
  }: {
    offset?: number;
    pageSize?: number;
    keyword?: string;
  }): Promise<GetAccountAssetsByKeywordsResult>;
  getActivityInfoList({ offset, pageSize }: { offset?: number; pageSize?: number }): Promise<IActivitiesApiResponse>;
}
