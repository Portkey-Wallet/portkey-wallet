import { request } from '@portkey-wallet/api/api-did';
import {
  TGetTokenListRequest,
  TTokenItem,
  TGetDepositTokenListRequest,
  TDepositTokenItem,
  TGetNetworkListRequest,
  TNetworkItem,
  TGetDepositInfoRequest,
  TDepositInfo,
  TGetDepositCalculateRequest,
  TConversionRate,
  IDepositService,
  TQueryTransferAuthTokenRequest,
  BusinessType,
  TGetRecordsListRequest,
  TRecordsListItem,
} from '@portkey-wallet/types/types-ca/deposit';
import { ChainId } from '@portkey-wallet/types';
import { customFetch } from '@portkey-wallet/utils/fetch';
import { stringify } from 'query-string';

class DepositService implements IDepositService {
  private transferToken: string | null = null;

  async getTokenList(params: TGetTokenListRequest): Promise<TTokenItem[]> {
    const {
      data: { tokenList },
    } = await request.deposit.getTokenList({
      params,
    });
    return tokenList;
  }

  async getTokenListByNetwork({
    type,
    network,
    chainId,
  }: {
    type: 'from' | 'to';
    network?: string;
    chainId?: ChainId;
  }): Promise<TTokenItem[]> {
    request.set('headers', { 'T-Authorization': this.transferToken });
    const params = network
      ? { type, chainId, network }
      : {
          type,
          chainId,
        };
    const {
      data: { tokenList },
    } = await request.deposit.getTokenListByNetwork({
      params,
    });
    return tokenList;
  }

  async getDepositTokenList(): Promise<TDepositTokenItem[]> {
    request.set('headers', { 'T-Authorization': this.transferToken });
    const params: TGetDepositTokenListRequest = {
      type: BusinessType.Deposit,
    };
    const {
      data: { tokenList },
    } = await request.deposit.getDepositTokenList({
      params,
    });
    return tokenList;
  }

  async getNetworkList({ chainId, symbol }: { chainId: ChainId; symbol?: string }): Promise<TNetworkItem[]> {
    request.set('headers', { 'T-Authorization': this.transferToken });
    const params: TGetNetworkListRequest = {
      type: BusinessType.Deposit,
      chainId,
      symbol,
    };
    const {
      data: { networkList },
    } = await request.deposit.getNetworkList({
      params,
    });
    return networkList;
  }

  async getDepositInfo(params: TGetDepositInfoRequest): Promise<TDepositInfo> {
    request.set('headers', { 'T-Authorization': this.transferToken });
    const {
      data: { depositInfo },
    } = await request.deposit.getDepositInfo({
      params,
    });
    return depositInfo;
  }

  async depositCalculator(params: TGetDepositCalculateRequest): Promise<TConversionRate> {
    request.set('headers', { 'T-Authorization': this.transferToken });
    const {
      data: { conversionRate },
    } = await request.deposit.depositCalculator({
      params,
    });
    return conversionRate;
  }

  async getLastRecordsList(): Promise<TRecordsListItem | null> {
    request.set('headers', { 'T-Authorization': this.transferToken });
    const params: TGetRecordsListRequest = {
      type: 1,
      status: 0,
      skipCount: 0,
      maxResultCount: 1,
    };
    const {
      data: { items },
    } = await request.deposit.recordList({
      params,
    });
    return items && items.length > 0 ? items[0] : null;
  }

  async getTransferToken(params: TQueryTransferAuthTokenRequest, apiUrl: string): Promise<string> {
    const { access_token, token_type } = await customFetch(apiUrl + '/api/app/transfer/connect/token', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      body: stringify(params),
    });
    const token = `${token_type} ${access_token}`;
    this.transferToken = token;
    request.set('headers', { 'T-Authorization': this.transferToken });
    return token;
  }
}

const depositService = new DepositService();
export default depositService;
