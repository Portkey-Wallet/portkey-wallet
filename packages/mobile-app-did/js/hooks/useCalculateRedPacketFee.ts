import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ChainId } from '@portkey-wallet/types';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { useCallback } from 'react';
import { getCurrentCaInfoByChainId, getCurrentTxFeeByChainId, getViewTokenContractByChainId } from 'utils/redux';

type CalculateRedPackageFeeParams = {
  count: string;
  decimals: string | number;
  chainId: ChainId;
  symbol: string;
};
export const InsufficientTransactionFee = 'Insufficient transaction fee';
export function useCalculateRedPacketFee() {
  const defaultToken = useDefaultToken();
  return useCallback(
    async (params: CalculateRedPackageFeeParams) => {
      const { count, decimals, chainId, symbol } = params;

      const amount = timesDecimals(count, decimals);
      const fee = getCurrentTxFeeByChainId(chainId).redPackage;

      const bigFee = timesDecimals(fee, defaultToken.decimals);
      const caInfo = getCurrentCaInfoByChainId(chainId);

      const tokenContract = await getViewTokenContractByChainId(chainId);

      const list = [
        tokenContract.callViewMethod('GetBalance', {
          symbol,
          owner: caInfo?.caAddress,
        }),
      ];
      if (defaultToken.symbol !== symbol) {
        list.push(
          tokenContract.callViewMethod('GetBalance', {
            symbol: defaultToken.symbol,
            owner: caInfo?.caAddress,
          }),
        );
      }

      const [currentBalance, feeBalance] = await Promise.all(list);

      if (currentBalance.error) throw currentBalance.error;
      if (feeBalance?.error) throw feeBalance.error;

      if (feeBalance?.data) {
        if (bigFee.gt(feeBalance?.data.balance) || amount.gt(currentBalance?.data.balance))
          throw new Error(InsufficientTransactionFee);
      } else {
        if (amount.plus(bigFee).gt(currentBalance?.data.balance)) throw new Error(InsufficientTransactionFee);
      }
      return timesDecimals(fee, defaultToken.decimals).toString();
    },
    [defaultToken.decimals, defaultToken.symbol],
  );
}
