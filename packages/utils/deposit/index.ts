import { request } from '@portkey-wallet/api/api-did';
import {
  TGetTokenListRequest,
  TTokenItem,
  TGetTokenListByNetworkRequest,
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
  NetworkStatus,
  BusinessType,
  TGetRecordsListRequest,
  TRecordsListItem,
  TRecordsStatus,
} from '@portkey-wallet/types/types-ca/deposit';
import { ChainId } from '@portkey-wallet/types';
import { customFetch } from '@portkey-wallet/utils/fetch';
import { stringify } from 'query-string';
import { AElfWallet } from '@portkey-wallet/types/aelf';

class DepositService implements IDepositService {
  private transferToken: string | null = null;

  /*
  private manager: AElfWallet | null = null;
  private caHash: string | null = null;
  private apiUrl: string | null = null;

  setTokenRequestData({ manager, caHash, apiUrl }: { manager: AElfWallet; caHash: string; apiUrl: string }) {
    this.manager = manager;
    this.caHash = caHash;
    this.apiUrl = apiUrl;
  }

  async checkTransferToken() {
    if (this.transferToken) return;
    if (!this.manager) {
      throw new Error('Manager is not set');
    }
    if (!this.caHash) {
      throw new Error('CaHash is not set');
    }
    if (!this.apiUrl) {
      throw new Error
    }

    const plainTextOrigin = `Nonce:${Date.now()}`;
    const plainTextHex = Buffer.from(plainTextOrigin).toString('hex').replace('0x', '');
    const plainTextHexSignature = Buffer.from(plainTextHex).toString('hex');

    const signature = AElf.wallet.sign(plainTextHexSignature, manager.keyPair).toString('hex');
    const pubkey = (manager.keyPair as any).getPublic('hex');

    const params: TQueryTransferAuthTokenRequest = {
      pubkey: pubkey,
      signature: signature,
      plain_text: plainTextHex,
      ca_hash: caHash ?? '',
      chain_id: 'AELF', // todo_wade: fix the chain_id
      managerAddress: this.manager.address,
    };
    const token = await this.getTransferToken(params);
  }
  */

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
      ? {
          type,
          chainId,
        }
      : { type, chainId, network };
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

  async getLastRecordsList(): Promise<TRecordsListItem> {
    return new Promise(resolve => {
      resolve({
        id: '',
        orderType: '',
        status: TRecordsStatus.Failed,
      });
    });
    request.set('headers', { 'T-Authorization': this.transferToken });
    const params: TGetRecordsListRequest = {
      type: 1,
      status: 0,
      skipCount: 0,
      maxResultCount: 1,
    };
    const {
      data: { recordsList },
    } = await request.deposit.recordList({
      params,
    });
    return recordsList;
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
