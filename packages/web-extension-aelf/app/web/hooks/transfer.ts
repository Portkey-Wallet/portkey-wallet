import { useCallback } from 'react';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { divDecimalsStr, timesDecimals } from '@portkey-wallet/utils/converter';
import { request } from '@portkey-wallet/api/api-did';
import { CalculateTransactionFeeResponse, ChainId } from '@portkey-wallet/types';
import { getChainIdByAddress } from '@portkey-wallet/utils';
import { useGetTokenContract } from './contract';
import { getTokenIssueChainId } from 'utils/getTokenInfo';

export type GetTransferFeeParams = {
  sendAmount: string;
  decimals: string | number;
  symbol: string;
  toAddress: string;
  chainId: ChainId;
};
export const useGetTransferFee = () => {
  const defaultToken = useDefaultToken();
  const getTokenContract = useGetTokenContract();

  const getTransferFee = useCallback(
    async (isAELFCross: boolean, { sendAmount, decimals, symbol, toAddress, chainId }: GetTransferFeeParams) => {
      let calculateParams: any = {
        symbol,
        to: toAddress,
        amount: timesDecimals(sendAmount, decimals).toFixed(),
        memo: '',
      };

      const tokenContract = await getTokenContract(chainId);
      if (isAELFCross) {
        const toChainId = getChainIdByAddress(toAddress);
        const issueChainId = await getTokenIssueChainId({ tokenContract, paramsOption: { symbol } });
        calculateParams = { ...calculateParams, toChainId, issueChainId };
      }
      const req = await tokenContract.calculateTransactionFee(
        isAELFCross ? 'CrossChainTransfer' : 'Transfer',
        calculateParams,
      );
      if (req?.error) {
        request.errorReport('calculateTransactionFee', calculateParams, req.error);
      }

      let { TransactionFee } = (req.data as any) || {};
      TransactionFee = TransactionFee?.TransactionFee || TransactionFee;
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
