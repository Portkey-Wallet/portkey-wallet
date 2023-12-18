import { useCallback } from 'react';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { useDefaultToken } from './chainList';
import { divDecimalsStr, timesDecimals } from '@portkey-wallet/utils/converter';
import { request } from '@portkey-wallet/api/api-did';
import { useCurrentWalletInfo } from './wallet';
import { CalculateTransactionFeeResponse, ChainId } from '@portkey-wallet/types';
import { isMyPayTransactionFee } from 'utils/redux';

export type GetTransferFeeParams = {
  isCross: boolean;
  sendAmount: string;
  decimals: string;
  symbol: string;
  caContract: ContractBasic;
  tokenContractAddress: string;
  toAddress: string;
  chainId: ChainId;
};
export const useGetTransferFee = () => {
  const defaultToken = useDefaultToken();
  const wallet = useCurrentWalletInfo();

  const getTransferFee = useCallback(
    async ({
      isCross,
      sendAmount,
      decimals,
      symbol,
      caContract,
      tokenContractAddress,
      toAddress,
      chainId,
    }: GetTransferFeeParams) => {
      const methodName = isCross ? 'ManagerTransfer' : 'ManagerForwardCall';
      const calculateParams = isCross
        ? {
            contractAddress: tokenContractAddress,
            caHash: wallet.caHash,
            symbol,
            to: wallet.address,
            amount: timesDecimals(sendAmount, decimals).toFixed(),
            memo: '',
          }
        : {
            caHash: wallet.caHash,
            contractAddress: tokenContractAddress,
            methodName: 'Transfer',
            args: {
              symbol: symbol,
              to: toAddress,
              amount: timesDecimals(sendAmount, decimals).toFixed(),
              memo: '',
            },
          };

      const req = await caContract.calculateTransactionFee(methodName, calculateParams);

      if (req?.error) request.errorReport('calculateTransactionFee', calculateParams, req.error);

      const { TransactionFees, TransactionFee } = (req.data as CalculateTransactionFeeResponse) || {};
      // V2 calculateTransactionFee
      if (TransactionFees) {
        const { ChargingAddress, Fee } = TransactionFees;
        const myPayFee = isMyPayTransactionFee(ChargingAddress, chainId);
        if (myPayFee) return divDecimalsStr(Fee?.[defaultToken.symbol], defaultToken.decimals).toString();
        return '0';
      }
      // V1 calculateTransactionFee
      if (TransactionFee)
        return divDecimalsStr(TransactionFee?.[defaultToken.symbol], defaultToken.decimals).toString();
      throw { code: 500, message: 'no enough fee' };
    },
    [defaultToken.decimals, defaultToken.symbol, wallet.address, wallet.caHash],
  );

  return getTransferFee;
};
