import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ChainId } from '@portkey-wallet/types';
import { getWallet } from '@portkey-wallet/utils/aelf';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { useCallback } from 'react';
import { getCurrentCaInfo, getCurrentChainInfoByChainId, getCurrentTxFeeByChainId } from 'utils/redux';

type CalculateRedPackageFeeParams = {
  count: string;
  decimals: string | number;
  chainId: ChainId;
  symbol: string;
};

export function useCalculateRedPacketFee() {
  const defaultToken = useDefaultToken();
  return useCallback(
    async (params: CalculateRedPackageFeeParams) => {
      const { count, decimals, chainId, symbol } = params;

      const amount = timesDecimals(count, decimals);
      const fee = getCurrentTxFeeByChainId(chainId).redPackage;

      const bigFee = timesDecimals(fee, defaultToken.decimals);
      const chainInfo = getCurrentChainInfoByChainId(chainId);
      const caInfo = getCurrentCaInfo(chainId);

      const tokenContract = await getContractBasic({
        contractAddress: chainInfo?.defaultToken.address || '',
        rpcUrl: chainInfo?.endPoint,
        account: getWallet(),
      });

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
          throw new Error('Insufficient transaction fee');
      } else {
        if (amount.minus(bigFee).gt(currentBalance?.data.balance)) throw new Error('Insufficient transaction fee');
      }
      return fee;
    },
    [defaultToken.decimals, defaultToken.symbol],
  );
}
