import { useCallback } from 'react';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { divDecimalsStr, timesDecimals } from '@portkey-wallet/utils/converter';
import { request } from '@portkey-wallet/api/api-did';
import { CalculateTransactionFeeResponse, ChainId } from '@portkey-wallet/types';
import { useGetTokenContract } from './contract';

export type GetTransferFeeParams = {
  sendAmount: string;
  decimals: string;
  symbol: string;
  toAddress: string;
  chainId: ChainId;
};
export const useGetTransferFee = () => {
  const defaultToken = useDefaultToken();
  const getTokenContract = useGetTokenContract();

  const getTransferFee = useCallback(
    async ({ sendAmount, decimals, symbol, toAddress, chainId }: GetTransferFeeParams) => {
      const calculateParams = {
        symbol,
        to: toAddress,
        amount: timesDecimals(sendAmount, decimals).toFixed(),
        memo: '',
      };

      const tokenContract = await getTokenContract(chainId);

      const req = await tokenContract.calculateTransactionFee('Transfer', calculateParams);

      if (req?.error) {
        request.errorReport('calculateTransactionFee', calculateParams, req.error);
      }

      const { TransactionFee } = (req.data as CalculateTransactionFeeResponse) || {};

      console.log('TransactionFee ===', req);
      // // V2 calculateTransactionFee
      // if (TransactionFees) {
      //   const { ChargingAddress, Fee } = TransactionFees;
      //   const myPayFee = isMyPayTransactionFee(ChargingAddress, chainId);
      //   if (myPayFee) {
      //     return divDecimalsStr(Fee?.[defaultToken.symbol], defaultToken.decimals).toString();
      //   }
      //   return '0';
      // }
      // V1 calculateTransactionFee
      if (TransactionFee) {
        return divDecimalsStr(TransactionFee?.[defaultToken.symbol], defaultToken.decimals).toString();
      }
      throw { code: 500, message: 'no enough fee' };
    },
    [defaultToken.decimals, defaultToken.symbol, getTokenContract],
  );

  return getTransferFee;
};
