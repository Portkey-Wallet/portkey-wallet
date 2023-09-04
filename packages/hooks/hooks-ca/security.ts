import { useCallback } from 'react';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { useCurrentCaHash } from './wallet';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { ZERO } from '@portkey-wallet/constants/misc';
import BigNumber from 'bignumber.js';

export type CheckTransferLimitParams = {
  caContract: ContractBasic;
  symbol: string;
  decimals: number | string;
  amount: string;
};

export type TransferLimitResult = {
  isDailyLimited: boolean;
  isSingleLimited: boolean;
  // balances with decimals processed
  showDailyBalance: BigNumber;
  // balances with decimals processed
  showSingleBalance: BigNumber;
  dailyBalance: BigNumber;
  singleBalance: BigNumber;
};

export function useCheckTransferLimit() {
  const caHash = useCurrentCaHash();
  return useCallback(
    async (params: CheckTransferLimitParams): Promise<TransferLimitResult | undefined> => {
      const { caContract, symbol, decimals, amount } = params;
      const limit = await caContract.callViewMethod('GetTransferLimit', {
        caHash: caHash,
        symbol: symbol,
      });
      if (limit.error) return;
      const { singleLimit, dailyLimit, dailyTransferredAmount } = limit.data;
      const dailyBalance = ZERO.plus(dailyLimit).minus(dailyTransferredAmount);
      const singleBalance = ZERO.plus(singleLimit);
      const bigAmount = timesDecimals(amount, decimals);
      return {
        isDailyLimited: bigAmount.gt(dailyBalance),
        isSingleLimited: bigAmount.gt(singleBalance),
        dailyBalance,
        showDailyBalance: divDecimals(dailyBalance, decimals),
        singleBalance,
        showSingleBalance: divDecimals(singleBalance, decimals),
      };
    },
    [caHash],
  );
}
