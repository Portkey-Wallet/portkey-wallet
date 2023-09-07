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

export type CheckTransferLimitResult = {
  isDailyLimited: boolean;
  isSingleLimited: boolean;
  // balances with decimals processed
  showDailyLimit: BigNumber;
  // balances with decimals processed
  showDailyBalance: BigNumber;
  // balances with decimals processed
  showSingleBalance: BigNumber;
  dailyLimit: BigNumber;
  dailyBalance: BigNumber;
  singleBalance: BigNumber;
};

export function useCheckTransferLimit() {
  const caHash = useCurrentCaHash();
  return useCallback(
    async (params: CheckTransferLimitParams): Promise<CheckTransferLimitResult | undefined> => {
      const { caContract, symbol, decimals, amount } = params;
      const [limitReq, defaultLimitReq] = await Promise.all([
        caContract.callViewMethod('GetTransferLimit', {
          caHash: caHash,
          symbol: symbol,
        }),
        caContract.callViewMethod('GetDefaultTokenTransferLimit', {
          caHash: caHash,
          symbol: symbol,
        }),
      ]);
      const bigAmount = timesDecimals(amount, decimals);
      let dailyBalance, singleBalance, dailyLimit;
      if (!limitReq?.error) {
        const { singleLimit, dailyLimit: contractDailyLimit, dailyTransferredAmount } = limitReq.data || {};
        dailyLimit = ZERO.plus(contractDailyLimit);
        dailyBalance = dailyLimit.minus(dailyTransferredAmount);
        singleBalance = ZERO.plus(singleLimit);
      } else if (!defaultLimitReq?.error) {
        const { defaultLimit } = defaultLimitReq.data || {};
        dailyLimit = ZERO.plus(defaultLimit);
        dailyBalance = dailyLimit;
        singleBalance = ZERO.plus(defaultLimit);
      }
      if (!dailyLimit || !dailyBalance || !singleBalance || dailyBalance.isNaN() || singleBalance.isNaN()) return;
      return {
        isDailyLimited: bigAmount.gt(dailyBalance),
        isSingleLimited: bigAmount.gt(singleBalance),
        dailyLimit,
        showDailyLimit: divDecimals(dailyLimit, decimals),
        dailyBalance,
        showDailyBalance: divDecimals(dailyBalance, decimals),
        singleBalance,
        showSingleBalance: divDecimals(singleBalance, decimals),
      };
    },
    [caHash],
  );
}
