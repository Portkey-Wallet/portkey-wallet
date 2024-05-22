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
} from '@portkey-wallet/types/types-ca/deposit';
import { ChainId } from '@portkey-wallet/types';
import { customFetch } from '@portkey-wallet/utils/fetch';
import { stringify } from 'query-string';

class DepositService implements IDepositService {
  private transferToken = '';

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
    chainId: ChainId;
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

  async getNetworkList({ chainId, symbol }: { chainId: ChainId; symbol: string }): Promise<TNetworkItem[]> {
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
    // return new Promise(resolve => {
    //   const depositInfo: TDepositInfo = {
    //     depositAddress: '0xb99e9c1367e3afda93b815c700e3d27b3b3bee7b',
    //     minAmount: '0',
    //     minAmountUsd: '0',
    //     extraNotes: [
    //       'Deposits will be unlocked and available for withdrawal/other activities after Bundle 2 confirmation.',
    //       "To avoid potential losses, please don't deposit tokens other than USDT.",
    //     ],
    //   };
    //   resolve(depositInfo);
    // });
    request.set('headers', { 'T-Authorization': this.transferToken });
    const {
      data: { depositInfo },
    } = await request.deposit.getDepositInfo({
      params,
    });
    return depositInfo;
  }

  async depositCalculator(params: TGetDepositCalculateRequest): Promise<TConversionRate> {
    // return new Promise(resolve => {
    //   const conversionRate: TConversionRate = {
    //     fromSymbol: 'USDT',
    //     toSymbol: 'SGR-1',
    //     fromAmount: '1',
    //     toAmount: '0.08256395',
    //     minimumReceiveAmount: '0.07843575',
    //   };
    //   resolve(conversionRate);
    // });
    request.set('headers', { 'T-Authorization': this.transferToken });
    const {
      data: { conversionRate },
    } = await request.deposit.depositCalculator({
      params,
    });
    return conversionRate;
  }

  async getTransferToken(params: TQueryTransferAuthTokenRequest, apiUrl: string): Promise<string> {
    const { access_token, token_type } = await customFetch(apiUrl + '/api/app/transfer/connect/token', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      body: stringify(params),
    });
    const token = `${token_type} ${access_token}`;
    this.transferToken = token;
    return token;
  }
}

const depositService = new DepositService();
export default depositService;

export const getTokenList = async (params: TGetTokenListRequest): Promise<TTokenItem[]> => {
  const {
    data: { tokenList },
  } = await request.deposit.getTokenList({
    params,
  });
  return tokenList;
};

export const getTokenListByNetwork = async (params: TGetTokenListByNetworkRequest): Promise<TTokenItem[]> => {
  const {
    data: { tokenList },
  } = await request.deposit.getTokenListByNetwork({
    params,
  });
  return tokenList;
};

export const getDepositTokenList = async (params: TGetDepositTokenListRequest): Promise<TDepositTokenItem[]> => {
  const {
    data: { tokenList },
  } = await request.deposit.getDepositTokenList({
    params,
  });
  return tokenList;
};

export const getNetworkList = async (params: TGetNetworkListRequest): Promise<TNetworkItem[]> => {
  const {
    data: { networkList },
  } = await request.deposit.getNetworkList({
    params,
  });
  return networkList;
};

export const getDepositInfo = async (params: TGetDepositInfoRequest): Promise<TDepositInfo> => {
  const {
    data: { depositInfo },
  } = await request.deposit.getDepositInfo({
    params,
  });
  return depositInfo;
};

export const depositCalculator = async (params: TGetDepositCalculateRequest): Promise<TConversionRate> => {
  const {
    data: { conversionRate },
  } = await request.deposit.depositCalculator({
    params,
  });
  return conversionRate;
};

// todo_wade: fix the type
export const getTransferToken = async (params: { chain_id: string }): Promise<string> => {
  // console.log('aaaaaa request.headers : ', request.headers);
  request.set('headers', { 'T-Authorization': 'T-authorization-TEST' });
  console.log('aaaaaa request.defaultConfig : ', request.defaultConfig);
  // const {
  //   data: { access_token },
  // } = await request.deposit.getTransferToken({
  //   params,
  // });
  const access_token = '';
  console.log('aaaaaa access_token : ', access_token);
  return access_token;
};
