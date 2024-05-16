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
} from '@portkey-wallet/types/types-ca/deposit';

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
  const {
    data: { access_token },
  } = await request.deposit.getTransferToken({
    params,
  });
  return access_token;
};
