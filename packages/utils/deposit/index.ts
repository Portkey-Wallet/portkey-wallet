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

const UNAUTHRORIZED_TOKEN_CODE = 40001;
const MAX_RETRY_TIMES = 5;

class DepositService implements IDepositService {
  private transferToken: string | null = null;
  private tokenRequestParams: TQueryTransferAuthTokenRequest | null = null;
  private tokenRequestApiUrl: string | null = null;
  private retryTimes = 0;

  async getTokenList(params: TGetTokenListRequest): Promise<TTokenItem[]> {
    const {
      code,
      data: { tokenList },
    } = await request.deposit.getTokenList({
      params,
    });
    await this.checkTokenAuthrorizedAndRetry(code);
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
      code,
      data: { tokenList },
    } = await request.deposit.getTokenListByNetwork({
      params,
    });
    await this.checkTokenAuthrorizedAndRetry(code);
    return tokenList;
  }

  async getDepositTokenList(): Promise<TDepositTokenItem[]> {
    request.set('headers', { 'T-Authorization': this.transferToken });
    const params: TGetDepositTokenListRequest = {
      type: BusinessType.Deposit,
    };
    const {
      code,
      data: { tokenList },
    } = await request.deposit.getDepositTokenList({
      params,
    });
    await this.checkTokenAuthrorizedAndRetry(code);
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
      code,
      data: { networkList },
    } = await request.deposit.getNetworkList({
      params,
    });
    await this.checkTokenAuthrorizedAndRetry(code);
    return networkList;
  }

  async getDepositInfo(params: TGetDepositInfoRequest): Promise<TDepositInfo> {
    request.set('headers', { 'T-Authorization': this.transferToken });
    const {
      code,
      data: { depositInfo },
    } = await request.deposit.getDepositInfo({
      params,
    });
    await this.checkTokenAuthrorizedAndRetry(code);
    return depositInfo;
  }

  async depositCalculator(params: TGetDepositCalculateRequest): Promise<TConversionRate> {
    request.set('headers', { 'T-Authorization': this.transferToken });
    const {
      code,
      data: { conversionRate },
    } = await request.deposit.depositCalculator({
      params,
    });
    await this.checkTokenAuthrorizedAndRetry(code);
    return conversionRate;
  }

  async getLastRecordsList(): Promise<TRecordsListItem | null> {
    request.set('headers', { 'T-Authorization': this.transferToken });

    const twoHoursMillisecond = 2 * 60 * 60 * 1000;
    const startTimestamp = Date.now() - twoHoursMillisecond;

    const params: TGetRecordsListRequest = {
      type: 1,
      status: 0,
      skipCount: 0,
      maxResultCount: 1,
      startTimestamp,
    };
    const {
      code,
      data: { items },
    } = await request.deposit.recordList({
      params,
    });
    await this.checkTokenAuthrorizedAndRetry(code);
    return items && items.length > 0 ? items[0] : null;
  }

  async checkTokenAuthrorizedAndRetry(code: string | number) {
    if (code === UNAUTHRORIZED_TOKEN_CODE || code === `${UNAUTHRORIZED_TOKEN_CODE}`) {
      if (this.tokenRequestParams && this.tokenRequestApiUrl && this.retryTimes <= MAX_RETRY_TIMES) {
        this.retryTimes++;
        await this.getTransferToken(this.tokenRequestParams, this.tokenRequestApiUrl);
      }
    }
  }

  async getTransferToken(params: TQueryTransferAuthTokenRequest, apiUrl: string): Promise<string> {
    // save request params for retry
    this.tokenRequestParams = params;
    this.tokenRequestApiUrl = apiUrl;

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
