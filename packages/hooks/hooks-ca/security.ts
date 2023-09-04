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
  showDailyBalance: BigNumber;
  // balances with decimals processed
  showSingleBalance: BigNumber;
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
      let dailyBalance, singleBalance;
      if (!limitReq?.error) {
        const { singleLimit, dailyLimit, dailyTransferredAmount } = limitReq.data || {};
        dailyBalance = ZERO.plus(dailyLimit).minus(dailyTransferredAmount);
        singleBalance = ZERO.plus(singleLimit);
      } else if (!defaultLimitReq?.error) {
        const { defaultLimit } = defaultLimitReq.data || {};
        dailyBalance = ZERO.plus(defaultLimit);
        singleBalance = ZERO.plus(defaultLimit);
      }
      if (!dailyBalance || !singleBalance) return;
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
