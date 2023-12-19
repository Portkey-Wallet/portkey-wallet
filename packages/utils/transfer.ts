import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';

export type IGenerateTransferRawTransactionParams = {
  caContract: ContractBasic;
  contractAddress: string;
  caHash: string;
  symbol: string;
  amount: string;
  to: string;
};

export const generateTransferRawTransaction = async (params: IGenerateTransferRawTransactionParams) => {
  const rawResult = await params.caContract.encodedTx('ManagerForwardCall', {
    caHash: params.caHash,
    contractAddress: params.contractAddress,
    methodName: 'Transfer',
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
