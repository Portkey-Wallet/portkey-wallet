import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
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
