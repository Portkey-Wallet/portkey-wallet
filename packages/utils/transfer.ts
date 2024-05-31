import { request } from '@portkey-wallet/api/api-did';
import { NetworkList } from '@portkey-wallet/constants/constants-ca/network';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { GuardiansApprovedType } from '@portkey-wallet/types/types-ca/guardian';

export type IGenerateTransferRawTransactionParams = {
  caContract: ContractBasic;
  contractAddress: string;
  caHash: string;
  symbol: string;
  amount: string;
  to: string;
  guardiansApproved?: GuardiansApprovedType[];
};

export const generateTransferRawTransaction = async (params: IGenerateTransferRawTransactionParams) => {
  const rawResult = await params.caContract.encodedTx('ManagerForwardCall', {
    caHash: params.caHash,
    contractAddress: params.contractAddress,
    methodName: 'Transfer',
    guardiansApproved: params.guardiansApproved,
    args: {
      symbol: params.symbol,
      to: params.to,
      amount: params.amount,
      memo: '',
    },
  });
  if (!rawResult || !rawResult.data) {
    throw new Error('Failed to get raw transaction.');
  }
  return rawResult.data;
};

export interface IReportTransactionParams {
  chainId: ChainId;
  caAddress: string;
  transactionId: string;
}
export function reportTransaction(params: IReportTransactionParams, currentNetwork: NetworkType): Promise<void> {
  const baseURL = NetworkList.find(item => item.networkType === currentNetwork)?.apiUrl;

  return request.activity.reportTransaction({
    baseURL,
    params,
  });
}
